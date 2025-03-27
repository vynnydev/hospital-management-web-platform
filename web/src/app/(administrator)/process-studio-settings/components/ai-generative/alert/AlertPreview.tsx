import { Bell } from "lucide-react";

export const AlertPreview = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-3 bg-amber-900/20 dark:bg-amber-900/20 rounded-lg border border-amber-800/50">
        <div>
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
            <span className="font-medium text-amber-300">Alerta: Ocupação UTI acima de 85%</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Disparado quando a ocupação persistir por mais de 15 minutos
          </p>
        </div>
      </div>
      <div className="p-3 border rounded-lg border-gray-700 bg-gray-800/50">
        <h4 className="text-sm font-medium text-gray-300">Configurações do Alerta</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-xs">
          <div className="text-gray-500">Condição:</div>
          <div className="text-gray-300">Taxa de ocupação {'>'} 85%</div>
          <div className="text-gray-500">Severidade:</div>
          <div className="text-gray-300">
            <span className="inline-flex items-center text-amber-400">
              <Bell className="h-3 w-3 mr-1" />
              Aviso
            </span>
          </div>
          <div className="text-gray-500">Notificações:</div>
          <div className="text-gray-300">Email, Dashboard</div>
        </div>
      </div>
    </div>
);