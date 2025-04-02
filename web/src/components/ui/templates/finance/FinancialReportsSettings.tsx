import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/organisms/card';
import { Label } from '@/components/ui/organisms/label';
import { Input } from '@/components/ui/organisms/input';
import { Button } from '@/components/ui/organisms/button';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { Switch } from '@/components/ui/organisms/switch';
import { Slider } from '@/components/ui/organisms/slider';
import { Check, FileText } from 'lucide-react';
import { IFinancialReportSettings, TFinancialReportType } from '@/types/finance-types';

interface FinancialReportsSettingsProps {
  settings: IFinancialReportSettings;
  onSettingChange: (path: string, value: any) => void;
}

export const FinancialReportsSettings: React.FC<FinancialReportsSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  // Função para atualizar tipos de relatórios
  const handleReportTypeChange = (type: TFinancialReportType, checked: boolean) => {
    if (checked) {
      onSettingChange('financialReports.defaultReportTypes', [...settings.defaultReportTypes, type]);
    } else {
      onSettingChange(
        'financialReports.defaultReportTypes', 
        settings.defaultReportTypes.filter(t => t !== type)
      );
    }
  };

  // Função para atualizar formatos de exportação
  const handleExportFormatChange = (format: 'pdf' | 'excel' | 'csv', checked: boolean) => {
    if (checked) {
      onSettingChange('financialReports.exportFormats', [...settings.exportFormats, format]);
    } else {
      onSettingChange(
        'financialReports.exportFormats', 
        settings.exportFormats.filter(f => f !== format)
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Configurações de Relatórios Financeiros
        </CardTitle>
        <CardDescription>
          Configure a geração e distribuição de relatórios financeiros.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoReportGeneration">Geração automática de relatórios</Label>
              <Switch 
                id="autoReportGeneration" 
                checked={settings.automaticReportGeneration}
                onCheckedChange={(checked) => onSettingChange('financialReports.automaticReportGeneration', checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Gera e envia relatórios financeiros automaticamente nos períodos selecionados.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Formatos de Exportação</Label>
            <div className="grid grid-cols-3 gap-2">
              {['pdf', 'excel', 'csv'].map((format) => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`format-${format}`} 
                    checked={settings.exportFormats.includes(format as 'pdf' | 'excel' | 'csv')}
                    onCheckedChange={(checked) => handleExportFormatChange(format as 'pdf' | 'excel' | 'csv', checked as boolean)}
                  />
                  <Label htmlFor={`format-${format}`} className="capitalize">{format}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tipos de Relatórios Padrão</Label>
            <div className="grid grid-cols-2 gap-2">
              {['daily', 'weekly', 'monthly', 'quarterly', 'annual'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`report-${type}`} 
                    checked={settings.defaultReportTypes.includes(type as TFinancialReportType)}
                    onCheckedChange={(checked) => handleReportTypeChange(type as TFinancialReportType, checked as boolean)}
                  />
                  <Label htmlFor={`report-${type}`} className="capitalize">{type}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="retentionPeriod">Período de Retenção (meses)</Label>
            <div className="flex items-center space-x-4">
              <Slider 
                id="retentionPeriod"
                min={1}
                max={60}
                step={1}
                value={[settings.retentionPeriod]}
                onValueChange={(value) => onSettingChange('financialReports.retentionPeriod', value[0])}
                className="flex-1"
              />
              <span className="w-12 text-center">
                {settings.retentionPeriod}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Define por quanto tempo os relatórios financeiros são armazenados no sistema.
            </p>
          </div>
        </div>
        
        <div className="pt-4">
          <Label htmlFor="recipientEmails">E-mails para recebimento de relatórios</Label>
          <div className="flex items-start space-x-2 mt-1">
            <div className="flex-1">
              <Input 
                id="recipientEmails" 
                placeholder="exemplo@hospital.com, financeiro@hospital.com"
                value={settings.recipientEmails.join(', ')}
                onChange={(e) => onSettingChange('financialReports.recipientEmails', e.target.value.split(',').map(email => email.trim()))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Separe múltiplos e-mails com vírgulas
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-1">
              <Check className="h-4 w-4 mr-2" />
              Verificar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};