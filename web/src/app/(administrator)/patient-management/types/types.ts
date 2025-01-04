/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Patient {
    id: string;
    personalInfo: {
        name: string;
        age: number;
        photo: string;
    };
    admission: {
        bed: {
            type: string;
        }
    };
}

export interface Metrics {
    capacity: {
        total: {
            maxBeds: number;
            maxOccupancy: number;
        };
        departmental: {
            [key: string]: {
                patients: number;
                maxBeds: number;
                maxOccupancy: number;
                recommendedMaxOccupancy: number;
            };
        };
    };
    departmental: {
        [key: string]: {
            patients: number;
            maxBeds: number;
            maxOccupancy: number;
            recommendedMaxOccupancy: number;
        };
    };
}
