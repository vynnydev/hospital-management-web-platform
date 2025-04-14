/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';

interface IntegrationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  onSave?: (data: any) => Promise<boolean>;
  title: string;
  children: React.ReactNode;
}

export const IntegrationConfigModal: React.FC<IntegrationConfigModalProps> = ({
  isOpen,
  onClose,
  onDeactivate,
  onSave,
  title,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uniqueFormId] = useState(() => `form_${Math.random().toString(36).substring(2, 10)}`);
  
  // Função para limpar campos de formulário quando o modal é aberto
  const clearFormFields = useCallback(() => {
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll('input:not([type="checkbox"]):not([type="radio"])');
      inputs.forEach(input => {
        const htmlInput = input as HTMLInputElement;
        if (!htmlInput.dataset.preserveValue) {
          htmlInput.value = '';
        }
      });
    }
  }, []);
  
  // Garantir que o foco seja capturado pelo modal e não vá para o campo de busca
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Pequeno atraso para garantir que o DOM foi renderizado
      setTimeout(() => {
        modalRef.current?.focus();
        clearFormFields();
      }, 50);
    }
  }, [isOpen, clearFormFields]);

  // Reset dos estados quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      setSaveSuccess(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  // Interromper a propagação de eventos para campos do formulário
  const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  // Coletar dados do formulário
  const collectFormData = useCallback((): Record<string, any> => {
    if (!formRef.current) return {};
    
    const formData = new FormData(formRef.current);
    const data: Record<string, any> = {};
    
    // Processar elementos do formulário
    formRef.current.querySelectorAll('input, select, textarea').forEach(element => {
      const input = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const name = input.name;
      
      if (!name) return;
      
      // Processar checkboxes
      if (input instanceof HTMLInputElement && input.type === 'checkbox') {
        // Usa o atributo data-value-path para estrutura aninhada
        const valuePath = input.dataset.valuePath;
        
        if (valuePath) {
          const parts = valuePath.split('.');
          let current = data;
          
          // Criar a estrutura de objetos aninhados
          for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {};
            current = current[parts[i]];
          }
          
          // Definir o valor da propriedade mais interna
          current[parts[parts.length - 1]] = input.checked;
        } else {
          data[name] = input.checked;
        }
        return;
      }
      
      // Processar outros tipos de campos
      if (formData.has(name)) {
        const value = formData.get(name);
        
        // Converter números se apropriado
        if (input.dataset.type === 'number' && typeof value === 'string') {
          data[name] = value === '' ? null : Number(value);
        } else {
          data[name] = value;
        }
      }
    });
    
    return data;
  }, []);

  // Manipulador de salvamento
  const handleSave = async () => {
    if (!onSave) {
      onClose();
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Coletar dados do formulário
      const formData = collectFormData();
      
      // Chamar função de salvamento
      const success = await onSave(formData);
      
      if (success) {
        setSaveSuccess(true);
        
        // Fechar o modal após salvar com sucesso
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-7xl bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden"
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
        tabIndex={-1} // Torna o div focável, mas não na sequência de tab
        data-modal-id={uniqueFormId}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {saveSuccess && (
            <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-300 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Configurações salvas com sucesso!
            </div>
          )}
          
          {/* Envolver o conteúdo em um formulário para capturar os dados corretamente */}
          <form 
            ref={formRef}
            id={uniqueFormId}
            onClick={stopPropagation} 
            onKeyDown={stopPropagation} 
            className="pointer-events-auto"
            autoComplete="off" // Desabilitar autocompletar para todo o formulário
            onSubmit={(e) => e.preventDefault()} // Prevenir envio acidental
          >
            {/* Campos invisíveis para desenganar o preenchimento automático */}
            <div style={{ display: 'none', height: 0, opacity: 0 }}>
              <input type="text" name="fake-username" autoComplete="username" />
              <input type="password" name="fake-password" autoComplete="current-password" />
              <input type="email" name="fake-email" autoComplete="email" />
            </div>
            
            {children}
          </form>
        </div>

        <div className="flex justify-between space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onDeactivate}
            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Desativar Integração
          </button>
          <div className="flex flex-row">
            <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 mr-2"
                disabled={isSaving}
                type="button"
                >
                Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center disabled:opacity-50 disabled:hover:bg-blue-600 disabled:cursor-not-allowed"
              disabled={isSaving}
              type="button"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};