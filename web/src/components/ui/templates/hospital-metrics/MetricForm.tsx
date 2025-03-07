import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/organisms/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/organisms/select";
import { Input } from "@/components/ui/organisms/input";
import { Textarea } from "@/components/ui/organisms/textarea";
import { Button } from "@/components/ui/organisms/button";
import { 
  AlertTriangle, 
  Users, 
  Settings, 
  Clock,
  Activity,
  TrendingUp,
  RotateCcw,
  GraduationCap,
  Users2,
  Save,
  X,
  Check
} from 'lucide-react';
import { Label } from "@/components/ui/organisms/label";
import { Spinner } from "@/components/ui/organisms/spinner";
import { ICreateMetricPayload, TMetric } from '@/types/hospital-metrics';

// Mapeamento de ícones para diferentes tipos de métricas
const metricIcons: Record<string, React.ElementType> = {
  'critical-hospital': AlertTriangle,
  'staff': Users,
  'maintenance': Settings,
  'waiting': Clock,
  'hospital-critico': AlertTriangle,
  'burnout': Users,
  'manutencao': Settings,
  'taxa-giro': RotateCcw,
  'eficiencia': TrendingUp,
  'ocupacao': Activity,
  'variacao': Users2,
  'treinamento': GraduationCap
};

interface MetricFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateMetricPayload) => Promise<TMetric | null>;
  editingMetric?: TMetric | null;
  initialData?: ICreateMetricPayload;
  title?: string;
}

export const MetricForm: React.FC<MetricFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingMetric = null,
  initialData,
  title = 'Nova Métrica'
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<ICreateMetricPayload>({
    title: '',
    subtitle: '',
    description: '',
    type: 'main',
    cardType: '',
    additionalInfo: {
      label: '',
      value: ''
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Resetar o formulário quando abrir/fechar o modal ou mudar a métrica que está sendo editada
  useEffect(() => {
    if (isOpen) {
      if (editingMetric) {
        // Preencher o formulário com os dados da métrica que está sendo editada
        setFormData({
          title: editingMetric.title,
          subtitle: editingMetric.subtitle || '',
          description: editingMetric.description || '',
          type: editingMetric.type,
          cardType: editingMetric.cardType,
          additionalInfo: editingMetric.type === 'additional' && 'additionalInfo' in editingMetric
            ? editingMetric.additionalInfo || { label: '', value: '' }
            : { label: '', value: '' }
        });
      } else if (initialData) {
        // Usar dados iniciais fornecidos
        setFormData(initialData);
      } else {
        // Resetar o formulário para uma nova métrica
        setFormData({
          title: '',
          subtitle: '',
          description: '',
          type: 'main',
          cardType: '',
          additionalInfo: {
            label: '',
            value: ''
          }
        });
      }
      setFormError(null);
      setSubmitSuccess(false);
    }
  }, [isOpen, editingMetric, initialData]);
  
  // Opções de tipos de cartão baseadas no tipo de métrica
  const cardTypeOptions = formData.type === 'main' 
    ? [
        { value: 'critical-hospital', label: 'Hospital Crítico' },
        { value: 'staff', label: 'Déficit de Equipes' },
        { value: 'maintenance', label: 'Higienização de Equipamentos' },
        { value: 'waiting', label: 'Tempo de Espera' }
      ]
    : [
        { value: 'hospital-critico', label: 'Hospital Crítico' },
        { value: 'burnout', label: 'Risco de Burnout' },
        { value: 'manutencao', label: 'Manutenção' },
        { value: 'taxa-giro', label: 'Taxa de Giro' },
        { value: 'eficiencia', label: 'Eficiência Operacional' },
        { value: 'ocupacao', label: 'Ocupação Média' },
        { value: 'variacao', label: 'Variação de Pacientes' },
        { value: 'treinamento', label: 'Treinamento Profissional' }
      ];
  
  // Atualizar o campo cardType quando o tipo de métrica mudar
  useEffect(() => {
    if (formData.cardType && !cardTypeOptions.some(option => option.value === formData.cardType)) {
      setFormData(prev => ({
        ...prev,
        cardType: ''
      }));
    }
  }, [formData.type, formData.cardType]);
  
  // Atualizar campo no formulário
  const handleChange = (
    field: keyof ICreateMetricPayload, 
    value: string | { label: string, value: string }
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Atualizar campo aninhado no additionalInfo
  const handleAdditionalInfoChange = (field: 'label' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo!,
        [field]: value
      }
    }));
  };
  
  // Enviar o formulário
  const handleSubmit = async () => {
    // Validar campos obrigatórios
    if (!formData.title) {
      setFormError('O título da métrica é obrigatório');
      return;
    }
    
    if (!formData.cardType) {
      setFormError('O tipo de cartão é obrigatório');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const result = await onSubmit(formData);
      if (result) {
        setSubmitSuccess(true);
        
        // Fechar o modal após um breve atraso para mostrar a mensagem de sucesso
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error('Falha ao salvar a métrica');
      }
    } catch (error) {
      console.error('Erro ao salvar métrica:', error);
      setFormError('Ocorreu um erro ao salvar a métrica. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Renderizar o ícone da métrica selecionada
  const renderSelectedIcon = () => {
    if (!formData.cardType) return null;
    
    const IconComponent = metricIcons[formData.cardType as keyof typeof metricIcons];
    if (!IconComponent) return null;
    
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
        <IconComponent size={64} className="text-purple-500" />
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Métrica salva com sucesso!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A métrica foi adicionada ao seu painel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Coluna da esquerda */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="metric-title">Título da Métrica</Label>
                <Input
                  id="metric-title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Ex: Taxa de Ocupação UTI"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="metric-subtitle">Subtítulo</Label>
                <Input
                  id="metric-subtitle"
                  value={formData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="Ex: Ocupação atual dos leitos"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="metric-description">Descrição</Label>
                <Textarea
                  id="metric-description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descreva o objetivo desta métrica..."
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              {formData.type === 'additional' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="additional-label">Rótulo da Informação Adicional</Label>
                    <Input
                      id="additional-label"
                      value={formData.additionalInfo?.label || ''}
                      onChange={(e) => handleAdditionalInfoChange('label', e.target.value)}
                      placeholder="Ex: Taxa de Ocupação"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="additional-value">Valor da Informação Adicional</Label>
                    <Input
                      id="additional-value"
                      value={formData.additionalInfo?.value || ''}
                      onChange={(e) => handleAdditionalInfoChange('value', e.target.value)}
                      placeholder="Ex: 85%"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Coluna da direita */}
            <div className="space-y-4">
              {renderSelectedIcon()}
              
              <div>
                <Label htmlFor="metric-type">Tipo de Métrica</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange('type', value)}
                >
                  <SelectTrigger id="metric-type" className="mt-1">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Principal</SelectItem>
                    <SelectItem value="additional">Adicional</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Métricas principais aparecem no topo do painel, métricas adicionais na seção expandível.
                </p>
              </div>
              
              <div>
                <Label htmlFor="card-type">Estilo do Cartão</Label>
                <Select
                  value={formData.cardType}
                  onValueChange={(value) => handleChange('cardType', value)}
                >
                  <SelectTrigger id="card-type" className="mt-1">
                    <SelectValue placeholder="Selecione o estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  O estilo determina as cores e o ícone do cartão da métrica.
                </p>
              </div>
              
              {/* Mensagem de erro */}
              {formError && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 rounded-md text-red-800 dark:text-red-200 text-sm">
                  {formError}
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter>
          {!submitSuccess && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || submitSuccess}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Métrica
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};