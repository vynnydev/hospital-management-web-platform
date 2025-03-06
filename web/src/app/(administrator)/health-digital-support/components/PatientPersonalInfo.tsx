import { ChangeEvent } from 'react';
import { IPatientRegistration } from '@/types/patient-types';
import Image from 'next/image';

interface PatientPersonalInfoProps {
  data: IPatientRegistration['personalInfo'];
  onChange: (data: Partial<IPatientRegistration['personalInfo']>) => void;
  errors: Record<string, string>;
}

export default function PatientPersonalInfo({ data, onChange, errors }: PatientPersonalInfoProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Informações Pessoais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo*
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors['personalInfo.name'] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite o nome completo"
          />
          {errors['personalInfo.name'] && (
            <p className="mt-1 text-sm text-red-500">{errors['personalInfo.name']}</p>
          )}
        </div>
        
        {/* Nome Social (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Social
          </label>
          <input
            type="text"
            name="socialName"
            value={data.socialName || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Digite o nome social (se aplicável)"
          />
        </div>
        
        {/* Data de Nascimento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Nascimento*
          </label>
          <input
            type="date"
            name="birthDate"
            value={data.birthDate}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors['personalInfo.birthDate'] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors['personalInfo.birthDate'] && (
            <p className="mt-1 text-sm text-red-500">{errors['personalInfo.birthDate']}</p>
          )}
        </div>
        
        {/* Gênero */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gênero*
          </label>
          <select
            name="gender"
            value={data.gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        
        {/* CPF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF*
          </label>
          <input
            type="text"
            name="cpf"
            value={data.cpf}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors['personalInfo.cpf'] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="000.000.000-00"
          />
          {errors['personalInfo.cpf'] && (
            <p className="mt-1 text-sm text-red-500">{errors['personalInfo.cpf']}</p>
          )}
        </div>
        
        {/* RG */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RG
          </label>
          <input
            type="text"
            name="rg"
            value={data.rg || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="00.000.000-0"
          />
        </div>
        
        {/* Estado Civil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado Civil
          </label>
          <select
            name="maritalStatus"
            value={data.maritalStatus || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione</option>
            <option value="Solteiro(a)">Solteiro(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viúvo(a)">Viúvo(a)</option>
            <option value="União Estável">União Estável</option>
          </select>
        </div>
        
        {/* Nacionalidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nacionalidade*
          </label>
          <input
            type="text"
            name="nationality"
            value={data.nationality}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nacionalidade"
          />
        </div>
        
        {/* Tipo Sanguíneo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo Sanguíneo
          </label>
          <select
            name="bloodType"
            value={data.bloodType || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Não Informado</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        
        {/* Upload de Foto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
              {data.photo ? (
                <Image
                  src={data.photo}
                  alt="Foto do paciente"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Sem foto</span>
              )}
            </div>
            <div>
              <input
                type="file"
                id="photo"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      onChange({ photo: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="photo"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300"
              >
                Escolher Arquivo
              </label>
              {data.photo && (
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => onChange({ photo: '' })}
                >
                  Remover
                </button>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">* Campos obrigatórios</p>
    </div>
  );
}