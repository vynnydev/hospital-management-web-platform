/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { Button } from '@/components/ui/organisms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { AlertTriangle, BarChart3, Clock, FileText, RefreshCw } from 'lucide-react';

interface AuditLogsStatsProps {
  stats: any;
  loading: boolean;
  onRefresh: (timeframe: string) => void;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#FF6B6B'];
const SEVERITY_COLORS = {
  critical: '#FF0000',
  error: '#FF6B6B',
  warning: '#FFBB28',
  info: '#0088FE',
};

const CATEGORY_COLORS = {
  authentication: '#0088FE',
  data_access: '#00C49F',
  system_config: '#FFBB28',
  patient_data: '#FF8042',
  admin_action: '#A569BD',
  security: '#FF6B6B',
};

export const AuditLogsStats: React.FC<AuditLogsStatsProps> = ({ stats, loading, onRefresh }) => {
  const [timeframe, setTimeframe] = useState('week');
  const [chartTab, setChartTab] = useState('activity');

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    onRefresh(value);
  };

  // Helper to format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (loading || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Auditoria</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="animate-spin">
            <RefreshCw className="h-8 w-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h3 className="text-lg font-semibold">Estatísticas de Auditoria</h3>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Último dia</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onRefresh(timeframe)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total de Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalActivities)}</div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              {stats.activityTrend > 0 ? (
                <Badge variant="success" className="text-xs">+{stats.activityTrend}%</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">{stats.activityTrend}%</Badge>
              )}
              <span className="ml-1">vs. período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Eventos de Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.securityEvents)}</div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <Badge 
                variant={stats.criticalEvents > 0 ? "destructive" : "secondary"} 
                className="text-xs"
              >
                {stats.criticalEvents} críticos
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Falhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failureRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <Badge 
                variant={stats.failureRate > 5 ? "warning" : "success"} 
                className="text-xs"
              >
                {stats.failureRate <= 5 ? 'Normal' : 'Elevado'}
              </Badge>
              <span className="ml-1">Taxa de falha</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Usuários Únicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.uniqueUsers)}</div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <span>De {formatNumber(stats.totalUsers)} usuários</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader className="pb-2">
          <Tabs value={chartTab} onValueChange={setChartTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="activity" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Atividade
              </TabsTrigger>
              <TabsTrigger value="severity" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Severidade
              </TabsTrigger>
              <TabsTrigger value="category" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Categoria
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Usuários
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="h-80">
          <TabsContent value="activity" className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.activityByTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0088FE"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="severity" className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.bySeverity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.bySeverity.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.bySeverity}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill="#8884d8" 
                    name="Quantidade"
                    radius={[0, 4, 4, 0]}
                  >
                    {stats.bySeverity.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="category" className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.replace('_', ' ')} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.byCategory.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.byCategory}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tickFormatter={(value) => value.replace('_', ' ')}
                  />
                  <Tooltip 
                    formatter={(value: any) => [value, "Quantidade"]}
                    labelFormatter={(label) => label.replace('_', ' ')}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill="#8884d8" 
                    name="Quantidade"
                    radius={[0, 4, 4, 0]}
                  >
                    {stats.byCategory.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="users" className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.topUsers}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="#0088FE" 
                  name="Atividades"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </CardContent>
      </Card>

      {/* Additional stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Ações</CardTitle>
            <CardDescription>Ações mais frequentes no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topActions.map((action: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm">{action.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{action.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Padrões de Alerta</CardTitle>
            <CardDescription>Atividades que podem requerer atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.alertPatterns.map((pattern: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className={`h-2 w-2 rounded-full mr-2 ${
                        pattern.severity === 'high' ? 'bg-red-500' : 
                        pattern.severity === 'medium' ? 'bg-yellow-500' : 
                        'bg-blue-500'
                      }`}
                    ></div>
                    <span className="text-sm">{pattern.description}</span>
                  </div>
                  <Badge 
                    variant={
                      pattern.severity === 'high' ? 'destructive' : 
                      pattern.severity === 'medium' ? 'warning' : 
                      'secondary'
                    }
                  >
                    {pattern.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};