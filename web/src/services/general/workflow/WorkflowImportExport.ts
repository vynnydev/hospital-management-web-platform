// src/services/workflow/workflowImportExport.ts
import { FileText } from 'lucide-react';
import { 
  IWorkflowNode, 
  IWorkflowExportFormat, 
  TPriority 
} from '@/types/workflow/customize-process-by-workflow-types';
import { workflowCustomizeProcessToasts } from '@/services/toasts/workflowCustomizeProcessToasts';

export class WorkflowImportExport {
  static async exportToFile(
    workflow: IWorkflowNode[], 
    format: 'json' | 'csv'
  ): Promise<void> {
    try {
      if (workflow.length === 0) {
        throw new Error('Não há workflow para exportar');
      }

      const exportData: IWorkflowExportFormat = {
        version: '1.0.0',
        metadata: {
          createdAt: new Date().toISOString(),
          name: `Workflow_${Date.now()}`
        },
        nodes: workflow
      };

      const fileName = `workflow_${exportData.metadata.name}`;
      let blob: Blob;
      
      if (format === 'json') {
        blob = this.createJsonBlob(exportData);
      } else {
        blob = this.createCsvBlob(workflow);
      }

      await this.downloadFile(blob, `${fileName}.${format}`);
      workflowCustomizeProcessToasts.workflowExported();
    } catch (error) {
      workflowCustomizeProcessToasts.exportError();
      console.error('Erro na exportação:', error);
    }
  }

  static async importFromFile(file: File): Promise<IWorkflowNode[]> {
    try {
      const content = await this.readFileContent(file);
      let importedWorkflow: IWorkflowNode[];

      if (file.name.endsWith('.json')) {
        importedWorkflow = await this.parseJsonWorkflow(content);
      } else if (file.name.endsWith('.csv')) {
        importedWorkflow = await this.parseCsvWorkflow(content);
      } else {
        throw new Error('Formato de arquivo não suportado');
      }

      this.validateWorkflowData(importedWorkflow);
      return importedWorkflow;
    } catch (error) {
      workflowCustomizeProcessToasts.importError();
      console.error('Erro na importação:', error);
      throw error;
    }
  }

  private static createJsonBlob(data: IWorkflowExportFormat): Blob {
    return new Blob(
      [JSON.stringify(data, null, 2)], 
      { type: 'application/json' }
    );
  }

  private static createCsvBlob(workflow: IWorkflowNode[]): Blob {
    const headers = 'label,subtitle,x,y,priority\n';
    const rows = workflow.map(node => 
      `${node.label},${node.subtitle || ''},${node.x},${node.y},${node.priority}`
    ).join('\n');
    
    return new Blob(
      [headers + rows], 
      { type: 'text/csv' }
    );
  }

  private static async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  private static async parseJsonWorkflow(content: string): Promise<IWorkflowNode[]> {
    const parsed: IWorkflowExportFormat = JSON.parse(content);
    return parsed.nodes;
  }

  private static async parseCsvWorkflow(content: string): Promise<IWorkflowNode[]> {
    const rows = content.split('\n').slice(1); // Remove header
    return rows.map(row => {
      const [label, subtitle, x, y, priority = 'medium', description, color] = row.split(',');
      return {
        id: `imported-${Math.random().toString(36).substr(2, 9)}`,
        label,
        subtitle: subtitle || undefined,
        x: Number(x),
        y: Number(y),
        priority: priority as TPriority,
        description, 
        color,
        icon: FileText // Aqui apenas referenciamos o componente FileText diretamente
      };
    });
  }

  private static validateWorkflowData(workflow: IWorkflowNode[]): void {
    const requiredFields = ['label', 'x', 'y', 'priority'];
    
    for (const node of workflow) {
      for (const field of requiredFields) {
        if (!(field in node)) {
          throw new Error(`Campo obrigatório ausente: ${field}`);
        }
      }

      if (typeof node.x !== 'number' || typeof node.y !== 'number') {
        throw new Error('Coordenadas inválidas');
      }
    }
  }

  private static async downloadFile(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}