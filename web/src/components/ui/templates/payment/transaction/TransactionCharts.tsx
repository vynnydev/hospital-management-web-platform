/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Label } from '@/components/ui/organisms/label';
import { Button } from '@/components/ui/organisms/button';
import { Separator } from '@/components/ui/organisms/Separator';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  CreditCard, 
  RefreshCw 
} from 'lucide-react';
import { IPaymentCard, ExpenseCategory } from '@/types/payment-types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface TransactionChartsProps {
  getTransactionsByCategoryChart: (startDate?: Date, endDate?: Date, specificCardIds?: string[]) => Promise<any>;
  getTransactionsByMonthChart: (year: number, specificCardIds?: string[]) => Promise<any>;
  cards: IPaymentCard[];
}

export const TransactionCharts: React.FC<TransactionChartsProps> = ({
  getTransactionsByCategoryChart,
  getTransactionsByMonthChart,
  cards
}) => {
  const [activeTab, setActiveTab] = useState('byCategory');
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    endDate: new Date()
  });
  
  // Cores para os gráficos
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
    '#82CA9D', '#8DD1E1', '#A4DE6C', '#D0ED57', '#FAAAA3'
  ];
  
  // Nomes das categorias
  const getCategoryName = (category: ExpenseCategory | string) => {
    const mapping: Record<string, string> = {
      'medical_supplies': 'Mat. Médicos',
      'pharmaceuticals': 'Medicamentos',
      'equipment': 'Equipamentos',
      'office_supplies': 'Mat. Escritório',
      'utilities': 'Serviços',
      'travel': 'Viagens',
      'meals': 'Refeições',
      'consulting': 'Consultoria',
      'software': 'Software',
      'training': 'Treinamento',
      'other': 'Outros'
    };
    
    return mapping[category] || category;
  };
  
  // Nomes dos meses
  const getMonthName = (monthNum: number) => {
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return months[monthNum - 1] || `Mês ${monthNum}`;
  };
  
  // Carregar dados de categoria
  const loadCategoryData = async () => {
    setLoading(true);
    try {
      const data = await getTransactionsByCategoryChart(
        dateRange.startDate,
        dateRange.endDate,
        selectedCardIds.length ? selectedCardIds : undefined
      );
      
      if (data) {
        // Transformar dados para o formato esperado pelo gráfico
        const formattedData = Object.entries(data).map(([category, amount]) => ({
          category,
          categoryName: getCategoryName(category),
          amount: Number(amount)
        }));
        
        setCategoryData(formattedData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de categoria:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar dados mensais
  const loadMonthlyData = async () => {
    setLoading(true);
    try {
      const data = await getTransactionsByMonthChart(
        selectedYear,
        selectedCardIds.length ? selectedCardIds : undefined
      );
      
      if (data) {
        // Transformar dados para o formato esperado pelo gráfico
        const formattedData = data.map((item: any) => ({
          ...item,
          monthName: getMonthName(item.month)
        }));
        
        setMonthlyData(formattedData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados mensais:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Atualizar dados quando os filtros mudarem
  useEffect(() => {
    if (activeTab === 'byCategory') {
      loadCategoryData();
    } else if (activeTab === 'byMonth') {
      loadMonthlyData();
    }
  }, [activeTab, selectedCardIds, selectedYear, dateRange]);
  
  // Alternar seleção de cartão
  const toggleCardSelection = (cardId: string) => {
    setSelectedCardIds(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId) 
        : [...prev, cardId]
    );
  };
  
  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  // Componente de tooltip customizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {formatCurrency(item.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium flex items-center text-gray-800 dark:text-gray-200">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Análise Gráfica de Transações
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualize dados financeiros através de gráficos
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (activeTab === 'byCategory') {
                loadCategoryData();
              } else {
                loadMonthlyData();
              }
            }}
            className="flex items-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-gray-100 dark:bg-gray-700 p-1 rounded-md h-10">
                  <TabsTrigger 
                    value="byCategory" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400"
                  >
                    <PieChart className="h-4 w-4 mr-1" />
                    Por Categoria
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="byMonth" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Por Mês
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-6 h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
              ) : (
                <TabsContent value="byCategory" className="h-full mt-0">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                          <XAxis 
                            dataKey="categoryName" 
                            angle={-45} 
                            textAnchor="end" 
                            height={70} 
                            tick={{ fill: '#6B7280' }}
                          />
                          <YAxis
                            tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                            tick={{ fill: '#6B7280' }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar 
                            dataKey="amount" 
                            name="Valor (R$)" 
                            fill="#3B82F6" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="w-full md:w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="amount"
                            nameKey="categoryName"
                            label={({ categoryName, percent }) => 
                              `${categoryName}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </RPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {loading ? null : (
                <TabsContent value="byMonth" className="h-full mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                      <XAxis 
                        dataKey="monthName" 
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                        tick={{ fill: '#6B7280' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        name="Valor (R$)" 
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="transactionCount" 
                        name="Número de Transações" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center text-gray-800 dark:text-gray-200">
                <CreditCard className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                Filtros
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Ano</Label>
                <Select
                  value={String(selectedYear)}
                  onValueChange={(value) => setSelectedYear(Number(value))}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Selecionar ano" className="text-gray-800 dark:text-gray-200" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    {[...Array(5)].map((_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <SelectItem 
                          key={year} 
                          value={String(year)}
                          className="text-gray-800 dark:text-gray-200"
                        >
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-2 bg-gray-200 dark:bg-gray-600" />
              
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Cartões</Label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {cards.map((card) => (
                    <div 
                      key={card.id}
                      className={`
                        flex items-center p-2 rounded-md cursor-pointer
                        ${selectedCardIds.includes(card.id) 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}
                      `}
                      onClick={() => toggleCardSelection(card.id)}
                    >
                      <div 
                        className={`w-4 h-4 rounded-full mr-3 ${
                          card.colorScheme === 'gradient-blue' ? 'bg-blue-500' :
                          card.colorScheme === 'gradient-green' ? 'bg-green-500' :
                          card.colorScheme === 'gradient-purple' ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {card.cardHolderName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {card.cardBrand.toUpperCase()} •••• {card.lastFourDigits}
                        </p>
                      </div>
                      
                      {selectedCardIds.includes(card.id) && (
                        <div className="h-4 w-4 rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCardIds([])}
                    className="text-xs bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                  >
                    Limpar Seleção
                  </Button>
                </div>
              </div>
              
              <Separator className="my-2 bg-gray-200 dark:bg-gray-600" />
              
              {activeTab === 'byCategory' && (
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Período</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400">Data Inicial</Label>
                      <input
                        type="date"
                        value={dateRange.startDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          const newDate = new Date(e.target.value);
                          setDateRange(prev => ({
                            ...prev,
                            startDate: newDate
                          }));
                        }}
                        className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400">Data Final</Label>
                      <input
                        type="date"
                        value={dateRange.endDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          const newDate = new Date(e.target.value);
                          setDateRange(prev => ({
                            ...prev,
                            endDate: newDate
                          }));
                        }}
                        className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};