/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Patient {
    id: string;
    personalInfo: {
        image: string;
        name: string;
        age: number;
        photo: string;
    };
    admission: {
        date: string
        status: any;
        statusHistory: Array<{
            department: string;
            status: string;
            timestamp: string;
        }>;
        bed: {
            type: string;
            number: string
        }
    };
    generatedImage?: string;
}

export type Department = 'uti' | 'enfermaria' | 'pediatria' | 'cardiologia' | 'oncologia' | 'neurologia';

export interface Metrics {
    capacity: {
        total: {
            maxBeds: number;
            maxOccupancy: number;
        };
        departmental: Record<Department, {
            patients: number;
            maxBeds: number;
            maxOccupancy: number;
            recommendedMaxOccupancy: number;
            validStatuses?: string[];
        }>;
    };
    departmental: Record<Department, {
        patients: number;
        maxBeds: number;
        maxOccupancy: number;
        recommendedMaxOccupancy: number;
        validStatuses?: string[];
    }>;
}
