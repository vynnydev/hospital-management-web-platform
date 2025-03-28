/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { IPatientFormData } from '../PatientRegisterForm'
import { Input } from '@/components/ui/organisms/input'
import { Label } from '@/components/ui/organisms/label'
import { Button } from '@/components/ui/organisms/button'
import { Search, Loader2 } from 'lucide-react'
import InputMask from 'react-input-mask'

interface IStepTwoProps {
  formData: IPatientFormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function StepTwo({ formData, handleChange }: IStepTwoProps) {
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  
  // Função para buscar CEP e preencher campos de endereço
  const handleCepSearch = async () => {
    const cep = formData.zipCode.replace(/\D/g, '')
    
    if (cep.length !== 8) {
      return
    }
    
    setIsLoadingCep(true)
    
    try {
      // Em ambiente real, usaria a API do ViaCEP ou similar
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        // Disparar eventos de alteração para cada campo
        const createChangeEvent = (name: string, value: string) => {
          const event = {
            target: {
              name,
              value,
              type: 'text'
            }
          } as React.ChangeEvent<HTMLInputElement>
          
          return event
        }
        
        // Atualizar campos com dados do CEP
        handleChange(createChangeEvent('street', data.logradouro))
        handleChange(createChangeEvent('neighborhood', data.bairro))
        handleChange(createChangeEvent('city', data.localidade))
        handleChange(createChangeEvent('state', data.uf))
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    } finally {
      setIsLoadingCep(false)
    }
  }
  
  // Lista de estados brasileiros
  const brazilianStates = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" }
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="space-y-2 md:w-1/3">
          <Label htmlFor="zipCode">CEP *</Label>
          <div className="flex">
            <InputMask
              mask="99999-999"
              value={formData.zipCode}
              onChange={handleChange}
              onBlur={handleCepSearch}
            >
              {(inputProps: any) => (
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="00000-000"
                  {...inputProps}
                  required
                />
              )}
            </InputMask>
            <Button 
              type="button" 
              size="icon" 
              className="ml-2"
              onClick={handleCepSearch}
              disabled={isLoadingCep || formData.zipCode.replace(/\D/g, '').length !== 8}
            >
              {isLoadingCep ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="street">Rua/Avenida *</Label>
        <Input
          id="street"
          name="street"
          placeholder="Nome da rua"
          value={formData.street}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="number">Número *</Label>
          <Input
            id="number"
            name="number"
            placeholder="Número"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            name="complement"
            placeholder="Apto, bloco, casa, etc."
            value={formData.complement}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="neighborhood">Bairro *</Label>
        <Input
          id="neighborhood"
          name="neighborhood"
          placeholder="Bairro"
          value={formData.neighborhood}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            name="city"
            placeholder="Cidade"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">Estado *</Label>
          <select
            id="state"
            name="state"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {brazilianStates.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="border-t pt-4 text-sm">
        <p className="text-gray-600">
          Seu endereço é importante para identificarmos unidades de saúde mais próximas.
        </p>
      </div>
    </div>
  )
}