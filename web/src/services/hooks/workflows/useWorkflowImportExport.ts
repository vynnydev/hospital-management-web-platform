// src/hooks/useWorkflowImportExport.ts
import { useState } from 'react';
import { IWorkflowNode } from '@/types/workflow/customize-process-by-workflow-types';
import { WorkflowImportExport } from '@/services/workflows/WorkflowImportExport';

export const useWorkflowImportExport = () => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [isProcessing, setIsProcessing] = useState(false);

  const exportWorkflow = async (workflow: IWorkflowNode[]) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await WorkflowImportExport.exportToFile(workflow, exportFormat);
    } finally {
      setIsProcessing(false);
    }
  };

  const importWorkflow = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setWorkflow: (workflow: IWorkflowNode[]) => void
  ) => {
    if (isProcessing) return;

    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const importedWorkflow = await WorkflowImportExport.importFromFile(file);
      setWorkflow(importedWorkflow);
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  return {
    exportFormat,
    setExportFormat,
    exportWorkflow,
    importWorkflow,
    isProcessing
  };
};