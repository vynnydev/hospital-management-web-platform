import { useState, useEffect } from 'react';
import axios from 'axios';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  patients: string[];
  schedule: {
    shifts: string[];
    appointments: {
      patientId: string;
      date: string;
      type: string;
    }[];
  };
}

interface DoctorSelectorProps {
  hospitalId: string;
  departmentId: string;
  selectedDoctorId: string;
  onChange: (doctorId: string, doctorName: string) => void;
}

export default function DoctorSelector({
  hospitalId,
  departmentId,
  selectedDoctorId,
  onChange
}: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!hospitalId || !departmentId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Buscar médicos do hospital específico que trabalham no departamento selecionado
        const response = await axios.get(
          `http://localhost:3001/hospitals/${hospitalId}/staff/doctors?department=${departmentId}`
        );
        
        setDoctors(response.data);
      } catch (err) {
        console.error('Erro ao buscar médicos:', err);
        setError('Não foi possível carregar a lista de médicos');
        
        // Dados de exemplo para desenvolvimento
        setDoctors([
          {
            id: 'D001',
            name: 'Dra. Ana Santos',
            specialty: 'Cardiologia',
            patients: ['P001'],
            schedule: {
              shifts: ['manhã', 'tarde'],
              appointments: [{
                patientId: 'P001',
                date: '2025-12-18T10:00:00',
                type: 'Visita'
              }]
            }
          },
          {
            id: 'D002',
            name: 'Dr. Carlos Silveira',
            specialty: 'Cirurgia Cardíaca',
            patients: [],
            schedule: {
              shifts: ['manhã'],
              appointments: []
            }
          },
          {
            id: 'D003',
            name: 'Dr. Ricardo Ortiz',
            specialty: 'Ortopedia',
            patients: ['P002'],
            schedule: {
              shifts: ['tarde', 'noite'],
              appointments: []
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, [hospitalId, departmentId]);
  
  // Filtrar médicos pelo termo de busca
  const filteredDoctors = searchTerm.trim() === ''
    ? doctors
    : doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Ordenar por número de pacientes (menos ocupados primeiro)
  const sortedDoctors = [...filteredDoctors].sort((a, b) => 
    (a.patients?.length || 0) - (b.patients?.length || 0)
  );
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Médico Responsável*
      </label>
      
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou especialidade..."
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
      ) : sortedDoctors.length === 0 ? (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
          Nenhum médico encontrado para este departamento
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {sortedDoctors.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => onChange(doctor.id, doctor.name)}
              className={`p-4 border rounded-md cursor-pointer transition-colors ${
                selectedDoctorId === doctor.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50/30'
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{doctor.name}</div>
                  <div className="text-sm text-gray-600">{doctor.specialty}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{doctor.patients.length} paciente(s)</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Turnos: {doctor.schedule.shifts.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}