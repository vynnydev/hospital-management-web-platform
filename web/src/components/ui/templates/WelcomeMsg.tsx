'use client'

import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData'
import { authService } from '@/services/auth/AuthService'
import { useEffect, useState } from 'react'

export const WelcomeMsg = () => {
    const { networkData, currentUser } = useNetworkData()
    const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient' | null>(null)
    const user = authService.getCurrentUser()
    
    // Seleciona o hospital atual (se aplicável)
    const selectedHospital = networkData?.hospitals?.find(h => h.id === currentUser?.hospitalId)

    useEffect(() => {
        // Determinar o tipo de usuário logado
        if (user) {
            if (authService.isDoctor()) {
                setUserType('doctor')
            } else if (authService.isPatient()) {
                setUserType('patient')
            } else {
                setUserType('admin')
            }
        }
    }, [user])

    // Função para retornar o título baseado no tipo de usuário
    const getTitleByUserType = () => {
        if (!user) return 'Bem-vindo de Volta!'
        
        switch (userType) {
            case 'doctor':
                return `Bem-vindo, Dr. ${user.name}!`
            case 'patient':
                return `Bem-vindo, ${user.name}!`
            case 'admin':
                return `Bem-vindo de Volta, ${user.name || 'Administrador'}!`
            default:
                return `Bem-vindo de Volta!`
        }
    }

    // Função para retornar a descrição baseada no tipo de usuário
    const getDescriptionByUserType = () => {
        switch (userType) {
            case 'doctor':
                return user?.specialization 
                    ? `${user.specialization} • CRM ${user.medicalLicense || '00000'}`
                    : 'Portal Médico'
            case 'patient':
                return 'Portal do Paciente'
            case 'admin':
                return selectedHospital 
                    ? `${selectedHospital.name || 'Hospital'}`
                    : 'Visão Geral da Rede'
            default:
                return 'Este é seu relatório de visão geral do Cognitiva'
        }
    }

    // Função para retornar o badge do tipo de usuário
    const getUserTypeBadge = () => {
        switch (userType) {
            case 'doctor':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                    Médico
                </span>
            case 'patient':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                    Paciente
                </span>
            case 'admin':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 ml-2">
                    Administrador
                </span>
            default:
                return null
        }
    }

    return (
        <div className='space-y-2 mb-4'>
            <div className="py-4">
                <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-white">
                        {getTitleByUserType()}
                        {getUserTypeBadge()}
                    </h1>
                </div>
                <p className="text-blue-100 mt-1">
                    {getDescriptionByUserType()}
                </p>
            </div>
        </div>
    )
}