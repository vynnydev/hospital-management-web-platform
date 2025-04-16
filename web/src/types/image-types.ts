export interface IMedicationImageResult {
    usage: string;
    application: string;
    precaution: string;
    palliativeCare?: string;
    monitoring?: string;
  }
  
export interface IPalliativeCareContext {
    patientCondition: string;
    mobilityStatus: string;
    painLevel: number;
    nutritionalStatus: string;
    respiratoryStatus: string;
    consciousnessLevel: string;
    specialNeeds: string[];
}
  
export interface IPatientContext {
    age: number;
    weight?: number;
    allergies?: string[];
    mobility: string;
    consciousness: string;
    specialNeeds: string[];
}
  
export interface IMedicationImageRequest {
    name: string;
    dosage: string;
    instructions: string;
    patientContext?: IPatientContext;
    palliativeCare?: IPalliativeCareContext;
}

export interface IImageValidationCriteria {
    minWidth: number;
    minHeight: number;
    requiredElements: string[];
    colorProfile: string[];
    textRequirements: string[];
    aspectRatio?: {
        min: number;
        max: number;
    };
    qualityThresholds: {
        minSharpness: number;
        minContrast: number;
        maxNoise: number;
    };
}

export interface IImageValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    metadata: {
        dimensions: {
            width: number;
            height: number;
        };
        aspectRatio: number;
        qualityMetrics: {
            sharpness: number;
            contrast: number;
            noise: number;
        };
    };
}

export interface IImageValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    metadata: {
        dimensions: {
            width: number;
            height: number;
        };
        aspectRatio: number;
        qualityMetrics: IImageQualityMetrics;
    };
}

export interface IImageQualityMetrics {
    sharpness: number;
    contrast: number;
    noise: number;
}

export interface IImageGenerationConfig {
    maxRetries: number;
    timeout: number;
    initialDelay: number;
    maxDelay: number;
    qualityThreshold: number;
    rateLimitDelay: number;
    batchDelay: number;
    concurrency: number;
    maxRequestsPerMinute: number;
    modelParams: {
        negative_prompt: string;
        num_inference_steps: number;
        guidance_scale: number;
        width: number;
        height: number;
    };
}