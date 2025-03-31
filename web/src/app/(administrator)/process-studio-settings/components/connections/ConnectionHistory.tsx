import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';

interface IConnectionHistoryProps {
  syncRecords: Array<{
    id: string;
    systemId: string;
    systemName: string;
    icon: React.ElementType;
    date: string;
    time: string;
    status: string;
    recordCount?: number;
  }>;
  onViewDetails?: (recordId: string) => void;
}

export const ConnectionHistory: React.FC<IConnectionHistoryProps> = ({
  syncRecords,
  onViewDetails
}) => {
  // Verifique com console.log para entender o que está chegando
  console.log("syncRecords:", syncRecords);
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">Histórico de Sincronizações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {syncRecords && syncRecords.length > 0 ? (
            syncRecords.map(record => {
              const Icon = record.icon;
              
              return (
                <div 
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="font-medium">{record.systemName}</span>
                    </div>
                    <div className="flex text-xs text-gray-500 mt-1">
                      <span>{record.date} {record.time}</span>
                      <span className="mx-2">•</span>
                      <span className={record.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {record.status === 'success' ? 'Sucesso' : 'Falha'}
                      </span>
                    </div>
                  </div>
                  {record.recordCount !== undefined ? (
                    <div className="text-xs">{record.recordCount} registros</div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => onViewDetails && onViewDetails(record.id)}
                    >
                      Ver Detalhes
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum registro de sincronização.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};