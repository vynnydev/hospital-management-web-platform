/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HfInference } from "@huggingface/inference";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IPatient } from '@/types/hospital-network-types';
import { generateEnhancedPrompt } from "@/app/(administrator)/patient-management/components/functions/AI/aiAssistantPatientBoard";


const hfInference = new HfInference(process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY!);
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const IMAGE_MODELS = {
  FLUX_SCHNELL: "black-forest-labs/FLUX.1-schnell"
} as const;

const IMAGE_PARAMETERS = {
  negative_prompt: "texto, palavras, letras, números, baixa qualidade, borrado, pessoas, rostos humanos",
  num_inference_steps: 50,
  guidance_scale: 8.5,
  width: 512,  // Adicionando largura padrão
  height: 512  // Adicionando altura padrão
} satisfies {
  negative_prompt?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
  width?: number;
  height?: number;
};

export interface IAIGenerationCallbacks {
  onStart?: () => void;
  onProgress?: (progress: number, message: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export const generateAIContent = async (
    patient: IPatient,
    callbacks: IAIGenerationCallbacks = {}
  ) => {
    try {
      callbacks.onStart?.();
      callbacks.onProgress?.(20, 'Iniciando geração...');
  
      const enhancedPrompt = generateEnhancedPrompt(patient);
  
      // Gera texto usando Gemini
      callbacks.onProgress?.(40, 'Gerando recomendações de texto...');
      const recommendationResult = await genAI
        .getGenerativeModel({ model: "gemini-pro" })
        .generateContent({
          contents: [{ role: 'user', parts: [{ text: enhancedPrompt }]}],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });
  
      // Gera imagem usando Hugging Face
      callbacks.onProgress?.(60, 'Gerando imagens...');
      const imageResult = await generateImage(enhancedPrompt);
  
      // Gera plano de cuidados - Corrigido para garantir retorno de string
      callbacks.onProgress?.(80, 'Gerando plano de cuidados...');
      const carePlanPrompt = generatePatientCarePlanPrompt(patient);
      // Verifica se o prompt é uma string válida antes de gerar a imagem
      const carePlanImage = carePlanPrompt && typeof carePlanPrompt === 'string' 
        ? await generateImage(carePlanPrompt)
        : null;
  
      callbacks.onProgress?.(100, 'Concluído!');
      callbacks.onComplete?.();
  
      return {
        recommendation: recommendationResult.response.text(),
        treatmentImage: imageResult,
        carePlanImage: carePlanImage,
      };
  
    } catch (error: any) {
      console.error('Erro na geração de conteúdo:', error);
      callbacks.onError?.(error);
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
    if (error.message === 'Failed to fetch') {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }
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

const generatePatientCarePlanPrompt = (patient: IPatient): string => {
    // Implementar a lógica do prompt aqui
    return `Plano de cuidados para ${patient.name}:\n...`;
};
