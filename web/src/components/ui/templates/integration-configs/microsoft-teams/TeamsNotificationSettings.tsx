import React from 'react';
import { Bell } from 'lucide-react';

interface TeamsNotificationSettingsProps {
  settings: {
    notifyOnPatientAdmission: boolean;
    notifyOnDischargePlan: boolean;
    notifyOnTestResults: boolean;
    notifyOnMedicationChange: boolean;
  };
  onSettingChange: (field: string, value: boolean) => void;
}

export const TeamsNotificationSettings: React.FC<TeamsNotificationSettingsProps> = ({
  settings,
  onSettingChange
}) => {
  const notificationItems = [
    {
      id: 'notifyOnPatientAdmission',
      label: 'Admissão de Pacientes',
      description: 'Notificar quando um novo paciente for admitido'
    },
    {
      id: 'notifyOnDischargePlan',
      label: 'Planos de Alta',
      description: 'Notificar quando um plano de alta for criado ou atualizado'
    },
    {
      id: 'notifyOnTestResults',
      label: 'Resultados de Exames',
      description: 'Notificar quando novos resultados de exames estiverem disponíveis'
    },
    {
      id: 'notifyOnMedicationChange',
      label: 'Alterações de Medicação',
      description: 'Notificar quando houver alterações em medicações prescritas'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h4 className="font-medium text-gray-900 dark:text-white">Configurações de Notificações</h4>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Escolha quais eventos devem gerar notificações no Microsoft Teams
      </p>

      <div className="space-y-4">
        {notificationItems.map(item => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
            </div>
            <button
              onClick={() => onSettingChange(item.id, !settings[item.id as keyof typeof settings])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings[item.id as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings[item.id as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};