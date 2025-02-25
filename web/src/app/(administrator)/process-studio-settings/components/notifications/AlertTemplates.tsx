import React from 'react';
import { FilePlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { IAlertTemplate } from '@/types/settings-types';

interface AlertTemplatesProps {
  templates: IAlertTemplate[];
  onSelectTemplate?: (templateId: string) => void;
  onCreateTemplate?: () => void;
  showConfiguration?: boolean;
}

export const AlertTemplates: React.FC<AlertTemplatesProps> = ({
  templates,
  onSelectTemplate,
  onCreateTemplate,
  showConfiguration = true
}) => {
  return (
    <div className="lg:col-span-1 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Templates de Alertas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {templates.map(template => (
            <div 
              key={template.id}
              className="p-3 border rounded-lg border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 cursor-pointer"
              onClick={() => onSelectTemplate && onSelectTemplate(template.id)}
            >
              <h4 className="text-sm font-medium">{template.name}</h4>
              <p className="text-xs text-gray-500 mt-1">
                {template.description}
              </p>
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
        </CardContent>
      </Card>
      
      {showConfiguration && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configurações de Notificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destinatários Padrão (Email)
              </label>
              <Input defaultValue="coordenacao@hospital.com, plantao@hospital.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Números de Telefone (SMS)
              </label>
              <Input defaultValue="+55 11 98765-4321, +55 11 91234-5678" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Periodicidade de Repetição
              </label>
              <Select defaultValue="30">
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
            
            <Button className="w-full" variant="outline">
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Templates de exemplo para uso em outros componentes
export const sampleTemplates: IAlertTemplate[] = [
  {
    id: 'template-1',
    name: 'Ocupação Crítica',
    description: 'Alerta quando ocupação ultrapassa 90% da capacidade'
  },
  {
    id: 'template-2',
    name: 'Tempo de Espera Elevado',
    description: 'Notificação quando tempo médio de espera ultrapassa 45 minutos'
  },
  {
    id: 'template-3',
    name: 'Estoque Baixo',
    description: 'Alerta para medicamentos ou materiais com estoque abaixo do mínimo'
  }
];