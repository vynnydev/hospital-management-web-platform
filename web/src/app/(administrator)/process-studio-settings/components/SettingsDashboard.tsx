import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Alert, AlertDescription } from '@/components/ui/organisms/alert';
import { Brain, Settings2, Bell, Calendar, Activity, Workflow, Hospital, Share2, Rotate3d } from 'lucide-react';
import { HospitalWorkflowEditor } from './HospitalWorkflowEditor';

export const SettingsDashboard = () => {
    const [activeTab, setActiveTab] = useState('service-flow');
    const [aiPrompt, setAiPrompt] = useState('');
    
    const navigationItems = [
        { id: 'service-flow', label: 'Personalizar Processos', icon: Workflow },
        { id: 'dashboard-metrics', label: 'Personalizar Métricas', icon: Activity },
        { id: 'ai', label: 'Gerar Configurações', icon: Brain },
        { id: 'alerts', label: 'Alertas', icon: Bell },
        { id: 'schedule', label: 'Agendamentos', icon: Calendar },
        { id: 'integrations', label: 'Integrações', icon: Share2 }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl">
            <div className="max-w-8xl mx-auto">
                <div className="flex flex-col space-y-6 mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                            Configurações e Personalizações
                        </h1>
                        <Button variant="ghost" className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Settings2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <nav className="flex space-x-6 pt-8">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center px-4 py-2 rounded-full transition-all ${
                                        isActive 
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="hidden">
                        {navigationItems.map((item) => (
                        <TabsTrigger key={item.id} value={item.id}>
                            {item.label}
                        </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Personalizar Processos */}
                    <TabsContent value="service-flow">
                        <Card className="h-[calc(100vh-100px)]">
                            <CardContent className="p-0 h-full">
                                <HospitalWorkflowEditor />
                            </CardContent>
                        </Card>
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Processos Interdepartamentais</CardTitle>
                                <CardDescription>Defina fluxos que envolvem múltiplos setores</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Componente para criar processos interdepartamentais */}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Personalizar Métricas */}
                    <TabsContent value="dashboard-metrics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-blue-500" />
                                    Métricas Financeiras
                                </CardTitle>
                                <CardDescription>
                                    Configure a exibição das métricas de faturamento e custos
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Componente para configurar métricas financeiras */}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Hospital className="h-5 w-5 text-green-500" />
                                    Métricas de Qualidade
                                </CardTitle>
                                <CardDescription>
                                    Defina os indicadores de qualidade de atendimento
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Componente para configurar métricas de qualidade */}
                            </CardContent>
                        </Card>
                        {/* Outros cartões de métricas agrupadas por categorias */}
                    </TabsContent>

                    {/* Gerar Configurações (IA) */}
                    <TabsContent value="ai" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-purple-500" />
                                    Configuração Assistida por IA
                                </CardTitle>
                                <CardDescription>
                                    Use IA para gerar e otimizar configurações
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Componente para entradas do usuário */}
                                <div className="grid gap-4">
                                    <Textarea
                                        placeholder="Descreva as configurações desejadas..."
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        className="min-h-[200px]"
                                    />
                                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                                        <Brain className="h-4 w-4 mr-2" />
                                        Gerar
                                    </Button>
                                </div>
                                {/* Exemplos de prompts */}
                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                                        Exemplos de pedidos
                                    </h3>
                                    <ul className="list-inside list-disc text-purple-700 dark:text-purple-300 space-y-1">
                                        <li>Metas financeiras para o próximo trimestre</li>
                                        <li>Indicadores de qualidade para a UTI</li> 
                                        <li>Configurações de alerta para taxa de ocupação acima de 90%</li>
                                    </ul>
                                </div>
                                {/* Componente para exibir/editar conteúdo gerado pela IA */}
                                <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                                    <Brain className="h-4 w-4 text-purple-500" />
                                    <AlertDescription className="text-purple-700 dark:text-purple-300">
                                        Aqui você poderá revisar e personalizar as configurações geradas antes de aplicar
                                    </AlertDescription>
                                </Alert>
                                {/* Botão para compartilhar configuração */}
                                <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white gap-2">
                                    <Share2 className="h-4 w-4" /> 
                                    Compartilhar configuração
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Alertas */}                    
                    <TabsContent value="alerts" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-orange-500" />
                                    Configuração de Alertas
                                </CardTitle>
                                <CardDescription>
                                    Defina regras e gatilhos para alertas
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Componente com opções de alertas */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Card de configuração de alerta */}
                                    <div className="col-span-1 p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                            Taxa de Ocupação
                                        </h3>
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-400">
                                                Limite de ocupação (%)
                                            </label>
                                            <Input type="number" defaultValue={85} className="mt-1" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-400">
                                                Antecedência do alerta (horas)
                                            </label>
                                            <Input type="number" defaultValue={24} className="mt-1" /> 
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                                                Testar
                                            </Button>
                                            <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                                                Silenciar
                                            </Button>
                                        </div>
                                    </div>
                                    {/* Outros cards de configuração de alertas */}
                                </div>
                                {/* Log de alertas disparados */}
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">Histórico de Alertas</h3>
                                    {/* Componente de log de alertas */}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Agendamentos */}
                    <TabsContent value="schedule" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-green-500" />
                                    Agendamentos
                                </CardTitle>
                                <CardDescription>
                                    Gerencie cirurgias, consultas, reuniões e outros eventos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Componente de calendário */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                                    <div className="h-[400px] w-full">
                                        {/* Calendário */}
                                    </div>
                                </div>
  
                                {/* Formulário de novo agendamento */}
                                <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
                                        Novo Agendamento  
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-700 dark:text-gray-300">Título</label>
                                            <Input type="text" className="mt-1" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-700 dark:text-gray-300">Categoria</label>
                                            <select className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent">
                                                <option>Cirurgia</option>
                                                <option>Consulta</option>
                                                <option>Reunião</option>
                                                <option>Manutenção</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-700 dark:text-gray-300">Data e Hora</label>
                                            <Input type="datetime-local" className="mt-1" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-700 dark:text-gray-300">Local</label>
                                            <Input type="text" className="mt-1" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-700 dark:text-gray-300">Recorrência</label>
                                            <select className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent">
                                                <option>Não repetir</option>
                                                <option>Diariamente</option>
                                                <option>Semanalmente</option>
                                                <option>Mensalmente</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white">
                                        <Calendar className="h-4 w-4 mr-2"/> 
                                        Agendar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>  
                    </TabsContent>

                    {/* Integrações */}
                    <TabsContent value="integrations" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Share2 className="h-5 w-5 text-blue-500" />
                                    Integrações
                                </CardTitle>
                                <CardDescription>
                                    Gerencie a comunicação com outros sistemas do hospital  
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Listagem de integrações existentes */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-700">
                                    <div className="p-4 flex justify-between">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                Sistema de RH    
                                            </h4>
                                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                                Integrado desde 12/05/2023
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                                                <Rotate3d className="h-4 w-4 mr-2" />
                                                Sincronizar  
                                            </Button>
                                            <Button variant="ghost" size="sm" className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400">
                                                Remover
                                            </Button>
                                        </div> 
                                    </div>
                                    {/* Outras integrações existentes */}
                                </div>
  
                                {/* Formulário para adicionar nova integração */}
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                                        Adicionar Integração
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-700 dark:text-gray-300">Sistema</label>
                                            <Input type="text" className="mt-1" placeholder="Nome ou ID do sistema" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-700 dark:text-gray-300">Tipo de Comunicação</label>
                                            <select className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent">
                                                <option>RESTful API</option>
                                                <option>Banco de Dados</option>
                                                <option>HL7 FHIR</option>
                                            </select>  
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-300">Parâmetros de Conexão</label>
                                            <Textarea rows={4} className="mt-1" placeholder="Insira URLs de API, strings de conexão, etc"/>
                                        </div>
                                    </div>

                                    <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                                        <Share2 className="h-4 w-4 mr-2" />  
                                        Integrar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}