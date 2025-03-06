/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useState } from 'react';
import { IPatientRegistration, TInsuranceType } from '@/types/patient-types';
import { useInsuranceData } from '@/services/hooks/digital-care-service/useInsuranceData';

interface PatientInsuranceInfoProps {
  data: IPatientRegistration['insuranceInfo'];
  onChange: (data: Partial<IPatientRegistration['insuranceInfo']>) => void;
  onFillFromSUS: (cardNumber: string) => Promise<void>;
  errors: Record<string, string>;
}

export default function PatientInsuranceInfo({ 
  data, 
  onChange, 
  onFillFromSUS,
  errors 
}: PatientInsuranceInfoProps) {
  const [susCardNumber, setSusCardNumber] = useState('');
  const [isSearchingSUS, setIsSearchingSUS] = useState(false);
  const { insurances, isLoading, getInsurancesByName } = useInsuranceData();
  const [insuranceSearch, setInsuranceSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string }>>([]);

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as TInsuranceType;
    
    // Reset insurance details when changing type
    onChange({
      type,
      insuranceDetails: type === 'Convênio' ? data.insuranceDetails : undefined,
      susInfo: type === 'SUS' ? data.susInfo : undefined
    });
  };

  const handleInsuranceChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (data.type === 'Convênio') {
      onChange({
        insuranceDetails: {
          ...data.insuranceDetails!,
          [name]: value
        }
      });
    } else if (data.type === 'SUS') {
      onChange({
        susInfo: {
          ...data.susInfo!,
          [name]: value
        }
      });
    }
  };

  const handleInsuranceSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInsuranceSearch(query);
    
    if (query.length >= 3) {
      const results = getInsurancesByName(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectInsurance = (insurance: { id: string; name: string }) => {
    onChange({
      insuranceDetails: {
        id: insurance.id,
        name: insurance.name,
        planType: data.insuranceDetails?.planType || '',
        cardNumber: data.insuranceDetails?.cardNumber || '',
        expirationDate: data.insuranceDetails?.expirationDate || ''
      }
    });
    setInsuranceSearch(insurance.name);
    setSearchResults([]);
  };

  const handleSUSSearch = async () => {
    if (!susCardNumber) return;
    
    setIsSearchingSUS(true);
    try {
      await onFillFromSUS(susCardNumber);
    } finally {
      setIsSearchingSUS(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Informações de Convênio</h2>
      
      <div className="space-y-6">
        {/* Tipo de Cobertura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Cobertura*
          </label>
          <select
            value={data.type}
            onChange={handleTypeChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Particular">Particular</option>
            <option value="Convênio">Convênio</option>
            <option value="SUS">SUS</option>
          </select>
        </div>
        
        {/* Convênio */}
        {data.type === 'Convênio' && (
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Convênio*
              </label>
              <input
                type="text"
                value={insuranceSearch}
                onChange={handleInsuranceSearch}
                className={`w-full p-2 border rounded-md ${
                  errors['insuranceInfo.insuranceDetails.id'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Digite para buscar convênios"
              />
              {errors['insuranceInfo.insuranceDetails.id'] && (
                <p className="mt-1 text-sm text-red-500">{errors['insuranceInfo.insuranceDetails.id']}</p>
              )}
              
              {/* Resultados da busca */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.map(insurance => (
                    <div
                      key={insurance.id}
                      onClick={() => selectInsurance(insurance)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {insurance.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Plano*
                </label>
                <select
                  name="planType"
                  value={data.insuranceDetails?.planType || ''}
                  onChange={handleInsuranceChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Premium">Premium</option>
                  <option value="Empresarial">Empresarial</option>
                  <option value="Familiar">Familiar</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Cartão*
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={data.insuranceDetails?.cardNumber || ''}
                  onChange={handleInsuranceChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Número do cartão"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Validade
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={data.insuranceDetails?.expirationDate || ''}
                  onChange={handleInsuranceChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* SUS */}
        {data.type === 'SUS' && (
          <div className="space-y-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Cartão SUS*
                </label>
                <input
                  type="text"
                  value={susCardNumber}
                  onChange={(e) => setSusCardNumber(e.target.value)}
                  className={`w-full p-2 border rounded-md ${
                    errors['insuranceInfo.susInfo.cartaoSUS'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="000 0000 0000 0000"
                />
                {errors['insuranceInfo.susInfo.cartaoSUS'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['insuranceInfo.susInfo.cartaoSUS']}</p>
                )}
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleSUSSearch}
                  disabled={isSearchingSUS || !susCardNumber}
                  className={`p-2 rounded-md ${
                    isSearchingSUS || !susCardNumber
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isSearchingSUS ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>
            
            {data.susInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Emissão
                  </label>
                  <input
                    type="date"
                    name="dataEmissao"
                    value={data.susInfo.dataEmissao}
                    onChange={handleInsuranceChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Município de Emissão
                  </label>
                  <input
                    type="text"
                    name="municipioEmissao"
                    value={data.susInfo.municipioEmissao}
                    onChange={handleInsuranceChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UF de Emissão
                  </label>
                  <input
                    type="text"
                    name="ufEmissao"
                    value={data.susInfo.ufEmissao}
                    onChange={handleInsuranceChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500">* Campos obrigatórios</p>
    </div>
  );
}