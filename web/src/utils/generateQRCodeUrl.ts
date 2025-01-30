// Definição de interfaces mais genéricas e flexíveis
export interface PatientStatus {
    current?: string;
    department?: string;
    specialties?: string;
}

export interface Medication {
    name: string;
    description?: string;
}

export interface Procedure {
    procedureType?: string;
    description?: string;
}

export interface Patient {
    id: string;
    name: string;
    admissionDate: Date | string;
    diagnosis?: string;
    status?: PatientStatus;
    medications?: Medication[];
    lastProcedure?: Procedure | null;
}

export interface QRCodeOptions {
    // Configurações para personalizar a geração do QR Code
    baseUrl?: string;
    maxDiagnosisLength?: number;
    maxMedicationDescLength?: number;
    maxProcedureDescLength?: number;
    maxMedicationsToInclude?: number;
}

export function generateQRCodeUrl(
    patient: Patient, 
    options: QRCodeOptions = {}
): string {
    // Definir valores padrão para as opções
    const {
        baseUrl = window.location.origin,
        maxDiagnosisLength = 100,
        maxMedicationDescLength = 50,
        maxProcedureDescLength = 50,
        maxMedicationsToInclude = 3
    } = options;

    // Função de truncamento segura
    const truncate = (text?: string, maxLength = 50) => 
        text ? text.substring(0, maxLength) : '';

    // Construir dados do QR Code
    const data = {
        patient: {
            id: patient.id,
            name: patient.name,
            admissionDate: new Date(patient.admissionDate).toLocaleDateString(),
            diagnosis: truncate(patient.diagnosis, maxDiagnosisLength),
            status: {
                current: patient.status?.current ?? '',
                department: patient.status?.department ?? '',
                specialties: patient.status?.specialties ?? ''
            },
            medications: (patient.medications ?? [])
                .map(med => ({
                    name: med.name,
                    description: truncate(med.description, maxMedicationDescLength)
                }))
                .slice(0, maxMedicationsToInclude),
            lastProcedure: patient.lastProcedure ? {
                type: patient.lastProcedure.procedureType ?? '',
                description: truncate(patient.lastProcedure.description, maxProcedureDescLength)
            } : null
        }
    };

    // Codificar dados em base64
    const encodedData = btoa(JSON.stringify(data));
    
    // Retornar URL completa
    return `${baseUrl}/qr-view?data=${encodedData}`;
}