import { ChangeEvent } from 'react';
import { IPatientRegistration } from '@/types/patient-types';

interface PatientContactInfoProps {
  data: IPatientRegistration['contactInfo'];
  onChange: (data: Partial<IPatientRegistration['contactInfo']>) => void;
  errors: Record<string, string>;
}

export default function PatientContactInfo({ data, onChange, errors }: PatientContactInfoProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      onChange({ 
        address: {
          ...data.address,
          [addressField]: value
        }
      });
    } else if (name.startsWith('emergencyContact.')) {
      const emergencyField = name.split('.')[1];
      onChange({
        emergencyContact: {
          ...data.emergencyContact,
          [emergencyField]: value
        }
      });
    } else {
      onChange({ [name]: value });
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Informações de Contato</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone*
            </label>
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors['contactInfo.phone'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(00) 0000-0000"
            />
            {errors['contactInfo.phone'] && (
              <p className="mt-1 text-sm text-red-500">{errors['contactInfo.phone']}</p>
            )}
          </div>
          
          {/* Celular */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Celular
            </label>
            <input
              type="tel"
              name="cellphone"
              value={data.cellphone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="(00) 00000-0000"
            />
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="exemplo@email.com"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Endereço</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CEP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP*
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={data.address.zipCode}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors['contactInfo.address.zipCode'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="00000-000"
              />
              {errors['contactInfo.address.zipCode'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactInfo.address.zipCode']}</p>
              )}
            </div>
            
            {/* Rua */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rua*
              </label>
              <input
                type="text"
                name="address.street"
                value={data.address.street}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors['contactInfo.address.street'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nome da rua"
              />
              {errors['contactInfo.address.street'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactInfo.address.street']}</p>
              )}
            </div>
            
            {/* Número */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número*
              </label>
              <input
                type="text"
                name="address.number"
                value={data.address.number}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Número"
              />
            </div>
            
            {/* Complemento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complemento
              </label>
              <input
                type="text"
                name="address.complement"
                value={data.address.complement || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Apto, Bloco, etc."
              />
            </div>
            
            {/* Bairro */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro*
              </label>
              <input
                type="text"
                name="address.neighborhood"
                value={data.address.neighborhood}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors['contactInfo.address.neighborhood'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Bairro"
              />
              {errors['contactInfo.address.neighborhood'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactInfo.address.neighborhood']}</p>
              )}
            </div>
            
            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade*
              </label>
              <input
                type="text"
                name="address.city"
                value={data.address.city}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors['contactInfo.address.city'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Cidade"
              />
              {errors['contactInfo.address.city'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactInfo.address.city']}</p>
              )}
            </div>
            
            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado*
              </label>
              <select
                name="address.state"
                value={data.address.state}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors['contactInfo.address.state'] ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione o Estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
              {errors['contactInfo.address.state'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactInfo.address.state']}</p>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Contato de Emergência</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do Contato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome*
              </label>
              <input
                type="text"
                name="emergencyContact.name"
                value={data.emergencyContact.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors['contactInfo.emergencyContact.name'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nome completo"
              />
              {errors['contactInfo.emergencyContact.name'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactInfo.emergencyContact.name']}</p>
              )}
            </div>
            
            {/* Telefone do Contato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone*
              </label>
              <input
                type="tel"
                name="emergencyContact.phone"
                value={data.emergencyContact.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors['contactInfo.emergencyContact.phone'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="(00) 00000-0000"
              />
              {errors['contactInfo.emergencyContact.phone'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactInfo.emergencyContact.phone']}</p>
              )}
            </div>
            
            {/* Parentesco */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parentesco/Relação*
              </label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={data.emergencyContact.relationship}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors['contactInfo.emergencyContact.relationship'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Cônjuge, Filho(a), Amigo(a)"
              />
              {errors['contactInfo.emergencyContact.relationship'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactInfo.emergencyContact.relationship']}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">* Campos obrigatórios</p>
    </div>
  );
}