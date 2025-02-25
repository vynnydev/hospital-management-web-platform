/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';

interface AlertEditorProps {
  onTest?: () => void;
  onDisable?: () => void;
  onCancel?: () => void;
  onSave?: (alertData: any) => void;
}

export const AlertEditor: React.FC<AlertEditorProps> = ({
  onTest,
  onDisable,
  onCancel,
  onSave
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          Sistema de Notificações
        </CardTitle>
        <CardDescription>
          Configure alertas e notificações para eventos críticos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tabs para diferentes tipos de alertas */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-6">
            <button className="px-4 py-2 border-b-2 border-orange-500 text-orange-600 dark:text-orange-400 font-medium">
              Ocupação
            </button>
            <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Financeiros
            </button>
            <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Clínicos
            </button>
            <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Recursos
            </button>
          </div>
        </div>
        
        {/* Editor de configuração do alerta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-2">Alerta de Taxa de Ocupação</h3>
            <p className="text-sm text-gray-500 mb-4">
              Configure alertas baseados na ocupação de leitos no hospital
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Condição
              </label>
              <Select defaultValue="greater">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma condição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater">Maior que</SelectItem>
                  <SelectItem value="less">Menor que</SelectItem>
                  <SelectItem value="equal">Igual a</SelectItem>
                  <SelectItem value="between">Entre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor de Limite (%)
              </label>
              <Input type="number" defaultValue={85} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Persistência (minutos)
              </label>
              <Input type="number" defaultValue={15} />
              <p className="text-xs text-gray-500 mt-1">
                Tempo que a condição deve persistir antes de disparar o alerta
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Severidade
              </label>
              <Select defaultValue="warning">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Informativo</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="emergency">Emergência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Canais de Notificação
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="email" className="mr-2" defaultChecked />
                  <label htmlFor="email" className="text-sm">Email</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="sms" className="mr-2" defaultChecked />
                  <label htmlFor="sms" className="text-sm">SMS</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="dashboard" className="mr-2" defaultChecked />
                  <label htmlFor="dashboard" className="text-sm">Dashboard</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="app" className="mr-2" defaultChecked />
                  <label htmlFor="app" className="text-sm">Aplicativo</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mensagem Personalizada
            </label>
            <Textarea 
              rows={3}
              defaultValue="Alerta: A taxa de ocupação ultrapassou [valor]%. É recomendado revisar o plano de contingência."
            />
            <p className="text-xs text-gray-500 mt-1">
              Use [valor] para incluir o valor detectado, [limite] para o limite configurado
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onTest}>
              Testar Notificação
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={onDisable}
            >
              Desativar
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              size="sm" 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => onSave && onSave({})}
            >
              Salvar Alerta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};