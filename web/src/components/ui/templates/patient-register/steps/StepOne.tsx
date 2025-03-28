/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { IPatientFormData } from '../PatientRegisterForm'
import { Input } from '@/components/ui/organisms/input'
import { Label } from '@/components/ui/organisms/label'
import InputMask from 'react-input-mask'

interface IStepOneProps {
  formData: IPatientFormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function StepOne({ formData, handleChange }: IStepOneProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Seu nome completo"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="exemplo@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Telefone *</Label>
          <InputMask
            mask="(99) 99999-9999"
            value={formData.phoneNumber}
            onChange={handleChange}
          >
            {(inputProps: any) => (
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="(00) 00000-0000"
                {...inputProps}
                required
              />
            )}
          </InputMask>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Senha *</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Sua senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-gray-500">
            Mínimo de 6 caracteres, incluindo letras e números
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha *</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <InputMask
            mask="999.999.999-99"
            value={formData.cpf}
            onChange={handleChange}
          >
            {(inputProps: any) => (
              <Input
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                {...inputProps}
                required
              />
            )}
          </InputMask>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Data de nascimento *</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gender">Gênero</Label>
        <select
          id="gender"
          name="gender"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outro">Outro</option>
        </select>
      </div>
      
      <div className="border-t pt-4 text-sm">
        <p className="text-gray-600">
          Preencha corretamente todos os campos. Seu email será usado para acessar o sistema.
        </p>
      </div>
    </div>
  )
}