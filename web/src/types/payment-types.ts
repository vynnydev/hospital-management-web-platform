// Tipos de dados para o sistema de gerenciamento de pagamentos

// Tipo para cartão de pagamento
export interface IPaymentCard {
    id: string;
    cardNumber: string; // Parcialmente mascarado para segurança
    cardHolderName: string;
    expiryDate: string; // Formato MM/YY
    cardType: CardType;
    cardBrand: CardBrand;
    lastFourDigits: string;
    billingAddress?: IBillingAddress;
    isDefault: boolean;
    status: CardStatus;
    securitySettings: ICardSecuritySettings;
    issuedAt: string; // ISO date
    updatedAt: string; // ISO date
    departmentId?: string; // Se for um cartão departamental
    departmentName?: string;
    usageRestrictions: IUsageRestrictions;
    creditLimit?: number;
    availableBalance?: number;
    cardImage?: string; // URL da imagem do cartão
    colorScheme?: string; // Para estilização visual do cartão
  }
  
  // Tipos de cartão
  export enum CardType {
    CREDIT = "credit",
    DEBIT = "debit",
    CORPORATE = "corporate",
    VIRTUAL = "virtual",
    PREPAID = "prepaid"
  }
  
  // Bandeiras de cartão
  export enum CardBrand {
    VISA = "visa",
    MASTERCARD = "mastercard",
    AMEX = "amex",
    DISCOVER = "discover",
    ELO = "elo",
    HIPERCARD = "hipercard",
    OTHER = "other"
  }
  
  // Status do cartão
  export enum CardStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BLOCKED = "blocked",
    EXPIRED = "expired",
    PENDING_ACTIVATION = "pending_activation"
  }
  
  // Endereço de cobrança
  export interface IBillingAddress {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
  
  // Configurações de segurança do cartão
  export interface ICardSecuritySettings {
    requiresPin: boolean;
    requires2FA: boolean; 
    allowOnlineTransactions: boolean;
    allowInternationalTransactions: boolean;
    transactionApprovalThreshold: number; // Valor acima do qual requer aprovação
    allowedApprovers: string[]; // IDs dos usuários com permissão para aprovar
    maxDailyTransactionAmount: number;
    maxMonthlyTransactionAmount: number;
  }
  
  // Restrições de uso do cartão
  export interface IUsageRestrictions {
    allowedCategories: ExpenseCategory[];
    restrictedMerchants: string[];
    allowedDaysOfWeek: number[]; // 0-6 (domingo-sábado)
    allowedTimeStart?: string; // HH:mm
    allowedTimeEnd?: string; // HH:mm
    geographicRestrictions?: IGeographicRestriction[];
  }
  
  // Restrição geográfica
  export interface IGeographicRestriction {
    type: 'country' | 'region' | 'city';
    value: string;
    allowed: boolean;
  }
  
  // Categorias de despesa
  export enum ExpenseCategory {
    MEDICAL_SUPPLIES = "medical_supplies",
    PHARMACEUTICALS = "pharmaceuticals",
    EQUIPMENT = "equipment",
    OFFICE_SUPPLIES = "office_supplies",
    UTILITIES = "utilities",
    TRAVEL = "travel",
    MEALS = "meals",
    CONSULTING = "consulting",
    SOFTWARE = "software",
    TRAINING = "training",
    OTHER = "other"
  }
  
  // Transação
  export interface ITransaction {
    id: string;
    cardId: string;
    amount: number;
    currency: string;
    merchant: string;
    merchantCategory: string;
    timestamp: string; // ISO date
    status: TransactionStatus;
    description?: string;
    referenceNumber: string;
    paymentMethod: PaymentMethod;
    category: ExpenseCategory;
    receiptUrl?: string;
    authorizedBy?: string; // ID do usuário que autorizou
    notes?: string;
    tags?: string[];
    departmentId?: string;
    projectId?: string;
    location?: string;
    ipAddress?: string;
  }
  
  // Status da transação
  export enum TransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    DECLINED = "declined",
    REFUNDED = "refunded",
    UNDER_REVIEW = "under_review",
    REQUIRES_APPROVAL = "requires_approval",
    DISPUTED = "disputed",
    CANCELED = "canceled"
  }
  
  // Método de pagamento
  export enum PaymentMethod {
    CARD_PRESENT = "card_present",
    CARD_NOT_PRESENT = "card_not_present",
    ONLINE = "online",
    MOBILE = "mobile",
    CONTACTLESS = "contactless",
    RECURRING = "recurring"
  }
  
  // Solicitação de aprovação
  export interface IApprovalRequest {
    id: string;
    transactionId: string;
    requestedAt: string; // ISO date
    requestedBy: string; // ID do usuário
    status: ApprovalStatus;
    approvedBy?: string; // ID do usuário
    approvedAt?: string; // ISO date
    rejectedBy?: string; // ID do usuário
    rejectedAt?: string; // ISO date
    reason?: string;
    urgency: ApprovalUrgency;
    expiresAt: string; // ISO date
  }
  
  // Status de aprovação
  export enum ApprovalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired",
    CANCELED = "canceled"
  }
  
  // Urgência de aprovação
  export enum ApprovalUrgency {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
  }
  
  // Log de auditoria
  export interface IAuditLog {
    id: string;
    timestamp: string; // ISO date
    userId: string;
    userName: string;
    userRole: string;
    action: AuditAction;
    resource: string;
    resourceId: string;
    resourceType: ResourceType;
    details: string;
    ipAddress: string;
    userAgent: string;
    sessionId: string;
    result: 'success' | 'failure';
    severity: Severity;
    category: AuditCategory;
    before?: string; // JSON stringificado do estado anterior
    after?: string; // JSON stringificado do novo estado
  }
  
  // Ação de auditoria
  export enum AuditAction {
    VIEW = "view",
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    APPROVE = "approve",
    REJECT = "reject",
    LOGIN = "login",
    LOGOUT = "logout",
    FAILED_LOGIN = "failed_login",
    EXPORT = "export"
  }
  
  // Tipo de recurso
  export enum ResourceType {
    CARD = "card",
    TRANSACTION = "transaction",
    APPROVAL = "approval",
    SECURITY_SETTING = "security_setting",
    USER = "user",
    DEPARTMENT = "department"
  }
  
  // Severidade
  export enum Severity {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
  }
  
  // Categoria de auditoria
  export enum AuditCategory {
    SECURITY = "security",
    PAYMENT = "payment",
    CONFIGURATION = "configuration",
    USER_ACTIVITY = "user_activity",
    SYSTEM = "system"
  }
  
  // Estatísticas de pagamento
  export interface IPaymentStats {
    totalTransactions: number;
    totalAmount: number;
    averageTransactionAmount: number;
    transactionsByCategory: {[key in ExpenseCategory]?: number};
    transactionsByCard: {[cardId: string]: number};
    pendingApprovals: number;
    declinedTransactions: number;
    monthlySpending: IMonthlySpending[];
  }
  
  // Gasto mensal
  export interface IMonthlySpending {
    month: number; // 1-12
    year: number;
    amount: number;
    transactionCount: number;
  }
  
  // Resposta paginada
  export interface IPaginatedResponse<T> {
    data: T[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  }
  
  // Filtros de transação
  export interface ITransactionFilters {
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    status?: TransactionStatus[];
    cardIds?: string[];
    categories?: ExpenseCategory[];
    merchantSearch?: string;
    departmentIds?: string[];
  }
  
  // Acesso de usuário
  export interface IPaymentAccess {
    userId: string;
    userName: string;
    role: PaymentRole;
    permissions: PaymentPermission[];
    cardVisibility: 'all' | 'department' | 'assigned';
    transactionVisibility: 'all' | 'department' | 'own';
    allowedCardIds?: string[];
    allowedDepartmentIds?: string[];
    approvalThreshold?: number; // Valor máximo que pode aprovar
  }
  
  // Papel do usuário
  export enum PaymentRole {
    ADMIN = "admin",
    MANAGER = "manager",
    APPROVER = "approver",
    CARDHOLDER = "cardholder",
    ACCOUNTANT = "accountant",
    VIEWER = "viewer"
  }
  
  // Permissão de pagamento
  export enum PaymentPermission {
    VIEW_CARDS = "view_cards",
    MANAGE_CARDS = "manage_cards",
    VIEW_TRANSACTIONS = "view_transactions",
    APPROVE_TRANSACTIONS = "approve_transactions",
    EXPORT_DATA = "export_data",
    MANAGE_SETTINGS = "manage_settings",
    MANAGE_USERS = "manage_users",
    VIEW_REPORTS = "view_reports"
  }