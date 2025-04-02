export type TCurrencyCode = 'BRL' | 'USD' | 'EUR' | 'GBP';
export type TBillingCycle = 'daily' | 'weekly' | 'monthly' | 'procedure';
export type TPaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'insurance' | 'bank_transfer' | 'pix';
export type TFinancialReportType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
export type TBudgetAllocationStatus = 'proposed' | 'approved' | 'active' | 'closed';
export type TRevenueSource = 'consultations' | 'procedures' | 'hospitalization' | 'emergency' | 'pharmacy' | 'laboratory' | 'imaging' | 'other';
export type TCostCategory = 'staff' | 'medications' | 'supplies' | 'equipment' | 'infrastructure' | 'utilities' | 'administrative' | 'maintenance' | 'other';

// Interface para formatação de moeda e configurações regionais
export interface ICurrencySettings {
  code: TCurrencyCode;
  symbol: string;
  decimalSeparator: string;
  thousandsSeparator: string;
  decimalPlaces: number;
  symbolPosition: 'before' | 'after';
}

// Interface para configurações de impostos
export interface ITaxSettings {
  vatEnabled: boolean;
  vatRate: number;
  additionalTaxes: Array<{
    name: string;
    rate: number;
    appliesTo: Array<TRevenueSource>;
  }>;
  taxExemptions: Array<{
    name: string;
    code: string;
    description: string;
  }>;
}

// Interface para configurações de faturamento de pacientes
export interface IPatientBillingSettings {
  defaultBillingCycle: TBillingCycle;
  acceptedPaymentMethods: Array<TPaymentMethod>;
  defaultPaymentTerms: number; // dias para pagamento
  automaticBillingEnabled: boolean;
  sendPaymentReminders: boolean;
  discountSettings: {
    earlyPaymentDiscountEnabled: boolean;
    earlyPaymentDiscountRate: number;
    earlyPaymentDaysThreshold: number;
    volumeDiscountEnabled: boolean;
    volumeDiscountThresholds: Array<{
      amount: number;
      discountRate: number;
    }>;
  };
  defaultInsuranceBillingEnabled: boolean;
}

// Interface para configurações de orçamento e alocação
export interface IBudgetSettings {
  fiscalYearStart: {
    month: number; // 1-12
    day: number; // 1-31
  };
  defaultDepartmentalAllocations: Array<{
    departmentId: string;
    percentage: number;
  }>;
  budgetApprovalWorkflow: Array<{
    role: string;
    order: number;
  }>;
  budgetReviewFrequency: 'monthly' | 'quarterly' | 'biannual';
  thresholdForAlerts: {
    underBudget: number; // percentual
    overBudget: number; // percentual
  };
}

// Interface para configurações de custo por serviço/procedimento
export interface IServiceCostSettings {
  calculateAutomatically: boolean;
  defaultMarkupPercentage: number;
  costUpdateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  includedOverheadPercentage: number;
  customPricingEnabled: boolean;
}

// Interface para configurações de relatórios financeiros
export interface IFinancialReportSettings {
  defaultReportTypes: Array<TFinancialReportType>;
  automaticReportGeneration: boolean;
  recipientEmails: string[];
  exportFormats: Array<'pdf' | 'excel' | 'csv'>;
  includedMetrics: Array<string>; // IDs de métricas configuradas
  retentionPeriod: number; // meses
}

// Interface para regras de seguro
export interface IInsuranceRules {
  providers: Array<{
    id: string;
    name: string;
    contractCode: string;
    billingCode: string;
    contactInfo: {
      email: string;
      phone: string;
    };
    servicesMap: Array<{
      serviceCode: string;
      coveragePercentage: number;
      requiresPreAuthorization: boolean;
      maxAllowedAmount: number;
    }>;
    submissionMethod: 'electronic' | 'manual';
    paymentTerms: number; // dias para recebimento
  }>;
  defaultProvider: string; // ID do provedor padrão
}

// Interface para configurações de auditoria financeira
export interface IFinancialAuditSettings {
  internalAuditFrequency: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  externalAuditRequired: boolean;
  externalAuditFrequency: 'annual';
  auditTrailRetention: number; // meses
  responsibleRoles: string[];
}

// Interface para configurações de integração com sistemas financeiros externos
export interface IFinancialIntegrationSettings {
  enabled: boolean;
  systems: Array<{
    id: string;
    name: string;
    type: 'erp' | 'accounting' | 'payment_processor' | 'tax_system' | 'banking';
    apiEndpoint: string;
    apiKey: string;
    refreshToken: string;
    syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    lastSync: string;
    mappedFields: Record<string, string>;
  }>;
}

// Interface principal para configurações financeiras
export interface IFinanceSettings {
  currency: ICurrencySettings;
  tax: ITaxSettings;
  patientBilling: IPatientBillingSettings;
  budget: IBudgetSettings;
  serviceCost: IServiceCostSettings;
  financialReports: IFinancialReportSettings;
  insurance: IInsuranceRules;
  auditSettings: IFinancialAuditSettings;
  integrations: IFinancialIntegrationSettings;
  lastUpdated: string;
  updatedBy: string;
}

// Interface para dados financeiros dos hospitais na rede
export interface IFinanceData {
  settings: {
    [hospitalId: string]: IFinanceSettings;
  };
  networkDefaults: IFinanceSettings;
  loading: boolean;
}