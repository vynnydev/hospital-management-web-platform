/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { IPatientFormData } from '../PatientRegisterForm'
import { Input } from '@/components/ui/organisms/input'
import { Label } from '@/components/ui/organisms/label'
import { Textarea } from '@/components/ui/organisms/textarea'
import InputMask from 'react-input-mask'
import { AlertTriangle } from 'lucide-react'

interface IStepThreeProps {
  formData: IPatientFormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

export function StepThree({ formData, handleChange }: IStepThreeProps) {
  // Lista de seguradoras de saúde comuns
  const healthInsuranceOptions = [
    { value: "", label: "Selecione" },
    { value: "Nenhum", label: "Não possuo plano de saúde" },
    { value: "Amil", label: "Amil" },
    { value: "Bradesco Saúde", label: "Bradesco Saúde" },
    { value: "Hapvida", label: "Hapvida" },
    { value: "Interclinicas", label: "Interclinicas" },
    { value: "NotreDame Intermédica", label: "NotreDame Intermédica" },
    { value: "Sulamérica", label: "Sulamérica" },
    { value: "Unimed", label: "Unimed" },
    { value: "Outro", label: "Outro" }
  ]
  
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-amber-50 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Informações importantes</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Estas informações são fundamentais para o seu atendimento médico e serão mantidas em sigilo. 
                Apenas profissionais de saúde autorizados terão acesso.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="healthInsurance">Plano de Saúde</Label>
        <select
          id="healthInsurance"
          name="healthInsurance"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.healthInsurance}
          onChange={handleChange}
        >
          {healthInsuranceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {formData.healthInsurance && formData.healthInsurance !== "Nenhum" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceNumber">Número da Carteirinha</Label>
            <Input
              id="insuranceNumber"
              name="insuranceNumber"
              placeholder="Número do plano"
              value={formData.insuranceNumber}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="insuranceExpiration">Validade</Label>
            <Input
              id="insuranceExpiration"
              name="insuranceExpiration"
              type="date"
              value={formData.insuranceExpiration}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 my-4"></div>
      
      <div className="space-y-2">
        <Label htmlFor="emergencyContactName">Nome do contato de emergência *</Label>
        <Input
          id="emergencyContactName"
          name="emergencyContactName"
          placeholder="Nome completo"
          value={formData.emergencyContactName}
          onChange={handleChange}
          required
        />
        <p className="text-xs text-gray-500">
          Pessoa que podemos contatar em caso de emergência
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="emergencyContactPhone">Telefone do contato de emergência *</Label>
        <InputMask
          mask="(99) 99999-9999"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
        >
          {(inputProps: any) => (
            <Input
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              placeholder="(00) 00000-0000"
              {...inputProps}
              required
            />
          )}
        </InputMask>
      </div>
      
      <div className="border-t border-gray-200 my-4"></div>
      
      <div className="space-y-2">
        <Label htmlFor="allergies">Alergias</Label>
        <Textarea
          id="allergies"
          name="allergies"
          placeholder="Liste suas alergias, incluindo alimentos, medicamentos, etc."
          value={formData.allergies}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chronicConditions">Condições crônicas ou doenças preexistentes</Label>
        <Textarea
          id="chronicConditions"
          name="chronicConditions"
          placeholder="Liste condições médicas relevantes como hipertensão, diabetes, asma, etc."
          value={formData.chronicConditions}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="border-t pt-4 text-sm">
        <p className="text-gray-600">
          Mantenha estas informações sempre atualizadas para garantir o melhor atendimento.
        </p>
      </div>
    </div>
  )
}