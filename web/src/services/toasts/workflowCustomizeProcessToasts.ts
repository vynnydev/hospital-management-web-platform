// src/services/toasts/workflowCustomizeProcessToasts.ts
import { toast } from "@/components/ui/hooks/use-toast";

export const workflowCustomizeProcessToasts = {
  success: (title: string, message: string) => {
    toast({
      title,
      description: message,
      variant: "default",
      duration: 1500,
    });
  },

  error: (title: string, message: string) => {
    toast({
      title,
      description: message,
      variant: "destructive",
      duration: 3000,
    });
  },

  // Toasts específicos
  workflowSaved: () => {
    workflowCustomizeProcessToasts.success(
      "Workflow salvo",
      "O workflow foi salvo com sucesso"
    );
  },

  workflowImported: () => {
    workflowCustomizeProcessToasts.success(
      "Workflow importado",
      "O workflow foi importado com sucesso"
    );
  },

  workflowExported: () => {
    workflowCustomizeProcessToasts.success(
      "Workflow exportado",
      "O workflow foi exportado com sucesso"
    );
  },

  collaborationCreated: () => {
    workflowCustomizeProcessToasts.success(
      "Colaboração criada",
      "O modo de colaboração foi iniciado"
    );
  },

  collaborationJoined: () => {
    workflowCustomizeProcessToasts.success(
      "Colaboração iniciada",
      "Você entrou no workflow colaborativo"
    );
  },

  nodeDeleted: () => {
    workflowCustomizeProcessToasts.success(
      "Nó removido",
      "O nó foi removido com sucesso"
    );
  },

  workflowCanceled: () => {
    workflowCustomizeProcessToasts.success(
      "Processo cancelado",
      "O processo foi cancelado com sucesso"
    );
  },

  aiAnalysisComplete: (efficiency: number, recommendations: string[]) => {
    workflowCustomizeProcessToasts.success(
      `Eficiência do Workflow: ${efficiency}%`,
      recommendations.join('\n') || 'Workflow bem estruturado!'
    );
  },

  // Erros
  invalidInviteCode: () => {
    workflowCustomizeProcessToasts.error(
      "Código inválido",
      "O código de convite é inválido"
    );
  },

  importError: () => {
    workflowCustomizeProcessToasts.error(
      "Erro na importação",
      "Não foi possível importar o workflow"
    );
  },

  exportError: () => {
    workflowCustomizeProcessToasts.error(
      "Erro na exportação",
      "Não foi possível exportar o workflow"
    );
  }
};