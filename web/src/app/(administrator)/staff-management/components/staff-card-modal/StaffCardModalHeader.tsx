import React from 'react';
import { X, Users } from 'lucide-react';
import type { IStaffTeam } from '@/types/staff-types';

// Sub-componente: Header do Modal
export const StaffCardModalHeader = ({ team, onClose }: { team: IStaffTeam; onClose: () => void }) => (
  <div className="flex items-center justify-between bg-gradient-to-br from-blue-700 to-cyan-700 p-4 mb-6 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
        <Users className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{team.name}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600 dark:text-gray-300">{team.department}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">Turno: {team.shift}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">{team.members.length} membros</span>
        </div>
      </div>
    </div>
    <button 
      onClick={onClose}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
    >
      <X className="w-6 h-6" />
    </button>
  </div>
);