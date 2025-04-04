/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Utilitários de validação para dados de pagamento
 * Esta biblioteca contém funções para validar dados de cartões, transações e aprovações
 */

import { 
    IPaymentCard, 
    CardStatus,
    ITransaction,
    ExpenseCategory,
    IApprovalRequest,
    CardType,
    CardBrand
  } from '@/types/payment-types';
  
  /**
   * Valida o número de um cartão de crédito/débito usando o algoritmo de Luhn
   * @param cardNumber Número do cartão (com ou sem espaços)
   * @returns Verdadeiro se o número do cartão for válido
   */
export const validateCardNumber = (cardNumber: string): boolean => {
    // Remove espaços e caracteres não numéricos
    const digitsOnly = cardNumber.replace(/\D/g, '');
    
    if (digitsOnly.length < 13 || digitsOnly.length > 19) {
      return false;
    }
    
    // Algoritmo de Luhn (mod 10)
    let sum = 0;
    let shouldDouble = false;
    
    // Percorre do dígito mais à direita para a esquerda
    for (let i = digitsOnly.length - 1; i >= 0; i--) {
      let digit = parseInt(digitsOnly.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return (sum % 10) === 0;
};
  
  /**
   * Detecta a bandeira do cartão com base no seu número
   * @param cardNumber Número do cartão (com ou sem espaços)
   * @returns Bandeira do cartão ou 'unknown' se não for reconhecido
   */
export const detectCardBrand = (cardNumber: string): CardBrand => {
    // Remove espaços e caracteres não numéricos
    const digitsOnly = cardNumber.replace(/\D/g, '');
    
    // Visa: Começa com 4
    if (/^4/.test(digitsOnly)) {
      return 'visa' as CardBrand;
    }
    
    // Mastercard: Começa com 51-55 ou 2221-2720
    if (/^5[1-5]/.test(digitsOnly) || /^(222[1-9]|22[3-9]\d|2[3-6]\d\d|27[0-1]\d|2720)/.test(digitsOnly)) {
      return 'mastercard' as CardBrand;
    }
    
    // American Express: Começa com 34 ou 37
    if (/^3[47]/.test(digitsOnly)) {
      return 'amex' as CardBrand;
    }
    
    // Discover: Começa com 6011, 622126-622925, 644-649 ou 65
    if (/^(6011|65|64[4-9]|622(12[6-9]|1[3-9]\d|[2-8]\d\d|9[0-1]\d|92[0-5]))/.test(digitsOnly)) {
      return 'discover' as CardBrand;
    }
    
    // Elo: Padrões específicos para o Brasil
    if (/^(401178|401179|438935|457631|457632|504175|627780|636297|636368|651652|651653|651654|651655|651656|651657|651658|651659|655000|655001|655002)/.test(digitsOnly)) {
      return 'elo' as CardBrand;
    }
    
    // Hipercard: Começa com 606282
    if (/^(606282)/.test(digitsOnly)) {
      return 'hipercard' as CardBrand;
    }
    
    return 'other' as CardBrand;
};
  
  /**
   * Valida data de expiração do cartão no formato MM/YY ou MM/YYYY
   * @param expiryDate Data de expiração no formato MM/YY ou MM/YYYY
   * @returns Verdadeiro se a data for válida e estiver no futuro
   */
export const validateExpiryDate = (expiryDate: string): boolean => {
    // Verifica o formato MM/YY ou MM/YYYY
    if (!/^\d{2}\/\d{2}(\d{2})?$/.test(expiryDate)) {
      return false;
    }
    
    const parts = expiryDate.split('/');
    const month = parseInt(parts[0], 10);
    let year = parseInt(parts[1], 10);
    
    // Ajusta o ano se for formato de 2 dígitos
    if (year < 100) {
      year += 2000;
    }
    
    // Verifica se o mês é válido (1-12)
    if (month < 1 || month > 12) {
      return false;
    }
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() retorna 0-11
    
    // Verifica se a data está no futuro
    return (year > currentYear) || (year === currentYear && month >= currentMonth);
};
  
  /**
   * Valida nome do titular do cartão
   * @param cardHolderName Nome do titular
   * @returns Verdadeiro se o nome for válido
   */
export const validateCardHolderName = (cardHolderName: string): boolean => {
    // Nome deve ter pelo menos 3 caracteres e conter apenas letras, espaços e pontuações comuns
    return /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\'.]{3,}$/.test(cardHolderName);
};
  
  /**
   * Valida o cartão completo
   * @param card Dados do cartão
   * @returns Objeto com resultado da validação e mensagens de erro
   */
export const validateCard = (card: Partial<IPaymentCard>): { 
    isValid: boolean; 
    errors: Record<string, string>;
} => {
    const errors: Record<string, string> = {};
    
    // Validar campos obrigatórios
    if (!card.cardHolderName) {
      errors.cardHolderName = 'O nome do titular é obrigatório';
    } else if (!validateCardHolderName(card.cardHolderName)) {
      errors.cardHolderName = 'Nome do titular inválido';
    }
    
    if (!card.expiryDate) {
      errors.expiryDate = 'A data de validade é obrigatória';
    } else if (!validateExpiryDate(card.expiryDate)) {
      errors.expiryDate = 'Data de validade inválida ou expirada';
    }
    
    if (!card.cardType) {
      errors.cardType = 'O tipo de cartão é obrigatório';
    }
    
    if (!card.securitySettings) {
      errors.securitySettings = 'As configurações de segurança são obrigatórias';
    } else {
      // Validar configurações de segurança
      if (card.securitySettings.transactionApprovalThreshold <= 0) {
        errors['securitySettings.transactionApprovalThreshold'] = 'O limiar de aprovação deve ser maior que zero';
      }
      
      if (card.securitySettings.maxDailyTransactionAmount <= 0) {
        errors['securitySettings.maxDailyTransactionAmount'] = 'O limite diário deve ser maior que zero';
      }
      
      if (card.securitySettings.maxMonthlyTransactionAmount <= 0) {
        errors['securitySettings.maxMonthlyTransactionAmount'] = 'O limite mensal deve ser maior que zero';
      }
      
      if (card.securitySettings.maxMonthlyTransactionAmount < card.securitySettings.maxDailyTransactionAmount) {
        errors['securitySettings.maxMonthlyTransactionAmount'] = 'O limite mensal deve ser maior ou igual ao limite diário';
      }
    }
    
    // Validar restrições de uso
    if (!card.usageRestrictions) {
      errors.usageRestrictions = 'As restrições de uso são obrigatórias';
    } else {
      if (!card.usageRestrictions.allowedDaysOfWeek || card.usageRestrictions.allowedDaysOfWeek.length === 0) {
        errors['usageRestrictions.allowedDaysOfWeek'] = 'Deve haver pelo menos um dia da semana permitido';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
};
  
  /**
   * Valida uma transação
   * @param transaction Dados da transação
   * @returns Objeto com resultado da validação e mensagens de erro
   */
export const validateTransaction = (transaction: Partial<ITransaction>): {
    isValid: boolean;
    errors: Record<string, string>;
} => {
    const errors: Record<string, string> = {};
    
    // Validar campos obrigatórios
    if (!transaction.cardId) {
      errors.cardId = 'O ID do cartão é obrigatório';
    }
    
    if (!transaction.amount) {
      errors.amount = 'O valor da transação é obrigatório';
    } else if (transaction.amount <= 0) {
      errors.amount = 'O valor da transação deve ser maior que zero';
    }
    
    if (!transaction.merchant) {
      errors.merchant = 'O nome do estabelecimento é obrigatório';
    }
    
    if (!transaction.category) {
      errors.category = 'A categoria da transação é obrigatória';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
};
  
  /**
   * Verifica se uma transação está dentro das restrições de uso do cartão
   * @param transaction Transação a ser verificada
   * @param card Cartão utilizado
   * @returns Objeto com resultado da verificação e mensagens de erro
   */
export const validateTransactionAgainstCardRestrictions = (
    transaction: ITransaction, 
    card: IPaymentCard
): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];
    const restrictions = card.usageRestrictions;
    
    // Verificar status do cartão
    if (card.status !== 'active') {
      errors.push(`Cartão não está ativo (status atual: ${card.status})`);
    }
    
    // Verificar categoria permitida
    if (!restrictions.allowedCategories.includes(transaction.category)) {
      errors.push(`Categoria '${transaction.category}' não permitida para este cartão`);
    }
    
    // Verificar estabelecimento restrito
    if (restrictions.restrictedMerchants && 
        restrictions.restrictedMerchants.some(merchant => 
          transaction.merchant.toLowerCase().includes(merchant.toLowerCase())
        )) {
      errors.push(`Estabelecimento '${transaction.merchant}' está na lista de restrições`);
    }
    
    // Verificar dia da semana
    const transactionDate = new Date(transaction.timestamp);
    const dayOfWeek = transactionDate.getDay(); // 0-6 (domingo-sábado)
    
    if (!restrictions.allowedDaysOfWeek.includes(dayOfWeek)) {
      const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      errors.push(`Transações não são permitidas em ${days[dayOfWeek]}`);
    }
    
    // Verificar horário permitido
    if (restrictions.allowedTimeStart && restrictions.allowedTimeEnd) {
      const hour = transactionDate.getHours();
      const minute = transactionDate.getMinutes();
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      if (timeStr < restrictions.allowedTimeStart || timeStr > restrictions.allowedTimeEnd) {
        errors.push(`Transação fora do horário permitido (${restrictions.allowedTimeStart} - ${restrictions.allowedTimeEnd})`);
      }
    }
    
    // Verificar restrições geográficas, se fornecidas na transação
    if (restrictions.geographicRestrictions && restrictions.geographicRestrictions.length > 0 && transaction.location) {
      const locationLower = transaction.location.toLowerCase();
      
      for (const geoRestriction of restrictions.geographicRestrictions) {
        const valueInLocation = locationLower.includes(geoRestriction.value.toLowerCase());
        
        if (valueInLocation && !geoRestriction.allowed) {
          errors.push(`Transação em localização restrita: ${geoRestriction.value}`);
          break;
        }
      }
    }
    
    // Verificar limites de valor
    if (transaction.amount > card.securitySettings.maxDailyTransactionAmount) {
      errors.push(`Valor excede o limite diário de R$ ${card.securitySettings.maxDailyTransactionAmount.toLocaleString('pt-BR')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
};
  
  /**
   * Verifica se uma transação precisa de aprovação com base nas configurações do cartão
   * @param transaction Transação a ser verificada
   * @param card Cartão utilizado
   * @returns Verdadeiro se a transação precisar de aprovação
   */
export const transactionRequiresApproval = (
    transaction: ITransaction, 
    card: IPaymentCard
  ): boolean => {
    return transaction.amount > card.securitySettings.transactionApprovalThreshold;
};
  
  /**
   * Verifica se um usuário pode aprovar uma transação
   * @param userId ID do usuário
   * @param card Cartão utilizado na transação
   * @param amount Valor da transação
   * @returns Verdadeiro se o usuário puder aprovar a transação
   */
export const userCanApproveTransaction = (
    userId: string,
    card: IPaymentCard,
    amount: number
  ): boolean => {
    // Verificar se o usuário está na lista de aprovadores permitidos
    const isApprover = card.securitySettings.allowedApprovers.includes(userId);
    
    // Se não estiver na lista, não pode aprovar
    if (!isApprover) {
      return false;
    }
    
    // Aqui poderia haver verificações adicionais, como verificar se o usuário
    // tem um limite máximo de aprovação configurado em seu perfil
    
    return true;
};
  
  /**
   * Máscara número do cartão para exibição
   * @param cardNumber Número completo do cartão
   * @returns Número do cartão mascarado (ex: **** **** **** 1234)
   */
export const maskCardNumber = (cardNumber: string): string => {
    // Remove espaços e caracteres não numéricos
    const digitsOnly = cardNumber.replace(/\D/g, '');
    
    // Se o número for muito curto, retorna como está
    if (digitsOnly.length < 4) {
      return cardNumber;
    }
    
    // Preserva os últimos 4 dígitos
    const lastFour = digitsOnly.slice(-4);
    const maskedPart = '*'.repeat(digitsOnly.length - 4);
    
    // Formata com espaços a cada 4 caracteres
    let formatted = '';
    for (let i = 0; i < maskedPart.length; i++) {
      formatted += maskedPart[i];
      if ((i + 1) % 4 === 0 && i !== maskedPart.length - 1) {
        formatted += ' ';
      }
    }
    
    return `${formatted} ${lastFour}`;
};

/**
 * Valida os dados completos de um cartão, incluindo todos os campos necessários
 * para a criação ou atualização de um cartão no sistema
 * @param cardData Dados do cartão a serem validados
 * @returns Objeto com o resultado da validação, erros encontrados e dados normalizados
 */
export const validateCardData = (cardData: Partial<IPaymentCard>): {
    isValid: boolean;
    errors: Record<string, string>;
    normalizedData?: Partial<IPaymentCard>;
} => {
    const errors: Record<string, string> = {};
    const normalizedData: Partial<IPaymentCard> = { ...cardData };
    
    // Validação de campos básicos
    if (!cardData.cardHolderName) {
      errors.cardHolderName = 'O nome do titular é obrigatório';
    } else if (!validateCardHolderName(cardData.cardHolderName)) {
      errors.cardHolderName = 'Nome do titular inválido';
    }
    
    // Validação do número do cartão (quando fornecido)
    if (cardData.cardNumber && cardData.cardNumber.includes('*')) {
      // Se o número tem asteriscos, significa que está mascarado
      // Verificamos apenas os últimos 4 dígitos
      if (!/\*+ \d{4}$/.test(cardData.cardNumber)) {
        errors.cardNumber = 'Formato de número de cartão mascarado inválido';
      }
    } else if (cardData.cardNumber) {
      // Se o número não está mascarado, validamos completamente
      if (!validateCardNumber(cardData.cardNumber)) {
        errors.cardNumber = 'Número de cartão inválido';
      } else {
        // Se válido, detecta a bandeira e formata
        const brand = detectCardBrand(cardData.cardNumber);
        const lastFourDigits = cardData.cardNumber.replace(/\D/g, '').slice(-4);
        const maskedNumber = maskCardNumber(cardData.cardNumber);
        
        // Atualiza os dados normalizados
        normalizedData.cardBrand = brand;
        normalizedData.lastFourDigits = lastFourDigits;
        normalizedData.cardNumber = maskedNumber;
      }
    } else if (!cardData.id) {
      // Número é obrigatório apenas para novos cartões
      errors.cardNumber = 'O número do cartão é obrigatório';
    }
    
    // Validação da data de expiração
    if (!cardData.expiryDate) {
      errors.expiryDate = 'A data de validade é obrigatória';
    } else if (!validateExpiryDate(cardData.expiryDate)) {
      errors.expiryDate = 'Data de validade inválida ou expirada';
    }
    
    // Validação do tipo de cartão
    if (!cardData.cardType) {
      errors.cardType = 'O tipo de cartão é obrigatório';
    } else if (!Object.values(CardType).includes(cardData.cardType as CardType)) {
      errors.cardType = 'Tipo de cartão inválido';
    }
    
    // Validação das configurações de segurança
    if (!cardData.securitySettings) {
      errors.securitySettings = 'As configurações de segurança são obrigatórias';
    } else {
      const settings = cardData.securitySettings;
      
      // Limiares de valor
      if (settings.transactionApprovalThreshold <= 0) {
        errors['securitySettings.transactionApprovalThreshold'] = 'O limiar de aprovação deve ser maior que zero';
      }
      
      if (settings.maxDailyTransactionAmount <= 0) {
        errors['securitySettings.maxDailyTransactionAmount'] = 'O limite diário deve ser maior que zero';
      }
      
      if (settings.maxMonthlyTransactionAmount <= 0) {
        errors['securitySettings.maxMonthlyTransactionAmount'] = 'O limite mensal deve ser maior que zero';
      }
      
      if (settings.maxMonthlyTransactionAmount < settings.maxDailyTransactionAmount) {
        errors['securitySettings.maxMonthlyTransactionAmount'] = 'O limite mensal deve ser maior ou igual ao limite diário';
      }
      
      // Verificar aprovadores (se habilitado)
      if (settings.transactionApprovalThreshold > 0 && 
          (!settings.allowedApprovers || settings.allowedApprovers.length === 0)) {
        errors['securitySettings.allowedApprovers'] = 'Deve haver pelo menos um aprovador quando o limiar de aprovação é maior que zero';
      }
    }
    
    // Validação das restrições de uso
    if (!cardData.usageRestrictions) {
      errors.usageRestrictions = 'As restrições de uso são obrigatórias';
    } else {
      const restrictions = cardData.usageRestrictions;
      
      // Dias da semana permitidos
      if (!restrictions.allowedDaysOfWeek || restrictions.allowedDaysOfWeek.length === 0) {
        errors['usageRestrictions.allowedDaysOfWeek'] = 'Deve haver pelo menos um dia da semana permitido';
      } else {
        // Verificar se os dias são válidos (0-6)
        const validDays = restrictions.allowedDaysOfWeek.every(day => day >= 0 && day <= 6);
        if (!validDays) {
          errors['usageRestrictions.allowedDaysOfWeek'] = 'Dias da semana devem ser valores entre 0 (domingo) e 6 (sábado)';
        }
      }
      
      // Categorias permitidas
      if (!restrictions.allowedCategories || restrictions.allowedCategories.length === 0) {
        errors['usageRestrictions.allowedCategories'] = 'Deve haver pelo menos uma categoria de despesa permitida';
      }
      
      // Horários permitidos (se fornecidos)
      if (restrictions.allowedTimeStart && restrictions.allowedTimeEnd) {
        if (restrictions.allowedTimeStart >= restrictions.allowedTimeEnd) {
          errors['usageRestrictions.allowedTimeRange'] = 'O horário de início deve ser anterior ao horário de fim';
        }
      }
      
      // Restrições geográficas (se fornecidas)
      if (restrictions.geographicRestrictions && restrictions.geographicRestrictions.length > 0) {
        const validGeoRestrictions = restrictions.geographicRestrictions.every(
          geo => geo.value && ['country', 'region', 'city'].includes(geo.type)
        );
        
        if (!validGeoRestrictions) {
          errors['usageRestrictions.geographicRestrictions'] = 'Restrições geográficas inválidas';
        }
      }
    }
    
    // Validação de endereço de cobrança (se fornecido)
    if (cardData.billingAddress) {
      const address = cardData.billingAddress;
      
      if (!address.street) {
        errors['billingAddress.street'] = 'A rua é obrigatória';
      }
      
      if (!address.number) {
        errors['billingAddress.number'] = 'O número é obrigatório';
      }
      
      if (!address.city) {
        errors['billingAddress.city'] = 'A cidade é obrigatória';
      }
      
      if (!address.state) {
        errors['billingAddress.state'] = 'O estado é obrigatório';
      }
      
      if (!address.zipCode) {
        errors['billingAddress.zipCode'] = 'O CEP é obrigatório';
      } else if (!/^\d{5}-?\d{3}$/.test(address.zipCode)) { // Formato de CEP brasileiro
        errors['billingAddress.zipCode'] = 'Formato de CEP inválido';
      }
      
      if (!address.country) {
        errors['billingAddress.country'] = 'O país é obrigatório';
      }
    }
    
    // Validação de limites de crédito
    if (cardData.creditLimit !== undefined && cardData.creditLimit <= 0) {
      errors.creditLimit = 'O limite de crédito deve ser maior que zero';
    }
    
    if (cardData.availableBalance !== undefined && cardData.availableBalance < 0) {
      errors.availableBalance = 'O saldo disponível não pode ser negativo';
    }
    
    if (cardData.creditLimit !== undefined && cardData.availableBalance !== undefined) {
      if (cardData.availableBalance > cardData.creditLimit) {
        errors.availableBalance = 'O saldo disponível não pode ser maior que o limite de crédito';
      }
    }
    
    // Validação do departamento (se fornecido)
    if (cardData.departmentId && !cardData.departmentName) {
      errors.departmentName = 'O nome do departamento é obrigatório quando o ID do departamento é fornecido';
    }
    
    // Validação do status (se fornecido)
    if (cardData.status && !Object.values(CardStatus).includes(cardData.status as CardStatus)) {
      errors.status = 'Status inválido';
    }
    
    const isValid = Object.keys(errors).length === 0;
    
    return {
      isValid,
      errors,
      normalizedData: isValid ? normalizedData : undefined
    };
};