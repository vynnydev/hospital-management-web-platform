import React from 'react';
import { FilePlus, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { IAlertTemplate } from '@/types/alert-types';
import { INotificationSettings } from '@/types/notification-settings-types';

interface AlertTemplatesProps {
  templates: IAlertTemplate[];
  onSelectTemplate?: (templateId: string) => void;
  onCreateTemplate?: () => void;
  showConfiguration?: boolean;
  settings?: INotificationSettings;
  onUpdateSettings?: (settings: Partial<INotificationSettings>) => void;
}

export const AlertTemplates: React.FC<AlertTemplatesProps> = ({
  templates,
  onSelectTemplate,
  onCreateTemplate,
  showConfiguration = true,
  settings,
  onUpdateSettings
}) => {
  // Estado para os inputs do formulário
  const [emails, setEmails] = React.useState<string>(
    settings?.emails ? settings.emails.join(', ') : ''
  );
  const [phones, setPhones] = React.useState<string>(
    settings?.phones ? settings.phones.join(', ') : ''
  );
  const [repeatInterval, setRepeatInterval] = React.useState<string>(
    settings?.repeatInterval ? settings.repeatInterval.toString() : '30'
  );
  
  // Efeito para atualizar os estados quando as configurações mudarem
  React.useEffect(() => {
    if (settings) {
      setEmails(settings.emails.join(', '));
      setPhones(settings.phones.join(', '));
      setRepeatInterval(settings.repeatInterval.toString());
    }
  }, [settings]);
  
  // Handler para salvar as configurações
  const handleSaveSettings = () => {
    if (onUpdateSettings) {
      const updatedSettings: Partial<INotificationSettings> = {
        emails: emails.split(',').map(email => email.trim()),
        phones: phones.split(',').map(phone => phone.trim()),
        repeatInterval: parseInt(repeatInterval, 10)
      };
      
      onUpdateSettings(updatedSettings);
    }
  };
  
  return (
    <div className="lg:col-span-1 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Templates de Alertas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {templates.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <p className="mb-4">Nenhum template disponível.</p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={onCreateTemplate}
              >
                <FilePlus className="h-4 w-4 mr-2" />
                Criar Novo Template
              </Button>
            </div>
          ) : (
            <>
              {templates.map(template => (
                <div 
                  key={template.id}
                  className="p-3 border rounded-lg border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 cursor-pointer"
                  onClick={() => onSelectTemplate && onSelectTemplate(template.id)}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium">{template.name}</h4>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      template.priority === 'high' || template.priority === 'critical'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : template.priority === 'medium'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    }`}>
                      {template.priority === 'high' ? 'Alta' : 
                       template.priority === 'medium' ? 'Média' : 
                       template.priority === 'critical' ? 'Crítica' : 'Baixa'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {template.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.channels.map(channel => (
                      <span 
                        key={channel}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded"
                      >
                        {channel === 'email' ? 'Email' : 
                         channel === 'sms' ? 'SMS' : 
                         channel === 'dashboard' ? 'Dashboard' : 'App'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={onCreateTemplate}
              >
                <FilePlus className="h-4 w-4 mr-2" />
                Criar Novo Template
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      
      {showConfiguration && settings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configurações de Notificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destinatários Padrão (Email)
              </label>
              <Input 
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="ex: coordenacao@hospital.com, plantao@hospital.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Números de Telefone (SMS)
              </label>
              <Input 
                value={phones}
                onChange={(e) => setPhones(e.target.value)}
                placeholder="ex: +55 11 98765-4321, +55 11 91234-5678"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Periodicidade de Repetição
              </label>
              <Select 
                value={repeatInterval}
                onValueChange={setRepeatInterval}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um intervalo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="0">Não repetir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleSaveSettings}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};