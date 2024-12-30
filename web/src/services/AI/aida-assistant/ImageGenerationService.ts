import { HfInference } from '@huggingface/inference';

interface MedicationImageResult {
  usage: string;
  application: string;
  precaution: string;
}

interface ImageServiceConfig {
  maxRetries: number;
  timeout: number;
  initialDelay: number;
  maxDelay: number;
}

export class ImageGenerationService {
  private hf: HfInference;
  private config: ImageServiceConfig;
  private model: string = "stabilityai/stable-diffusion-3.5-large";

  constructor() {
    const hfToken = process.env.HUGGING_FACE_API_KEY;
    
    if (!hfToken) {
      throw new Error('Token Hugging Face não configurado');
    }
    
    this.hf = new HfInference(hfToken);

    this.config = {
      maxRetries: 3,
      timeout: 60000, // 60 segundos
      initialDelay: 2000,
      maxDelay: 10000
    };
  }

  async generateMedicationImages(medication: any): Promise<MedicationImageResult> {
    return await this.monitorRequest(
      async () => {
        try {
          console.log('Iniciando geração de imagens para:', medication.name);
          
          // Gerando imagens sequencialmente para evitar rate limits
          const usageImage = await this.generateImageWithRetry(this.createUsagePrompt(medication));
          console.log('Imagem de uso gerada');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const applicationImage = await this.generateImageWithRetry(this.createApplicationPrompt(medication));
          console.log('Imagem de aplicação gerada');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const precautionImage = await this.generateImageWithRetry(this.createPrecautionPrompt(medication));
          console.log('Imagem de precaução gerada');

          if (!usageImage || !applicationImage || !precautionImage) {
            throw new Error('Falha na geração de uma ou mais imagens');
          }

          return {
            usage: usageImage,
            application: applicationImage,
            precaution: precautionImage
          };
        } catch (error: any) {
          await this.logError(error, 'generateMedicationImages');
          throw new Error(`Erro na geração de imagens: ${error.message}`);
        }
      },
      'generateMedicationImages'
    );
  }

    // Verifica se a string base64 é válida
   public isValidBase64Image = (url: string) => {
    if (!url) return false;
    
    // Verifica se é uma URL de dados válida
    if (!url.startsWith('data:')) return false;
    
    // Verifica se tem o formato correto
    const matches = url.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return false;
    
    // Verifica se o tipo MIME é válido
    const validMimeTypes = [
        'application/octet-stream',
        'image/png',
        'image/jpeg',
        'image/jpg'
    ];
    
    return validMimeTypes.includes(matches[1]);
  };

  private async generateImageWithRetry(prompt: string): Promise<string> {
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.config.maxRetries) {
      try {
        // Adiciona delay progressivo entre tentativas
        if (attempt > 0) {
          const delay = Math.min(
            this.config.initialDelay * Math.pow(2, attempt),
            this.config.maxDelay
          );
          console.log(`Aguardando ${delay}ms antes da tentativa ${attempt + 1}`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        console.log(`Iniciando tentativa ${attempt + 1} para prompt:`, prompt);

        const response = await this.hf.textToImage({
            model: this.model,
            inputs: prompt,
            parameters: {
              negative_prompt: "text, watermark, low quality, blurry, distorted, deformed, unrealistic, cartoon, anime, drawing, sketch, painting",
              num_inference_steps: 50,
              guidance_scale: 8.5,
              width: 1024,
              height: 768,
            }
          });
        
          // Adicione verificações
          if (!response) {
            throw new Error('Resposta vazia do serviço de imagem');
          }
        
          // Converte blob para base64 com verificação
          const blob = new Blob([response]);
          if (blob.size === 0) {
            throw new Error('Blob vazio recebido');
          }
        
          const base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              if (!result || !this.isValidBase64Image(result)) {
                reject(new Error('Imagem base64 inválida gerada'));
              } else {
                resolve(result);
              }
            };
            reader.onerror = () => reject(new Error('Erro ao ler blob'));
            reader.readAsDataURL(blob);
          });
        
          return base64Image;

      } catch (error: any) {
        lastError = error;
        attempt++;

        // Tratamento específico para diferentes tipos de erro
        if (error.status === 429) {
          console.log('Rate limit atingido, aguardando 30 segundos');
          await new Promise(resolve => setTimeout(resolve, 30000));
        }

        await this.logError(error, `Tentativa ${attempt}`);

        if (attempt >= this.config.maxRetries) {
          throw new Error(`Todas as tentativas falharam: ${error.message}`);
        }
      }
    }

    throw lastError || new Error('Falha na geração da imagem');
  }

  private async monitorRequest<T>(
    requestFn: () => Promise<T>,
    context: string
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await requestFn();
      const duration = Date.now() - startTime;
      console.log(`Request completado em ${duration}ms`, { context });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.logError(error, `${context} (${duration}ms)`);
      throw error;
    }
  }

  private async logError(error: any, context: string) {
    console.error(`Erro na Geração de Imagem [${context}]:`, {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      context,
      status: error.status,
      details: error.details
    });
  }

  private createUsagePrompt(medication: any): string {
    return `Ilustração médica profissional em português mostrando o uso correto de ${medication.name} ${medication.dosage}. 
            Estilo de diagrama médico limpo, fundo branco, focando na técnica correta de manuseio e administração.
            Incluir textos explicativos em português, setas indicativas e numeração dos passos.
            Mostrar claramente a forma de administração do medicamento.
            Ultra realista, alta qualidade, detalhado, foco nítido.
            Estilo de manual médico profissional brasileiro.`
            .trim()
            .replace(/\s+/g, ' ');
  }

  private createApplicationPrompt(medication: any): string {
    return `Demonstração médica passo a passo em português da aplicação de ${medication.name} ${medication.dosage}. 
            Ambiente clínico profissional, ambiente limpo e organizado, técnica médica correta.
            Incluir legendas em português, setas indicativas e numeração clara dos passos.
            Mostrar profissional de saúde realizando a aplicação de forma segura.
            Ultra realista, alta qualidade, detalhado, foco nítido.
            Estilo de manual médico profissional brasileiro.`
            .trim()
            .replace(/\s+/g, ' ');
  }

  private createPrecautionPrompt(medication: any): string {
    return `Ilustração de segurança médica em português mostrando precauções para ${medication.name} ${medication.dosage}. 
            Layout horizontal em estilo infográfico profissional, com ícones e texto bem distribuídos.
            Símbolos de advertência claros, contexto médico profissional.
            Incluir 3-4 precauções principais em português com ícones correspondentes.
            Usar design limpo e profissional com boa utilização do espaço.
            Ultra realista, alta qualidade, detalhado, foco nítido.
            Estilo de bula médica profissional brasileira.
            Layout otimizado para impressão.`
            .trim()
            .replace(/\s+/g, ' ');
  }
}