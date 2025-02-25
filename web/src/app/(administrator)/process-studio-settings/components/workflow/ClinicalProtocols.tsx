import React from 'react';
import { BookOpen, FilePlus, CheckSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';

export const ClinicalProtocols: React.FC = () => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          Protocolos Clínicos
        </CardTitle>
        <CardDescription>
          Integre processos com protocolos médicos padronizados
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer">
          <h3 className="font-medium text-indigo-600 dark:text-indigo-400">Sepse</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Protocolo de identificação e manejo precoce da sepse
          </p>
          <div className="mt-2 text-xs text-gray-500">
            <CheckSquare className="h-3 w-3 inline mr-1" /> Associado à Emergência
          </div>
        </div>
        <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer">
          <h3 className="font-medium text-indigo-600 dark:text-indigo-400">AVC</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Protocolo de atendimento ao AVC agudo
          </p>
          <div className="mt-2 text-xs text-gray-500">
            <CheckSquare className="h-3 w-3 inline mr-1" /> Associado à Emergência
          </div>
        </div>
        <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer">
          <h3 className="font-medium text-indigo-600 dark:text-indigo-400">Cirurgia Segura</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Checklist para procedimentos cirúrgicos
          </p>
          <div className="mt-2 text-xs text-gray-500">
            <CheckSquare className="h-3 w-3 inline mr-1" /> Associado à Centro Cirúrgico
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          <FilePlus className="h-4 w-4 mr-2" />
          Adicionar Protocolo
        </Button>
      </CardFooter>
    </Card>
  );
};