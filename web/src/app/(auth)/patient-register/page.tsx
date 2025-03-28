'use client'

import { PatientRegisterForm } from "@/components/ui/templates/patient-register/PatientRegisterForm"

export default function PatientRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">Bem vindo à Cognitiva</h1>
          <p className="text-xl text-blue-100 mt-2">
            Crie sua conta para acessar nossos serviços de telemedicina
          </p>
        </div>
        
        <PatientRegisterForm />
        
        <div className="text-center mt-8 text-blue-100 text-sm">
          <p>© 2025 Plataforma Cognitiva - Todos os direitos reservados</p>
          <p className="mt-1">Atendimento online especializado para cuidar da sua saúde</p>
        </div>
      </div>
    </div>
  )
}