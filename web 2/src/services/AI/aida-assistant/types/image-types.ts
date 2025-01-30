export interface MedicationImageResult {
    usage: string;
    application: string;
    precaution: string;
    palliativeCare?: string;
    monitoring?: string;
  }
  
export interface PalliativeCareContext {
    patientCondition: string;
    mobilityStatus: string;
    painLevel: number;
    nutritionalStatus: string;
    respiratoryStatus: string;
    consciousnessLevel: string;
    specialNeeds: string[];
}
  
export interface PatientContext {
    age: number;
    weight?: number;
    allergies?: string[];
    mobility: string;
    consciousness: string;
    specialNeeds: string[];
}
  
export interface MedicationImageRequest {
    name: string;
    dosage: string;
    instructions: string;
    patientContext?: PatientContext;
    palliativeCare?: PalliativeCareContext;
}

export interface ImageValidationCriteria {
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

export interface ImageValidationResult {
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

export interface ImageValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    metadata: {
        dimensions: {
            width: number;
            height: number;
        };
        aspectRatio: number;
        qualityMetrics: ImageQualityMetrics;
    };
}

export interface ImageQualityMetrics {
    sharpness: number;
    contrast: number;
    noise: number;
}

export interface ImageGenerationConfig {
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