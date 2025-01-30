/* eslint-disable @typescript-eslint/no-explicit-any */
import { HfInference } from '@huggingface/inference';
import { 
    MedicationImageRequest, 
    ImageGenerationConfig
} from './types/image-types';
import { isValidBase64Image } from '@/components/ui/medimind-ai-assistant/report-modal-ai/services/functions/imagePresenter';

import pQueue from 'p-queue';

interface MedicationImageResult {
    usage: string;
    application: string;
    precaution: string;
    palliativeCare?: string;
    monitoring?: string;
}

interface ImageValidationCriteria {
    minWidth: number;
    minHeight: number;
    aspectRatio: { min: number; max: number };
    qualityThresholds: {
        minSharpness: number;
        minContrast: number;
        maxNoise: number;
    };
}

export const sharedHfInstance = new HfInference(process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY);

export class ImageGenerationService {
    private hf: HfInference = sharedHfInstance;
    private readonly config: ImageGenerationConfig;
    private readonly model: string = "stabilityai/stable-diffusion-3.5-large";
    private readonly validationCriteria: Record<string, ImageValidationCriteria>;
    private queue: pQueue;

    constructor() {
        const hfToken = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
        
        if (!hfToken) {
            throw new Error('Token Hugging Face não configurado');
        }

        this.config = {
            maxRetries: 3,
            timeout: 60000,
            initialDelay: 2000,
            maxDelay: 10000,
            qualityThreshold: 0.8,
            batchDelay: 2000,
            modelParams: {
                negative_prompt: "text, watermark, low quality, blurry, distorted, deformed, unrealistic, cartoon, anime, drawing, sketch, painting",
                num_inference_steps: 30,
                guidance_scale: 7.0,
                width: 768,
                height: 512,
            },
            rateLimitDelay: 30000, // Reduzido para 30 segundos
            concurrency: 3,
            maxRequestsPerMinute: 10
        };

        this.validationCriteria = {
            usage: {
                minWidth: 1024,
                minHeight: 1024,
                aspectRatio: { min: 0.9, max: 1.1 },
                qualityThresholds: {
                    minSharpness: 0.85,
                    minContrast: 0.8,
                    maxNoise: 0.15
                }
            },
            application: {
                minWidth: 1024,
                minHeight: 768,
                aspectRatio: { min: 1.3, max: 1.5 },
                qualityThresholds: {
                    minSharpness: 0.9,
                    minContrast: 0.85,
                    maxNoise: 0.1
                }
            },
            precaution: {
                minWidth: 1200,
                minHeight: 800,
                aspectRatio: { min: 1.4, max: 1.6 },
                qualityThresholds: {
                    minSharpness: 0.8,
                    minContrast: 0.9,
                    maxNoise: 0.2
                }
            }
        };

        this.queue = new pQueue({
            concurrency: this.config.concurrency,
            interval: 60000,
            intervalCap: this.config.maxRequestsPerMinute,
            autoStart: true
        });
    }

    private async logError(error: any, context: string): Promise<void> {
        const timestamp = new Date().toISOString();
        const errorDetails = {
            context,
            timestamp,
            message: error.message,
            stack: error.stack,
            status: error.status,
            details: error.details || 'Sem detalhes adicionais'
        };
    
        console.error('Erro detalhado:', errorDetails);
    
        // Adicionar integração com serviços de logging
        try {
            // Exemplo: await this.errorLoggingService.log(errorDetails);
        } catch (loggingError) {
            console.error('Erro ao registrar erro:', loggingError);
        }
    }

    private async monitorRequest<T>(
        requestFn: () => Promise<T>,
        context: string
    ): Promise<T> {
        const startTime = Date.now();
        const requestId = Math.random().toString(36).substring(7);
    
        console.log(`[${requestId}] Iniciando ${context}`);
    
        try {
            const result = await requestFn();
            const duration = Date.now() - startTime;
            
            console.log(`[${requestId}] ${context} completado em ${duration}ms`);
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            
            console.error(`[${requestId}] Erro em ${context} após ${duration}ms:`, error);
            throw error;
        }
    }

