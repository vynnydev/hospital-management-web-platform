/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import api from '@/services/api';
import { 
  AuditAction, 
  ResourceType, 
  Severity, 
  AuditCategory, 
  ICardSecurityAlert
} from '@/types/payment-types';

// Serviços de segurança
export const securityService = {
  // Autenticação para o sistema de pagamentos
  authenticateForPayments: async (
    userId: string, 
    password: string, 
    secondFactorCode?: string
  ): Promise<boolean> => {
    try {
      const response = await api.post('/security/payments/authenticate', {
        userId,
        password,
        secondFactorCode
      });
      
      if (response.data.accessToken) {
        // Armazenar o token JWT para uso em requisições subsequentes
        localStorage.setItem('payment_access_token', response.data.accessToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  },
  
  // Verifica se o segundo fator é necessário
  isTwoFactorRequired: async (userId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/security/users/${userId}/2fa-required`);
      return response.data.required;
    } catch (error) {
      console.error('Error checking 2FA requirement:', error);
      return true; // Por segurança, assumir que é necessário em caso de erro
    }
  },
  
  // Gerar e enviar código para segundo fator
  generateAndSend2FACode: async (
    userId: string, 
    method: 'app' | 'sms' | 'email'
  ): Promise<boolean> => {
    try {
      const response = await api.post('/security/2fa/generate-code', {
        userId,
        method
      });
      
      return response.data.success;
    } catch (error) {
      console.error('Error generating 2FA code:', error);
      return false;
    }
  },
  
  // Registrar ação para auditoria
  logAction: async (payload: {
    userId: string;
    action: AuditAction | string;
    resource: string;
    resourceId: string;
    resourceType: ResourceType | string;
    details: string;
    result?: 'success' | 'failure';
    severity?: Severity | string;
    category?: AuditCategory | string;
    before?: string;
    after?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<boolean> => {
    try {
      // Obter informações do navegador se não fornecidas
      if (!payload.ipAddress) {
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          payload.ipAddress = ipData.ip;
        } catch (err) {
          payload.ipAddress = 'unknown';
        }
      }
      
      if (!payload.userAgent && typeof window !== 'undefined') {
        payload.userAgent = window.navigator.userAgent;
      }
      
      // Definir valores padrão se não fornecidos
      const auditPayload = {
        ...payload,
        result: payload.result || 'success',
        severity: payload.severity || 'info',
        category: payload.category || determineCategory(payload.action, payload.resourceType),
        timestamp: new Date().toISOString(),
      };
      
      const response = await api.post('/audit-logs', auditPayload);
      return response.data.success;
    } catch (error) {
      console.error('Error logging action for audit:', error);
      // Em caso de falha no log, não interromper o fluxo normal da aplicação
      return false;
    }
  },
  
  // Verificar sessão ativa do sistema de pagamentos
  checkPaymentSession: async (userId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/security/payments/session/${userId}`);
      return response.data.valid;
    } catch (error) {
      console.error('Error checking payment session:', error);
      return false;
    }
  },
  
  // Encerrar sessão do sistema de pagamentos
  logoutFromPayments: async (userId: string): Promise<boolean> => {
    try {
      await api.post('/security/payments/logout', { userId });
      localStorage.removeItem('payment_access_token');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('payment_access_token');
      return false;
    }
  },
  
  // Alterar configurações de segurança de um cartão
  updateCardSecuritySettings: async (
    cardId: string, 
    settings: any,
    userId: string
  ): Promise<boolean> => {
    try {
      const response = await api.patch(`/payment-cards/${cardId}/security`, settings);
      
      // Log da ação de alteração das configurações de segurança
      await securityService.logAction({
        userId,
        action: 'update',
        resource: 'Configurações de Segurança do Cartão',
        resourceId: cardId,
        resourceType: 'security_setting',
        details: 'Alteração nas configurações de segurança do cartão',
        severity: 'info',
        category: 'security'
      });
      
      return response.data.success;
    } catch (error) {
      console.error(`Error updating security settings for card ${cardId}:`, error);
      return false;
    }
  },
  
  // Verificar autenticação biométrica
  verifyBiometricAuthentication: async (userId: string): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      return false;
    }
    
    try {
      // Verificar se a API WebAuthn está disponível
      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) return false;
      
      // Obter desafio do servidor
      const challengeResponse = await api.get(`/security/biometric/challenge/${userId}`);
      const challenge = challengeResponse.data.challenge;
      
      // Solicitar autenticação biométrica
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(challenge),
          rpId: window.location.hostname,
          userVerification: 'required',
          timeout: 60000
        }
      }) as PublicKeyCredential;
      
      // Enviar resposta para o servidor
      const response = credential.response as AuthenticatorAssertionResponse;
      const authenticatorData = new Uint8Array(response.authenticatorData);
      const clientDataJSON = new Uint8Array(response.clientDataJSON);
      const signature = new Uint8Array(response.signature);
      
      const verificationResponse = await api.post('/security/biometric/verify', {
        userId,
        credentialId: credential.id,
        authenticatorData: Array.from(authenticatorData),
        clientDataJSON: Array.from(clientDataJSON),
        signature: Array.from(signature)
      });
      
      return verificationResponse.data.success;
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return false;
    }
  },
  
  // Implementar desafio de segurança
  initiateSecurityChallenge: async (
    userId: string,
    challengeType: 'email' | 'sms' | 'questions'
  ): Promise<{
    challengeId: string;
    success: boolean;
    message: string;
  }> => {
    try {
      const response = await api.post('/security/challenge/initiate', {
        userId,
        challengeType
      });
      
      return response.data;
    } catch (error) {
      console.error('Error initiating security challenge:', error);
      return {
        challengeId: '',
        success: false,
        message: 'Não foi possível iniciar o desafio de segurança'
      };
    }
  },
  
  // Verificar resposta ao desafio de segurança
  verifySecurityChallenge: async (
    challengeId: string,
    response: string
  ): Promise<boolean> => {
    try {
      const verificationResponse = await api.post('/security/challenge/verify', {
        challengeId,
        response
      });
      
      return verificationResponse.data.success;
    } catch (error) {
      console.error('Error verifying security challenge:', error);
      return false;
    }
  },

  getCardSecurityAlerts: async (cardId: string): Promise<ICardSecurityAlert[]> => {
    try {
      const response = await api.get(`/payment-cards/${cardId}/security-alerts`);
      
      // Log the action of checking security alerts
      await securityService.logAction({
        userId: 'system', // or pass actual user ID if available
        action: 'view',
        resource: 'Alertas de Segurança do Cartão',
        resourceId: cardId,
        resourceType: 'card',
        details: 'Verificação de alertas de segurança',
        severity: 'info',
        category: 'security'
      });
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching security alerts for card ${cardId}:`, error);
      
      // Log the error
      await securityService.logAction({
        userId: 'system', // or pass actual user ID if available
        action: 'view',
        resource: 'Alertas de Segurança do Cartão',
        resourceId: cardId,
        resourceType: 'card',
        details: 'Falha ao verificar alertas de segurança',
        severity: 'warning',
        category: 'security',
        result: 'failure'
      });
      
      return []; // Return empty array in case of error
    }
  },
};

// Função auxiliar para determinar a categoria da ação de auditoria
const determineCategory = (
  action: AuditAction | string,
  resourceType: ResourceType | string
): AuditCategory => {
  if (resourceType === 'security_setting' || 
      action === 'login' || 
      action === 'logout' || 
      action === 'failed_login') {
    return 'security' as AuditCategory;
  }
  
  if (resourceType === 'card' || 
      resourceType === 'transaction' || 
      resourceType === 'approval') {
    return 'payment' as AuditCategory;
  }
  
  if (resourceType === 'system') {
    return 'system' as AuditCategory;
  }
  
  if (action === 'export') {
    return 'user_activity' as AuditCategory;
  }
  
  return 'configuration' as AuditCategory;
};