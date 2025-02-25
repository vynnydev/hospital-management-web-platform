/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/organisms/tabs';
import { AlertEditor } from './AlertEditor';
import { AlertHistory, sampleAlerts } from './AlertHistory';
import { AlertTemplates, sampleTemplates } from './AlertTemplates';

export const NotificationsTab: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  
  // Handlers para os componentes
  const handleTestAlert = () => {
    console.log('Testando alerta');
    // Implementar lógica para simular o disparo do alerta
  };
  
  const handleDisableAlert = () => {
    console.log('Desativando alerta');
    // Implementar lógica para desativar o alerta
  };
  
  const handleCancelEdit = () => {
    console.log('Edição cancelada');
    // Implementar lógica para cancelar a edição
  };
  
  const handleSaveAlert = (alertData: any) => {
    console.log('Alerta salvo:', alertData);
    // Implementar lógica para salvar os dados do alerta
  };
  
  const handleViewAlertDetails = (alertId: string) => {
    console.log('Visualizando detalhes do alerta:', alertId);
    setSelectedAlert(alertId);
    // Implementar lógica para carregar os detalhes do alerta
  };
  
  const handleSelectTemplate = (templateId: string) => {
    console.log('Template selecionado:', templateId);
    // Implementar lógica para carregar o template no editor
  };
  
  const handleCreateTemplate = () => {
    console.log('Criando novo template');
    // Implementar lógica para criar um novo template
  };

  return (
    <TabsContent value="notifications" className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Painel principal de alertas */}
        <div className="lg:col-span-2">
          <AlertEditor 
            onTest={handleTestAlert}
            onDisable={handleDisableAlert}
            onCancel={handleCancelEdit}
            onSave={handleSaveAlert}
          />
          
          <AlertHistory 
            alerts={sampleAlerts}
            onViewDetails={handleViewAlertDetails}
          />
        </div>
        
        {/* Painel Lateral para Templates e Configurações */}
        <AlertTemplates 
          templates={sampleTemplates}
          onSelectTemplate={handleSelectTemplate}
          onCreateTemplate={handleCreateTemplate}
        />
      </div>
    </TabsContent>
  );
};