    private async processImageResponse(response: Blob): Promise<string> {
        if (response.size === 0) {
            throw new Error('Blob vazio recebido');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (!result || !isValidBase64Image(result)) {
                    reject(new Error('Imagem base64 inválida gerada'));
                } else {
                    resolve(result);
                }
            };
            reader.onerror = () => reject(new Error('Erro ao ler blob'));
            reader.readAsDataURL(response);
        });
    }

    private async generateSingleImage(prompt: string, type: string): Promise<string> {
        try {
            return await this.queue.add(async () => {
                console.log(`Gerando imagem ${type} - Iniciando processamento`);
                const response = await this.hf.textToImage({
                    model: this.model,
                    inputs: prompt,
                    parameters: this.config.modelParams
                });

                const base64Image = await this.processImageResponse(response);
                return Promise.resolve(base64Image); // Garantir retorno Promise<string>
            }) as unknown as Promise<string>;  // Garantir que o retorno seja tratado como Promise<string>
        } catch (error: any) {
            throw error;
        }
    }    

    private async generateWithRetry(
        generateFn: () => Promise<string>
    ): Promise<string> {
        let attempt = 0;
        let lastError: Error | null = null;

        while (attempt < this.config.maxRetries) {
            try {
                if (attempt > 0) {
                    const backoffTime = Math.min(
                        this.config.initialDelay * Math.pow(2, attempt),
                        this.config.maxDelay
                    );
                    console.log(`Aguardando ${backoffTime}ms antes da tentativa ${attempt + 1}`);
                    await new Promise(resolve => setTimeout(resolve, backoffTime));
                }

                return await generateFn();

            } catch (error: any) {
                lastError = error;
                console.error(`Tentativa ${attempt + 1} falhou:`, error.message);
                attempt++;
            }
        }

        throw lastError || new Error('Falha na geração da imagem após várias tentativas');
    }

    async generateMedicationImages(medicationRequest: MedicationImageRequest): Promise<MedicationImageResult> {
        const medicationName = medicationRequest.name;
        return await this.monitorRequest(
            async () => {
                try {
                    console.log('Iniciando geração de imagens para:', medicationName);

                    const [usageImage, applicationImage, precautionImage] = await Promise.all([
                        this.generateWithRetry(() => this.generateSingleImage(this.createUsagePrompt(medicationRequest), 'usage')),
                        this.generateWithRetry(() => this.generateSingleImage(this.createApplicationPrompt(medicationRequest), 'application')),
                        this.generateWithRetry(() => this.generateSingleImage(this.createPrecautionPrompt(medicationRequest), 'precaution'))
                    ]);

                    let palliativeCareImage, monitoringImage;

                    if (medicationRequest.palliativeCare) {
                        palliativeCareImage = await this.generateWithRetry(
                            () => this.generateSingleImage(this.createPalliativeCarePrompt(medicationRequest), 'palliativeCare')
                        );
                    }

                    if (medicationRequest.patientContext) {
                        monitoringImage = await this.generateWithRetry(
                            () => this.generateSingleImage(this.createMonitoringPrompt(medicationRequest), 'monitoring')
                        );
                    }

                    return {
                        usage: usageImage,
                        application: applicationImage,
                        precaution: precautionImage,
                        ...(palliativeCareImage && { palliativeCare: palliativeCareImage }),
                        ...(monitoringImage && { monitoring: monitoringImage })
                    };
                } catch (error: any) {
                    await this.logError(error, 'generateMedicationImages');
                    throw new Error(`Erro na geração de imagens: ${error.message}`);
                }
            },
            'generateMedicationImages'
        );
    }

    private createUsagePrompt(medication: any): string {
        return `Instruções detalhadas para o uso de ${medication.name} (${medication.dosage}).
      
      [ORIENTAÇÕES PASSO A PASSO]
      1. Identificar o medicamento e confirmar a dosagem indicada.
      2. Verificar a embalagem quanto a danos ou violação de lacre.
      3. Ler a bula atentamente antes do uso.
      4. Administrar o medicamento conforme orientação médica.
      5. Armazenar em local adequado, longe do alcance de crianças.
      
      [ELEMENTOS VISUAIS]
      - Ilustração 3D ultra realista do medicamento em foco, com detalhes nítidos.
      - Fundo branco e limpo para destacar o medicamento, sem distrações.
      - Setas e legendas explicativas em português, com tipografia clara.
      - Representação precisa do tamanho e formato do medicamento.
      
      [PADRÕES TÉCNICOS]
      - Resolução mínima: 2048x2048 pixels.
      - Sem marcas d'água ou elementos decorativos.
      - Texto e legendas em português, visíveis e legíveis.
      `.trim().replace(/\s+/g, ' ');
    }      
    
    private createApplicationPrompt(medication: any): string {
        return `Guia visual passo a passo para administração de ${medication.name} (${medication.dosage}).
      
      [INSTRUÇÕES VISUAIS PASSO A PASSO]
      1. Higienizar as mãos antes de manipular o medicamento.
      2. Confirmar a dosagem e a embalagem.
      3. Preparar os materiais necessários (seringa, algodão, álcool).
      4. Administrar o medicamento corretamente no local indicado (com detalhes do local de aplicação).
      5. Descartar os materiais usados de forma segura e conforme os protocolos.
      
      [ELEMENTOS VISUAIS]
      - Fundo clínico moderno e limpo, com luz natural para um ambiente acolhedor.
      - Equipamentos médicos organizados de forma prática.
      - Setas e números indicando cada passo de forma clara, com foco no procedimento correto.
      - Legendas descritivas em português para cada ação realizada.
      
      [PADRÕES TÉCNICOS]
      - Imagem em alta qualidade (2048x2048 pixels), com detalhes nítidos.
      - Sem elementos decorativos desnecessários que possam distrair do processo médico.
      - Texto totalmente em português, legível e bem posicionado.
      `.trim().replace(/\s+/g, ' ');
    }      
    
    private createPrecautionPrompt(medication: any): string {
        return `Infográfico profissional de precauções para o uso de ${medication.name} (${medication.dosage}).
      
      [PRECAUÇÕES IMPORTANTES]
      1. Não utilize em casos de alergia ao princípio ativo.
      2. Evite a exposição ao sol durante o tratamento.
      3. Informe ao médico sobre o uso de outros medicamentos.
      4. Armazene o medicamento em local seguro e fresco.
      5. Em caso de efeitos adversos, procure orientação médica imediatamente.
      
      [ELEMENTOS VISUAIS]
      - Ícones de alerta claros e padronizados, com cores vivas.
      - Cores de risco (verde, amarelo, vermelho) para indicar diferentes níveis de precaução.
      - Layout organizado em formato de grade (2x5), fácil de ler e entender.
      - Texto e legendas explicativas em português, com um estilo gráfico profissional.
      
      [PADRÕES TÉCNICOS]
      - Resolução: 2048x2048 pixels.
      - Texto totalmente em português.
      - Sem marcas ou distúrbios na visualização dos ícones.
      `.trim().replace(/\s+/g, ' ');
    }  
    
    private createPalliativeCarePrompt(request: MedicationImageRequest): string {
        const { name, dosage, palliativeCare, patientContext } = request;
        return `Guia visual de cuidados paliativos para ${name} (${dosage}).
      
      [PERFIL DO PACIENTE]
      - Condição: ${palliativeCare?.patientCondition}
      - Mobilidade: ${palliativeCare?.mobilityStatus}
      - Nível de dor: ${palliativeCare?.painLevel}/10
      - Idade: ${patientContext?.age} anos
      
      [CUIDADOS ESPECÍFICOS]
      1. Posicionar corretamente o paciente no leito, com apoio adequado.
      2. Garantir conforto com travesseiros e apoio lombar, em ambiente calmo.
      3. Administrar a medicação de forma segura, monitorando a reação do paciente.
      4. Monitorar sinais vitais regularmente e ajustar a posição do paciente conforme necessário.
      
      [ELEMENTOS VISUAIS]
      - Ambiente hospitalar tranquilo e iluminado, com cores suaves e acolhedoras.
      - Setas e legendas descritivas em português, explicando cada passo claramente.
      - Representação humanizada do paciente, com detalhes no conforto e ambiente.
      
      [PADRÕES TÉCNICOS]
      - Imagem em alta resolução (2048x2048 pixels).
      - Texto totalmente em português, legível e bem posicionado.
      `.trim().replace(/\s+/g, ' ');
    }      
    
    private createMonitoringPrompt(request: MedicationImageRequest): string {
        const { name, dosage, patientContext } = request;
        return `Protocolo visual de monitoramento para o uso de ${name} (${dosage}).
      
      [DADOS DO PACIENTE]
      - Idade: ${patientContext?.age} anos
      - Peso: ${patientContext?.weight ? `${patientContext.weight} kg` : 'Não informado'}
      - Mobilidade: ${patientContext?.mobility}
      - Necessidades especiais: ${patientContext?.specialNeeds?.join(', ') || 'Nenhuma informada'}
      
      [PARÂMETROS DE MONITORAMENTO]
      1. Medir sinais vitais regularmente (temperatura, pressão arterial, etc.).
      2. Monitorar possíveis reações alérgicas e registrar quaisquer mudanças.
      3. Registrar alterações no quadro clínico do paciente.
      4. Atualizar prontuário com frequência para manter os dados corretos.
      
      [ELEMENTOS VISUAIS]
      - Gráficos de linha e tabela de monitoramento de sinais vitais.
      - Cores indicativas de segurança (verde, amarelo, vermelho) para facilitar a leitura.
      - Setas e legendas explicativas em português, com foco em dados vitais.
      
      [PADRÕES TÉCNICOS]
      - Resolução mínima: 2048x2048 pixels.
      - Texto totalmente em português.
      - Imagem clara e fácil de entender, sem elementos visuais que causem confusão.
      `.trim().replace(/\s+/g, ' ');
    }      
}