/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData'
import { authService } from '@/services/auth/AuthService'
import { useEffect, useState } from 'react'
import { Stethoscope, UserCog, User, Heart, UserCheck } from 'lucide-react'

export const WelcomeMsg = () => {
    const { networkData, currentUser } = useNetworkData()
    const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient' | 'nurse' | 'attendant' | null>(null)
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
            } else if (authService.isNurse()) {
                setUserType('nurse')
            } else if (authService.isAttendant()) {
                setUserType('attendant')
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
            case 'nurse':
                return `Bem-vinda, Enf. ${user.name}!`
            case 'patient':
                return `Bem-vindo, ${user.name}!`
            case 'attendant':
                return `Bem-vindo ${user.name}!`
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
            case 'nurse':
                return user?.nursingLicense 
                    ? `COREN ${user.nursingLicense || '00000'} • ${selectedHospital?.name || 'Hospital'}`
                    : 'Portal de Enfermagem'
            case 'patient':
                return 'Portal do Paciente'
            case 'attendant':
                return 'Portal do Atendente'
            case 'admin':
                return selectedHospital 
                    ? `${selectedHospital.name || 'Hospital'}`
                    : 'Visão Geral da Rede'
            default:
                return 'Este é seu relatório de visão geral do Cognitiva'
        }
    }

    // Função para retornar o ícone do tipo de usuário
    const getUserTypeIcon = () => {
        switch (userType) {
            case 'doctor':
                return <Stethoscope className="h-4 w-4 mr-1" />;
            case 'nurse':
                return <Heart className="h-4 w-4 mr-1" />;
            case 'patient':
                return <User className="h-4 w-4 mr-1" />;
            case 'attendant':
                return <UserCheck className="mr-1 h-3 w-3" />
            case 'admin':
                return <UserCog className="h-4 w-4 mr-1" />;
            default:
                return null;
        }
    };

    // Função para retornar o badge do tipo de usuário
    const getUserTypeBadge = () => {
        switch (userType) {
            case 'doctor':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                    <Stethoscope className="mr-1 h-3 w-3" />
                    Médico
                </span>
            case 'nurse':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 ml-2">
                    <Heart className="mr-1 h-3 w-3" />
                    Enfermagem
                </span>
            case 'patient':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                    <User className="mr-1 h-3 w-3" />
                    Paciente
                </span>
            case 'attendant':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 ml-2">
                  <UserCheck className="mr-1 h-3 w-3" />
                    Atendente
                </span>;
            case 'admin':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 ml-2">
                    <UserCog className="mr-1 h-3 w-3" />
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