/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { 
  IPaymentCard, 
  CardStatus, 
  ICardSecuritySettings,
  IGeographicRestriction
} from '@/types/payment-types';
import { securityService } from '@/services/general/payment/security/securityService';
import { paymentService } from '@/services/general/payment/paymentService';
import { useToast } from '@/components/ui/hooks/use-toast';

interface UseCardSecurityOptions {
  userId: string;
  canManage: boolean;
}

export const useCardSecurity = (cardId: string, options: UseCardSecurityOptions) => {
  const { userId, canManage } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securitySettings, setSecuritySettings] = useState<ICardSecuritySettings | null>(null);
  
  const { toast } = useToast();

  // Carregar configurações de segurança
  const loadSecuritySettings = useCallback(async () => {
    if (!cardId) return;
    
    try {
      setLoading(true);
      const card = await paymentService.getCardById(cardId);
      setSecuritySettings(card.securitySettings);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar configurações de segurança:', err);
      setError('Não foi possível carregar as configurações de segurança');
      toast({
        title: "Erro",
        description: "Falha ao carregar configurações de segurança do cartão.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [cardId, toast]);

  // Atualizar configurações de segurança
  const updateSecuritySettings = useCallback(async (newSettings: Partial<ICardSecuritySettings>) => {
    if (!cardId || !canManage) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para alterar as configurações de segurança.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      // Obter configurações atuais para log
      const currentSettings = await paymentService.getCardSecuritySettings(cardId);
      
      // Atualizar configurações
      const updatedSettings = await paymentService.updateCardSecuritySettings(cardId, newSettings);
      setSecuritySettings(updatedSettings);
      
      // Registrar ação para auditoria
      await securityService.logAction({
        userId,
        action: 'update',
        resource: 'Configurações de Segurança do Cartão',
        resourceId: cardId,
        resourceType: 'security_setting',
        details: 'Atualização de configurações de segurança do cartão',
        before: JSON.stringify(currentSettings),
        after: JSON.stringify({...currentSettings, ...newSettings})
      });
      
      toast({
        title: "Configurações atualizadas",
        description: "As configurações de segurança foram atualizadas com sucesso.",
        variant: "default",
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar configurações de segurança:', err);
      setError('Não foi possível atualizar as configurações de segurança');
      toast({
        title: "Erro",
        description: "Falha ao atualizar configurações de segurança do cartão.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [cardId, canManage, userId, toast]);

  // Alternar status de transações online
  const toggleOnlineTransactions = useCallback(async (enabled: boolean) => {
    return await updateSecuritySettings({ allowOnlineTransactions: enabled });
  }, [updateSecuritySettings]);

  // Alternar status de transações internacionais
  const toggleInternationalTransactions = useCallback(async (enabled: boolean) => {
    return await updateSecuritySettings({ allowInternationalTransactions: enabled });
  }, [updateSecuritySettings]);

  // Alternar requisito de PIN
  const toggleRequirePin = useCallback(async (enabled: boolean) => {
    return await updateSecuritySettings({ requiresPin: enabled });
  }, [updateSecuritySettings]);

  // Alternar requisito de 2FA
  const toggleRequire2FA = useCallback(async (enabled: boolean) => {
    return await updateSecuritySettings({ requires2FA: enabled });
  }, [updateSecuritySettings]);

  // Atualizar limiar de aprovação automática
  const updateApprovalThreshold = useCallback(async (threshold: number) => {
    return await updateSecuritySettings({ transactionApprovalThreshold: threshold });
  }, [updateSecuritySettings]);

  // Atualizar limites diários e mensais
  const updateTransactionLimits = useCallback(async (daily: number, monthly: number) => {
    return await updateSecuritySettings({ 
      maxDailyTransactionAmount: daily,
      maxMonthlyTransactionAmount: monthly
    });
  }, [updateSecuritySettings]);

  // Gerenciar aprovadores
  const updateApprovers = useCallback(async (approverIds: string[]) => {
    return await updateSecuritySettings({ allowedApprovers: approverIds });
  }, [updateSecuritySettings]);

  // Adicionar um aprovador
  const addApprover = useCallback(async (approverId: string) => {
    if (!securitySettings) return false;
    
    const updatedApprovers = [...securitySettings.allowedApprovers];
    if (!updatedApprovers.includes(approverId)) {
      updatedApprovers.push(approverId);
      return await updateSecuritySettings({ allowedApprovers: updatedApprovers });
    }
    
    return true;
  }, [securitySettings, updateSecuritySettings]);

  // Remover um aprovador
  const removeApprover = useCallback(async (approverId: string) => {
    if (!securitySettings) return false;
    
    const updatedApprovers = securitySettings.allowedApprovers.filter(id => id !== approverId);
    return await updateSecuritySettings({ allowedApprovers: updatedApprovers });
  }, [securitySettings, updateSecuritySettings]);

  // Adicionar restrição geográfica
  const addGeographicRestriction = useCallback(async (restriction: IGeographicRestriction) => {
    try {
      await paymentService.addCardGeographicRestriction(cardId, restriction);
      
      toast({
        title: "Restrição adicionada",
        description: `Restrição geográfica para ${restriction.value} adicionada com sucesso.`,
        variant: "default",
      });
      
      // Atualizar configurações locais
      await loadSecuritySettings();
      
      return true;
    } catch (err) {
      console.error('Erro ao adicionar restrição geográfica:', err);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a restrição geográfica.",
        variant: "destructive",
      });
      return false;
    }
  }, [cardId, loadSecuritySettings, toast]);

  // Remover restrição geográfica
  const removeGeographicRestriction = useCallback(async (index: number) => {
    try {
      await paymentService.removeCardGeographicRestriction(cardId, index);
      
      toast({
        title: "Restrição removida",
        description: "Restrição geográfica removida com sucesso.",
        variant: "default",
      });
      
      // Atualizar configurações locais
      await loadSecuritySettings();
      
      return true;
    } catch (err) {
      console.error('Erro ao remover restrição geográfica:', err);
      toast({
        title: "Erro",
        description: "Não foi possível remover a restrição geográfica.",
        variant: "destructive",
      });
      return false;
    }
  }, [cardId, loadSecuritySettings, toast]);

  // Bloquear o cartão (por questões de segurança)
  const blockCard = useCallback(async (reason: string) => {
    try {
      setLoading(true);
      
      await paymentService.updateCardStatus(cardId, 'blocked' as CardStatus);
      
      // Registrar ação para auditoria
      await securityService.logAction({
        userId,
        action: 'update',
        resource: 'Status do Cartão',
        resourceId: cardId,
        resourceType: 'card',
        details: `Cartão bloqueado por motivo de segurança: ${reason}`,
        severity: 'warning'
      });
      
      toast({
        title: "Cartão bloqueado",
        description: "O cartão foi bloqueado com sucesso por questões de segurança.",
        variant: "default",
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao bloquear cartão:', err);
      toast({
        title: "Erro",
        description: "Não foi possível bloquear o cartão.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [cardId, userId, toast]);

  // Verificar se existem alertas de segurança para este cartão
  const checkSecurityAlerts = useCallback(async () => {
    try {
      const alerts = await securityService.getCardSecurityAlerts(cardId);
      return alerts;
    } catch (err) {
      console.error('Erro ao verificar alertas de segurança:', err);
      return [];
    }
  }, [cardId]);

  // Gerar novo PIN para o cartão
  const regeneratePin = useCallback(async () => {
    if (!canManage) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para regenerar o PIN do cartão.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      await paymentService.regenerateCardPin(cardId);
      
      // Registrar ação para auditoria
      await securityService.logAction({
        userId,
        action: 'update',
        resource: 'PIN do Cartão',
        resourceId: cardId,
        resourceType: 'card',
        details: 'PIN do cartão regenerado',
        severity: 'warning'
      });
      
      toast({
        title: "PIN regenerado",
        description: "Um novo PIN foi gerado e enviado para o responsável pelo cartão.",
        variant: "default",
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao regenerar PIN:', err);
      toast({
        title: "Erro",
        description: "Não foi possível regenerar o PIN do cartão.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [cardId, canManage, userId, toast]);

  return {
    securitySettings,
    loading,
    error,
    loadSecuritySettings,
    updateSecuritySettings,
    toggleOnlineTransactions,
    toggleInternationalTransactions,
    toggleRequirePin,
    toggleRequire2FA,
    updateApprovalThreshold,
    updateTransactionLimits,
    updateApprovers,
    addApprover,
    removeApprover,
    addGeographicRestriction,
    removeGeographicRestriction,
    blockCard,
    checkSecurityAlerts,
    regeneratePin
  };
};