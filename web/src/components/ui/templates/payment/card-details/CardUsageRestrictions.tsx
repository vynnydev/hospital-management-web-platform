import React from 'react';
import { Badge } from '@/components/ui/organisms/badge';
import { Separator } from '@/components/ui/organisms/Separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/organisms/card';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Ban
} from 'lucide-react';
import { IPaymentCard, ExpenseCategory } from '@/types/payment-types';

interface CardUsageRestrictionsProps {
  card: IPaymentCard;
}

export const CardUsageRestrictions: React.FC<CardUsageRestrictionsProps> = ({ card }) => {
  const restrictions = card.usageRestrictions;
  
  // Formatação de categorias de despesa
  const formatCategory = (category: ExpenseCategory) => {
    switch (category) {
      case 'medical_supplies': return 'Materiais Médicos';
      case 'pharmaceuticals': return 'Medicamentos';
      case 'equipment': return 'Equipamentos';
      case 'office_supplies': return 'Material de Escritório';
      case 'utilities': return 'Serviços Públicos';
      case 'travel': return 'Viagens';
      case 'meals': return 'Refeições';
      case 'consulting': return 'Consultoria';
      case 'software': return 'Software';
      case 'training': return 'Treinamento';
      case 'other': return 'Outros';
      default: return category;
    }
  };
  
  // Formatação de dia da semana
  const formatDayOfWeek = (day: number) => {
    const days = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return days[day] || `Dia ${day}`;
  };
  
  // Formatação de horário
  const formatTime = (time: string | undefined) => {
    if (!time) return 'N/A';
    return time;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
              <ShoppingBag className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Categorias de Despesa Permitidas
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              O cartão só pode ser utilizado nestas categorias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {restrictions.allowedCategories.length > 0 ? (
                restrictions.allowedCategories.map((category, index) => (
                  <Badge 
                    key={index}
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {formatCategory(category)}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Sem restrições de categoria
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {restrictions.restrictedMerchants && restrictions.restrictedMerchants.length > 0 && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
                <Ban className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                Estabelecimentos Restritos
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                O cartão não pode ser utilizado nestes estabelecimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {restrictions.restrictedMerchants.map((merchant, index) => (
                  <Badge 
                    key={index}
                    className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 flex items-center"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {merchant}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
      
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Restrições de Tempo
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
                <Calendar className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Dias da Semana Permitidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                  const isAllowed = restrictions.allowedDaysOfWeek.includes(day);
                  const dayAbbr = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][day];
                  
                  return (
                    <div key={day} className="text-center">
                      <div 
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                          isAllowed 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {dayAbbr}
                      </div>
                      <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                        {formatDayOfWeek(day).substring(0, 3)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {(restrictions.allowedTimeStart || restrictions.allowedTimeEnd) && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
                  <Clock className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Horário Permitido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Início</p>
                    <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
                      {formatTime(restrictions.allowedTimeStart) || 'Sem restrição'}
                    </p>
                  </div>
                  
                  <div className="text-gray-300 dark:text-gray-600">até</div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fim</p>
                    <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
                      {formatTime(restrictions.allowedTimeEnd) || 'Sem restrição'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {restrictions.geographicRestrictions && restrictions.geographicRestrictions.length > 0 && (
        <>
          <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Restrições Geográficas
              </h3>
            </div>
            
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {restrictions.geographicRestrictions.map((restriction, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-3 rounded-md border border-gray-200 dark:border-gray-700"
                    >
                      <div className="mr-3">
                        {restriction.allowed ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {restriction.value}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {restriction.type === 'country' ? 'País' : 
                           restriction.type === 'region' ? 'Região' : 'Cidade'}
                        </p>
                      </div>
                      
                      <Badge
                        className={restriction.allowed 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }
                      >
                        {restriction.allowed ? 'Permitido' : 'Bloqueado'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {/* Mensagem informativa */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-md text-blue-800 dark:text-blue-200">
        <div className="flex">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="font-medium">Informação sobre restrições</p>
            <p className="mt-1 text-sm">
              As restrições de uso ajudam a controlar onde e quando o cartão pode ser utilizado,
              reduzindo o risco de uso indevido e assegurando que as despesas estejam 
              alinhadas às políticas financeiras do hospital.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};