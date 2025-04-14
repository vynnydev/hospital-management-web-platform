import React from 'react';
import { Link, AlertTriangle } from 'lucide-react';
import { TeamsWebhookInput } from './webhook/TeamsWebhookInput';

interface TeamsWebhooksTabProps {
  webhooks: {
    notificationsWebhook: string;
    appointmentsWebhook: string;
    alertsWebhook: string;
  };
  onWebhookChange: (field: string, value: string) => void;
}

export const TeamsWebhooksTab: React.FC<TeamsWebhooksTabProps> = ({ 
  webhooks, 
  onWebhookChange 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Configuração de Webhooks</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Configure URLs de webhook para enviar dados do sistema hospitalar para o Microsoft Teams.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 space-y-5">
        <TeamsWebhookInput
          label="Webhook para Notificações Gerais"
          value={webhooks.notificationsWebhook}
          onChange={(value) => onWebhookChange('notificationsWebhook', value)}
          placeholder="https://contoso.webhook.office.com/webhookb2/..."
        />

        <TeamsWebhookInput
          label="Webhook para Agendamentos e Consultas"
          value={webhooks.appointmentsWebhook}
          onChange={(value) => onWebhookChange('appointmentsWebhook', value)}
          placeholder="https://contoso.webhook.office.com/webhookb2/..."
        />

        <TeamsWebhookInput
          label="Webhook para Alertas e Emergências"
          value={webhooks.alertsWebhook}
          onChange={(value) => onWebhookChange('alertsWebhook', value)}
          placeholder="https://contoso.webhook.office.com/webhookb2/..."
        />
        
        <div className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
            <Link className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Como obter webhooks do Teams?</h4>
            <ol className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4 list-decimal">
              <li>No Microsoft Teams, navegue até o canal desejado</li>
              <li>Clique nos três pontos ao lado do nome do canal</li>
              <li>Selecione &quot;Conectores&quot;</li>
              <li>Encontre e configure o &quot;Webhook Incoming&quot;</li>
              <li>Copie a URL do webhook gerada e cole aqui</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Observações importantes</h4>
          <p className="text-sm text-yellow-500 dark:text-yellow-300 mt-1">
            Proteja seus webhooks como informações confidenciais. Qualquer pessoa com acesso a esses links
            poderá enviar mensagens para seus canais do Teams. Recomendamos criar webhooks separados para
            cada tipo de notificação para facilitar o gerenciamento.
          </p>
        </div>
      </div>
    </div>
  );
};