import { ChangeEvent } from 'react';
import { IPatientRegistration } from '@/types/patient-types';
import Image from 'next/image';

interface PatientPersonalInfoProps {
  data: IPatientRegistration['personalInfo'];
  onChange: (data: Partial<IPatientRegistration['personalInfo']>) => void;
  errors: Record<string, string>;
  hospitalId: string; // Adicionado hospitalId
  hospitalName?: string; // Adicionado hospitalName opcional
}

export default function PatientPersonalInfo({ 
  data, 
  onChange, 
  errors,
  hospitalId,
  hospitalName
}: PatientPersonalInfoProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* Hospital Selecionado */}
      <div className="mb-6 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-md">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Hospital Selecionado</h3>
            <p className="text-blue-900 dark:text-blue-200 font-medium">{hospitalName || "ID: " + hospitalId}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Informações Pessoais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome Completo*
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors['personalInfo.name'] 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
            placeholder="Digite o nome completo"
          />
          {errors['personalInfo.name'] && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors['personalInfo.name']}</p>
          )}
        </div>
        
        {/* Nome Social (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome Social
          </label>
          <input
            type="text"
            name="socialName"
            value={data.socialName || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Digite o nome social (se aplicável)"
          />
        </div>
        
        {/* Data de Nascimento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data de Nascimento*
          </label>
          <input
            type="date"
            name="birthDate"
            value={data.birthDate}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors['personalInfo.birthDate'] 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          />
          {errors['personalInfo.birthDate'] && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors['personalInfo.birthDate']}</p>
          )}
        </div>
        
        {/* Gênero */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gênero*
          </label>
          <select
            name="gender"
            value={data.gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        
        {/* CPF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            CPF*
          </label>
          <input
            type="text"
            name="cpf"
            value={data.cpf}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors['personalInfo.cpf'] 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
            placeholder="000.000.000-00"
          />
          {errors['personalInfo.cpf'] && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors['personalInfo.cpf']}</p>
          )}
        </div>
        
        {/* RG */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            RG
          </label>
          <input
            type="text"
            name="rg"
            value={data.rg || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="00.000.000-0"
          />
        </div>
        
        {/* Estado Civil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estado Civil
          </label>
          <select
            name="maritalStatus"
            value={data.maritalStatus || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nacionalidade*
          </label>
          <input
            type="text"
            name="nationality"
            value={data.nationality}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Nacionalidade"
          />
        </div>
        
        {/* Tipo Sanguíneo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo Sanguíneo
          </label>
          <select
            name="bloodType"
            value={data.bloodType || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Foto
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600">
              {data.photo ? (
                <Image
                  src={data.photo}
                  alt="Foto do paciente"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 dark:text-gray-500">Sem foto</span>
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
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Escolher Arquivo
              </label>
              {data.photo && (
                <button
                  type="button"
                  className="ml-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  onClick={() => onChange({ photo: '' })}
                >
                  Remover
                </button>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">* Campos obrigatórios</p>
    </div>
  );
}