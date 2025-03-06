import { useState, useEffect } from 'react';
import axios from 'axios';

interface Nurse {
  id: string;
  name: string;
  shift: string;
  assignedBeds: string[];
  tasks: {
    patientId: string;
    type: string;
    time: string;
    status: string;
  }[];
}

interface NurseSelectorProps {
  hospitalId: string;
  departmentId: string;
  selectedNurseId: string;
  onChange: (nurseId: string, nurseName: string) => void;
}

export default function NurseSelector({
  hospitalId,
  departmentId,
  selectedNurseId,
  onChange
}: NurseSelectorProps) {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchNurses = async () => {
      if (!hospitalId || !departmentId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Buscar enfermeiros do hospital específico que trabalham no departamento selecionado
        const response = await axios.get(
          `http://localhost:3001/hospitals/${hospitalId}/staff/nurses?department=${departmentId}`
        );
        
        setNurses(response.data);
      } catch (err) {
        console.error('Erro ao buscar enfermeiros:', err);
        setError('Não foi possível carregar a lista de enfermeiros');
        
        // Dados de exemplo para desenvolvimento
        setNurses([
          {
            id: 'N001',
            name: 'Carlos Enfermeiro',
            shift: 'Manhã',
            assignedBeds: ['B001', 'B002'],
            tasks: [{
              patientId: 'P001',
              type: 'Medicação',
              time: '2025-12-17T15:00:00',
              status: 'pending'
            }]
          },
          {
            id: 'N002',
            name: 'Maria Enfermeira',
            shift: 'Tarde',
            assignedBeds: ['B003', 'B004'],
            tasks: []
          },
          {
            id: 'N003',
            name: 'João Enfermeiro',
            shift: 'Noite',
            assignedBeds: ['B005'],
            tasks: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNurses();
  }, [hospitalId, departmentId]);
  
  // Filtrar enfermeiros pelo termo de busca
  const filteredNurses = searchTerm.trim() === ''
    ? nurses
    : nurses.filter(nurse => 
        nurse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.shift.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Ordenar por número de leitos atribuídos (menos ocupados primeiro)
  const sortedNurses = [...filteredNurses].sort((a, b) => 
    (a.assignedBeds?.length || 0) - (b.assignedBeds?.length || 0)
  );
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Enfermeiro (Opcional)
      </label>
      
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou turno..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      ) : sortedNurses.length === 0 ? (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
          Nenhum enfermeiro encontrado para este departamento
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {sortedNurses.map((nurse) => (
            <div
              key={nurse.id}
              onClick={() => onChange(nurse.id, nurse.name)}
              className={`p-4 border rounded-md cursor-pointer transition-colors ${
                selectedNurseId === nurse.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50/30'
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{nurse.name}</div>
                  <div className="text-sm text-gray-600">Turno: {nurse.shift}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{nurse.assignedBeds.length} leito(s) atribuído(s)</div>
                  <div className="text-sm text-gray-600">{nurse.tasks.length} tarefa(s) pendente(s)</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}