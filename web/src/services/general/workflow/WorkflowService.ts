import { ICustomWorkflow, IWorkflowSettings, IWorkflowStats, IWorkflowTemplate } from '@/types/workflow/workflow-types';

class WorkflowService {
  private baseUrl = 'http://localhost:3001';

  // Obter templates de workflow
  async getWorkflowTemplates(): Promise<IWorkflowTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/workflow-templates`);
      if (!response.ok) {
        throw new Error('Falha ao buscar templates de workflow');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar templates de workflow:', error);
      throw error;
    }
  }

  // Obter um template específico
  async getWorkflowTemplate(id: string): Promise<IWorkflowTemplate> {
    try {
      const response = await fetch(`${this.baseUrl}/workflow-templates/${id}`);
      if (!response.ok) {
        throw new Error(`Falha ao buscar template ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar template ${id}:`, error);
      throw error;
    }
  }

  // Obter workflows personalizados
  async getCustomWorkflows(): Promise<ICustomWorkflow[]> {
    try {
      const response = await fetch(`${this.baseUrl}/custom-workflows`);
      if (!response.ok) {
        throw new Error('Falha ao buscar workflows personalizados');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar workflows personalizados:', error);
      throw error;
    }
  }

  // Obter um workflow personalizado específico
  async getCustomWorkflow(id: string): Promise<ICustomWorkflow> {
    try {
      const response = await fetch(`${this.baseUrl}/custom-workflows/${id}`);
      if (!response.ok) {
        throw new Error(`Falha ao buscar workflow personalizado ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar workflow personalizado ${id}:`, error);
      throw error;
    }
  }

  // Criar um novo workflow personalizado a partir de um template
  async createCustomWorkflow(templateId: string, customizations: Partial<ICustomWorkflow>): Promise<ICustomWorkflow> {
    try {
      const response = await fetch(`${this.baseUrl}/custom-workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          ...customizations,
          status: customizations.status || 'draft'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao criar workflow personalizado');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar workflow personalizado:', error);
      throw error;
    }
  }

  // Atualizar um workflow personalizado
  async updateCustomWorkflow(id: string, updates: Partial<ICustomWorkflow>): Promise<ICustomWorkflow> {
    try {
      const response = await fetch(`${this.baseUrl}/custom-workflows/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`Falha ao atualizar workflow ${id}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar workflow ${id}:`, error);
      throw error;
    }
  }

  // Excluir um workflow personalizado
  async deleteCustomWorkflow(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/custom-workflows/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (error) {
      console.error(`Erro ao excluir workflow ${id}:`, error);
      throw error;
    }
  }

  // Obter estatísticas de workflows
  async getWorkflowStats(): Promise<IWorkflowStats> {
    try {
      const response = await fetch(`${this.baseUrl}/workflow-stats`);
      if (!response.ok) {
        throw new Error('Falha ao buscar estatísticas de workflow');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar estatísticas de workflow:', error);
      throw error;
    }
  }

  // Obter configurações de workflow
  async getWorkflowSettings(): Promise<IWorkflowSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/workflow-settings`);
      if (!response.ok) {
        throw new Error('Falha ao buscar configurações de workflow');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar configurações de workflow:', error);
      throw error;
    }
  }

  // Atualizar configurações de workflow
  async updateWorkflowSettings(settings: Partial<IWorkflowSettings>): Promise<IWorkflowSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/workflow-settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar configurações de workflow');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar configurações de workflow:', error);
      throw error;
    }
  }

  // Exportar workflow como JSON
  async exportWorkflow(id: string): Promise<string> {
    try {
      const workflow = await this.getCustomWorkflow(id);
      return JSON.stringify(workflow, null, 2);
    } catch (error) {
      console.error(`Erro ao exportar workflow ${id}:`, error);
      throw error;
    }
  }

  // Importar workflow a partir de JSON
  async importWorkflow(workflowJson: string): Promise<ICustomWorkflow> {
    try {
      const workflowData = JSON.parse(workflowJson);
      
      const response = await fetch(`${this.baseUrl}/custom-workflows/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao importar workflow');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao importar workflow:', error);
      throw error;
    }
  }
}

export const workflowService = new WorkflowService();