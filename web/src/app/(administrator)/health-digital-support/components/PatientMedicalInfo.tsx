/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useState } from 'react';
import { IPatientRegistration } from '@/types/patient-types';

interface PatientMedicalInfoProps {
  data: IPatientRegistration['medicalInfo'];
  onChange: (data: Partial<IPatientRegistration['medicalInfo']>) => void;
  errors: Record<string, string>;
}

export default function PatientMedicalInfo({ data, onChange, errors }: PatientMedicalInfoProps) {
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  
  const handleObservationsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ observations: e.target.value });
  };
  
  const addAllergy = () => {
    if (!newAllergy.trim()) return;
    onChange({ allergies: [...data.allergies, newAllergy.trim()] });
    setNewAllergy('');
  };
  
  const removeAllergy = (index: number) => {
    const updated = [...data.allergies];
    updated.splice(index, 1);
    onChange({ allergies: updated });
  };
  
  const addCondition = () => {
    if (!newCondition.trim()) return;
    onChange({ chronicConditions: [...data.chronicConditions, newCondition.trim()] });
    setNewCondition('');
  };
  
  const removeCondition = (index: number) => {
    const updated = [...data.chronicConditions];
    updated.splice(index, 1);
    onChange({ chronicConditions: updated });
  };
  
  const addMedication = () => {
    if (!newMedication.trim()) return;
    onChange({ medications: [...data.medications, newMedication.trim()] });
    setNewMedication('');
  };
  
  const removeMedication = (index: number) => {
    const updated = [...data.medications];
    updated.splice(index, 1);
    onChange({ medications: updated });
  };
  
  const addSurgery = () => {
    if (!newSurgery.trim()) return;
    onChange({ previousSurgeries: [...data.previousSurgeries, newSurgery.trim()] });
    setNewSurgery('');
  };
  
  const removeSurgery = (index: number) => {
    const updated = [...data.previousSurgeries];
    updated.splice(index, 1);
    onChange({ previousSurgeries: updated });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Informações Médicas</h2>
      
      <div className="space-y-8">
        {/* Alergias */}
        <div>
          <h3 className="text-lg font-medium mb-2">Alergias</h3>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Adicionar alergia"
            />
            <button
              type="button"
              onClick={addAllergy}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Adicionar
            </button>
          </div>
          
          {data.allergies.length > 0 ? (
            <div className="space-y-2">
              {data.allergies.map((allergy, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span>{allergy}</span>
                  <button
                    type="button"
                    onClick={() => removeAllergy(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma alergia registrada</p>
          )}
        </div>
        
        {/* Condições Crônicas */}
        <div>
          <h3 className="text-lg font-medium mb-2">Condições Crônicas</h3>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCondition()}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Adicionar condição crônica"
            />
            <button
              type="button"
              onClick={addCondition}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Adicionar
            </button>
          </div>
          
          {data.chronicConditions.length > 0 ? (
            <div className="space-y-2">
              {data.chronicConditions.map((condition, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span>{condition}</span>
                  <button
                    type="button"
                    onClick={() => removeCondition(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma condição crônica registrada</p>
          )}
        </div>
        
        {/* Medicamentos em Uso */}
        <div>
          <h3 className="text-lg font-medium mb-2">Medicamentos em Uso</h3>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMedication()}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Adicionar medicamento"
            />
            <button
              type="button"
              onClick={addMedication}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Adicionar
            </button>
          </div>
          
          {data.medications.length > 0 ? (
            <div className="space-y-2">
              {data.medications.map((medication, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span>{medication}</span>
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum medicamento registrado</p>
          )}
        </div>
        
        {/* Cirurgias Anteriores */}
        <div>
          <h3 className="text-lg font-medium mb-2">Cirurgias Anteriores</h3>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newSurgery}
              onChange={(e) => setNewSurgery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSurgery()}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Adicionar cirurgia"
            />
            <button
              type="button"
              onClick={addSurgery}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Adicionar
            </button>
          </div>
          
          {data.previousSurgeries.length > 0 ? (
            <div className="space-y-2">
              {data.previousSurgeries.map((surgery, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span>{surgery}</span>
                  <button
                    type="button"
                    onClick={() => removeSurgery(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma cirurgia registrada</p>
          )}
        </div>
        
        {/* Observações */}
        <div>
          <h3 className="text-lg font-medium mb-2">Observações</h3>
          <textarea
            value={data.observations || ''}
            onChange={handleObservationsChange}
            className="w-full p-2 border border-gray-300 rounded-md min-h-[120px]"
            placeholder="Observações adicionais sobre a saúde do paciente"
          />
        </div>
      </div>
    </div>
  );
}