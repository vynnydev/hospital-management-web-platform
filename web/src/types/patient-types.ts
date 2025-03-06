/* eslint-disable @typescript-eslint/no-explicit-any */
export type TPatientStatus = 
  'Aguardando Atendimento' | 
  'Em Triagem' | 
  'Em Atendimento' | 
  'Em Observação' | 
  'Em Procedimento' | 
  'Em Recuperação' | 
  'Alta' | 
  'Transferido';

export type TPatientPriority = 'Baixa' | 'Média' | 'Alta' | 'Emergência';

export type TAdmissionType = 'Emergência' | 'Eletiva' | 'Transferência' | 'Ambulatorial';

export type TInsuranceType = 'Particular' | 'Convênio' | 'SUS';

export interface IInsurance {
  id: string;
  name: string;
  planType: string;
  cardNumber: string;
  expirationDate: string;
}

export interface ISUSInfo {
  cartaoSUS: string;
  dataEmissao: string;
  municipioEmissao: string;
  ufEmissao: string;
}

export interface IPatientRegistration {
  id?: string;
  personalInfo: {
    name: string;
    socialName?: string;
    birthDate: string;
    gender: 'M' | 'F' | 'Outro';
    cpf: string;
    rg?: string;
    maritalStatus?: string;
    nationality: string;
    bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    photo?: string;
  };
  contactInfo: {
    phone: string;
    cellphone: string;
    email?: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  medicalInfo: {
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    previousSurgeries: string[];
    observations?: string;
  };
  insuranceInfo: {
    type: TInsuranceType;
    insuranceDetails?: IInsurance;
    susInfo?: ISUSInfo;
  };
  registrationDate: string;
  lastUpdate: string;
}

export interface IPatientAdmission {
  id: string;
  patientId: string;
  admissionDate: string;
  admissionType: TAdmissionType;
  entranceReason: string;
  priority: TPatientPriority;
  initialSymptoms: string[];
  initialDiagnosis?: string;
  responsibleStaff: {
    id: string;
    name: string;
    role: string;
  };
  status: TPatientStatus;
  statusHistory: Array<{
    status: TPatientStatus;
    timestamp: string;
    updatedBy: {
      id: string;
      name: string;
      role: string;
    };
  }>;
  departmentId?: string;
  bedId?: string;
  expectedDischarge?: string;
}

export interface IPatientAssignment {
  id: string;
  admissionId: string;
  patientId: string;
  departmentId: string;
  roomId?: string;
  bedId?: string;
  assignedDoctor: {
    id: string;
    name: string;
  };
  assignedNurse?: {
    id: string;
    name: string;
  };
  assignmentDate: string;
  status: 'Pending' | 'Assigned' | 'Completed' | 'Cancelled';
  priority: TPatientPriority;
  notes?: string;
}

// Interface para uso no hook de gerenciamento de pacientes
export interface IUsePatientManagement {
  patients: IPatientRegistration[];
  admissions: IPatientAdmission[];
  isLoading: boolean;
  error: string | null;
  addPatient: (patient: Omit<IPatientRegistration, 'id' | 'registrationDate' | 'lastUpdate'>) => Promise<IPatientRegistration>;
  updatePatient: (id: string, patient: Partial<IPatientRegistration>) => Promise<IPatientRegistration>;
  getPatientById: (id: string) => IPatientRegistration | undefined;
  getPatientAdmissions: (patientId: string) => IPatientAdmission[];
  createAdmission: (admission: Omit<IPatientAdmission, 'id' | 'statusHistory'>) => Promise<IPatientAdmission>;
  updateAdmission: (id: string, admission: Partial<IPatientAdmission>) => Promise<IPatientAdmission>;
  updateAdmissionStatus: (id: string, status: TPatientStatus, updatedBy: { id: string; name: string; role: string }) => Promise<IPatientAdmission>;
  searchPatients: (query: string) => IPatientRegistration[];
  filterPatients: (filters: Record<string, any>) => IPatientRegistration[];
}

// Interface para uso no hook de gerenciamento de atribuições
export interface IUsePatientAssignment {
  assignments: IPatientAssignment[];
  isLoading: boolean;
  error: string | null;
  createAssignment: (assignment: Omit<IPatientAssignment, 'id' | 'assignmentDate'>) => Promise<IPatientAssignment>;
  updateAssignment: (id: string, assignment: Partial<IPatientAssignment>) => Promise<IPatientAssignment>;
  getAssignmentsByPatient: (patientId: string) => IPatientAssignment[];
  getAssignmentsByDepartment: (departmentId: string) => IPatientAssignment[];
  getAssignmentsByDoctor: (doctorId: string) => IPatientAssignment[];
  getAssignmentsByNurse: (nurseId: string) => IPatientAssignment[];
  cancelAssignment: (id: string, reason: string) => Promise<IPatientAssignment>;
}

export interface IUseInsuranceData {
  insurances: IInsurance[];
  isLoading: boolean;
  error: string | null;
  getInsuranceById: (id: string) => IInsurance | undefined;
  getInsurancesByName: (name: string) => IInsurance[];
  validateInsurance: (insuranceId: string, patientCPF: string) => Promise<boolean>;
}

export interface IUseSUSIntegration {
  validateSUSCard: (cardNumber: string) => Promise<boolean>;
  getSUSPatientInfo: (cardNumber: string) => Promise<{
    name: string;
    birthDate: string;
    cpf: string;
    cardNumber: string;
    issueDate: string;
    municipality: string;
    state: string;
  } | null>;
}