import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Alert, AlertDescription } from '@/components/ui/organisms/alert';
import { Brain, Settings2, Users, Bell, Calendar, Activity, Workflow, Hospital } from 'lucide-react';
import { HospitalWorkflowEditor } from './HospitalWorkflowEditor';

export const SettingsDashboard = () => {
    const [activeTab, setActiveTab] = useState('workflow');
    const [aiPrompt, setAiPrompt] = useState('');
    
    const navigationItems = [
        { id: 'service-flow', label: 'Personalizar Processos', icon: Workflow },
        { id: 'dashboard-metrics', label: 'Personalizar Métricas', icon: Workflow },
        { id: 'ai', label: 'Gerar Configurações', icon: Brain },
        { id: 'alerts', label: 'History', icon: Bell },
        { id: 'schedule', label: 'Activity', icon: Calendar }
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

                        <TabsContent value="service-flow">
                            <Card className="h-[calc(100vh-200px)]"> {/* ou altura fixa que preferir */}
                                <CardContent className="p-0"> {/* removido padding para maximizar espaço */}
                                    <HospitalWorkflowEditor />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="dashboard-metrics" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Workflow className="h-5 w-5 text-blue-500" />
                                        Personalizar Métricas Gerais
                                    </CardTitle>
                                    <CardDescription>
                                        Configure os fluxos de trabalho hospitalares
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[600px] bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>Local do Workflow</div>
                                </CardContent>
                            </Card>
                        </TabsContent>

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
                                    <div className="grid gap-4">
                                        <Textarea
                                            placeholder="Descreva as configurações desejadas..."
                                            value={aiPrompt}
                                            onChange={(e) => setAiPrompt(e.target.value)}
                                            className="min-h-[200px]"
                                        />
                                        <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                                            <Brain className="h-4 w-4 mr-2" />
                                            Gerar Configurações
                                        </Button>
                                    </div>
                                    <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                                        <Brain className="h-4 w-4 text-purple-500" />
                                        <AlertDescription className="text-purple-700 dark:text-purple-300">
                                            A IA irá sugerir configurações com base no seu contexto hospitalar
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </TabsContent>

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
                                <CardContent>
                                <div className="grid gap-4">
                                    {/* Alertas de Ocupação */}
                                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <Hospital className="h-5 w-5 text-blue-500" />
                                            Alertas de Ocupação
                                        </h3>
                                        <div className="grid gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                                    Limite de Ocupação (%)
                                                </label>
                                                <Input type="number" defaultValue={85} />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                                    Tempo de Antecedência (horas)
                                                </label>
                                                <Input type="number" defaultValue={24} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alertas de Equipe */}
                                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <Users className="h-5 w-5 text-green-500" />
                                            Alertas de Equipe
                                        </h3>
                                        <div className="grid gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                                    Limite de Carga de Trabalho (%)
                                                </label>
                                                <Input type="number" defaultValue={90} />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                                    Mínimo de Staff por Turno
                                                </label>
                                                <Input type="number" defaultValue={3} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alertas de Performance */}
                                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-red-500" />
                                            Alertas de Performance
                                        </h3>
                                        <div className="grid gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                                    Tempo Máximo de Espera (min)
                                                </label>
                                                <Input type="number" defaultValue={30} />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                                    Taxa Mínima de Rotatividade
                                                </label>
                                                <Input type="number" defaultValue={4} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="schedule" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-green-500" />
                                    Configuração de Agendamentos
                                </CardTitle>
                                <CardDescription>
                                    Configure regras e restrições de agendamento
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[600px]">
                                <div>Local onde ficará o calendário</div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};