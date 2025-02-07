/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from "@huggingface/inference";
import { IStaffTeam } from "@/types/staff-types";

const hfInference = new HfInference(process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY!);
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const IMAGE_MODELS = {
  FLUX_SCHNELL: "black-forest-labs/FLUX.1-schnell"
} as const;

const IMAGE_PARAMETERS = {
  negative_prompt: "texto, pessoas, números, baixa qualidade",
  num_inference_steps: 50,
  guidance_scale: 8.5,
  width: 512,
  height: 512
};

export const generateEnhancedStaffPrompt = (team: IStaffTeam) => `
Análise detalhada e recomendações para equipe hospitalar:

IDENTIFICAÇÃO DA EQUIPE:
- Nome: ${team.name}
- Departamento: ${team.department}
- Turno: ${team.shift}
- Status: ${team.status}
- Capacidade: ${team.capacityStatus}

MÉTRICAS DA EQUIPE:
- Conclusão de Tarefas: ${team.metrics.taskCompletion.toFixed(2)}%
- Tempo Médio de Resposta: ${team.metrics.avgResponseTime} min
- Satisfação do Paciente: ${team.metrics.patientSatisfaction.toFixed(1)}

COMPOSIÇÃO DA EQUIPE:
- Total de Membros: ${team.members.length}
- Especialidades: ${team.specialties.join(', ')}

ANÁLISE DETALHADA:
1. Avalie o desempenho da equipe
2. Identifique possíveis pontos de melhoria
3. Sugira estratégias de otimização
4. Recomende ações para prevenir burnout
5. Proponha treinamentos específicos

ELEMENTO VISUAL SOLICITADO:
- Diagrama de fluxo de trabalho da equipe
- Representação gráfica das métricas
- Ilustração de estratégias de melhoria
- Sem representação de pessoas
- Resolução: 2048x2048 pixels
- Cores profissionais e neutras
`;

export const generateAIRecommendations = async (team: IStaffTeam) => {
  try {
    const prompt = generateEnhancedStaffPrompt(team);

    // Geração de texto com Gemini
    const recommendationResult = await genAI
      .getGenerativeModel({ model: "gemini-pro" })
      .generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }]}],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

    // Geração de imagem com Hugging Face
    const imageResult = await generateImage(prompt);

    return {
      recommendation: recommendationResult.response.text(),
      image: imageResult
    };
  } catch (error) {
    console.error('Erro na geração de recomendações:', error);
    throw error;
  }
};

const generateImage = async (prompt: string) => {
  if (!prompt) return null;
  
  try {
    if (!process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY) {
      throw new Error('Token de acesso HuggingFace não configurado');
    }

    const result = await hfInference.textToImage({
      inputs: prompt,
      parameters: IMAGE_PARAMETERS,
      model: IMAGE_MODELS.FLUX_SCHNELL,
    });

    return processImageResponse(result);
  } catch (error: any) {
    console.error('Erro ao gerar imagem:', error);
    throw error;
  }
};

const processImageResponse = async (response: Blob): Promise<string> => {
  if (response.size === 0) {
    throw new Error('Resposta vazia recebida');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Erro ao processar imagem'));
    reader.readAsDataURL(response);
  });
};