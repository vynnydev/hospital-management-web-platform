import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/organisms/alert';

export const GDPRCompliance: React.FC = () => {
  return (
    <Alert className="bg-purple-900/20 border-purple-700/50 text-purple-400 mb-6">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        Conformidade com LGPD - Lei nº 13.709/2018
      </AlertTitle>
      <AlertDescription className="space-y-2">
        <p>
          As câmeras térmicas devem ser configuradas de acordo com os princípios de privacidade e proteção de dados:
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-start gap-2">
            <Info className="h-3 w-3 mt-0.5 text-purple-400" />
            <span>Minimização de dados coletados</span>
          </div>
          <div className="flex items-start gap-2">
            <Info className="h-3 w-3 mt-0.5 text-purple-400" />
            <span>Retenção limitada ao necessário</span>
          </div>
          <div className="flex items-start gap-2">
            <Info className="h-3 w-3 mt-0.5 text-purple-400" />
            <span>Acesso restrito a pessoal autorizado</span>
          </div>
          <div className="flex items-start gap-2">
            <Info className="h-3 w-3 mt-0.5 text-purple-400" />
            <span>Transparência e comunicação aos pacientes</span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};