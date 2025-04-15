import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../organisms/dialog';
import { FileText, Lock, Clock, ShieldAlert, Server } from 'lucide-react';
import { Button } from '../../organisms/button';

interface IPrivacyDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
  
export const PrivacyDetailsDialog: React.FC<IPrivacyDetailsDialogProps> = ({
    open,
    onOpenChange
}) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              Política de Privacidade - Câmeras Térmicas
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700/30">
              <h3 className="text-lg font-medium text-white mb-2">Finalidade da Coleta de Dados</h3>
              <p className="text-gray-300">
                As câmeras térmicas coletam dados de temperatura corporal e detecção de ocupação com a finalidade exclusiva de:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-300">
                <li>Monitoramento de pacientes em leitos hospitalares para detecção precoce de alterações em sinais vitais</li>
                <li>Otimização da gestão de leitos hospitalares</li>
                <li>Prevenção de agravos à saúde através da identificação rápida de alterações térmicas</li>
                <li>Auxílio na tomada de decisão pela equipe médica</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Medidas Técnicas de Conformidade</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-400" />
                    Limitação de Coleta
                  </h4>
                  <p className="text-sm text-gray-300">
                    Apenas dados térmicos são coletados, sem captura de imagens de vídeo convencionais que permitam identificação visual dos pacientes.
                  </p>
                </div>
                
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    Retenção Limitada
                  </h4>
                  <p className="text-sm text-gray-300">
                    Dados são automaticamente excluídos após o período configurado de retenção (recomendado: máximo de 30 dias).
                  </p>
                </div>
                
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-blue-400" />
                    Acesso Restrito
                  </h4>
                  <p className="text-sm text-gray-300">
                    Apenas profissionais autorizados têm acesso aos dados, com controle de permissões granular por função.
                  </p>
                </div>
                
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Server className="h-4 w-4 text-blue-400" />
                    Criptografia
                  </h4>
                  <p className="text-sm text-gray-300">
                    Dados em trânsito e em repouso são criptografados seguindo padrões de segurança hospitalar.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Direitos dos Titulares dos Dados</h3>
              <p className="text-gray-300 mb-3">
                Conforme a LGPD, os pacientes têm os seguintes direitos:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <p className="text-gray-300">Direito de acesso aos dados coletados</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <p className="text-gray-300">Direito de solicitar a exclusão dos dados</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <p className="text-gray-300">Direito de ser informado sobre a coleta e uso dos dados</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <p className="text-gray-300">Direito de revogar o consentimento a qualquer momento</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">Consentimento e Transparência</h3>
              <p className="text-gray-300">
                Todos os pacientes devem ser informados sobre o uso de câmeras térmicas e sua finalidade durante o processo de admissão. Cartazes informativos devem ser afixados em locais visíveis nos quartos equipados com esta tecnologia.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
};