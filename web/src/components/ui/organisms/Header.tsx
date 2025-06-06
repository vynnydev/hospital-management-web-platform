/* eslint-disable @typescript-eslint/no-unused-vars */
// components/ui/organisms/Header.tsx
'use client'
import { useState, useEffect } from "react"
import Image from 'next/image';
import { LogOut, Moon, Puzzle, Sun, Stethoscope, User } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Brand } from "@/components/ui/atoms/Brand"
import { HeaderNavigation } from "@/components/ui/organisms/HeaderNavigation"
import { WelcomeMsg } from "@/components/ui/templates/WelcomeMsg"
import { Button } from "@/components/ui/organisms/button"
import { authService } from "@/services/general/auth/AuthService"
import { ConfigurationAndUserModalMenus } from '../templates/modals/ConfigurationAndUserModalMenus';
import { IntegrationsContent } from '../templates/user-preferences/IntegrationsContent';
import { AlertsProvider } from '../templates/providers/alerts/AlertsProvider';
import { CognitivaAssistantBar } from '../templates/ai-assistant/CognitivaAssistantBar';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';

export const Header = () => {
    const { theme, setTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
    const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient' | 'nurse' | 'attendant' | null>(null);
    const user = authService.getCurrentUser();
    const { networkData, currentUser } = useNetworkData();

    console.log("Usuário atual:", user?.email)

    useEffect(() => {
        // Determinar o tipo de usuário logado
        if (user) {
            if (authService.isDoctor()) {
                setUserType('doctor');
            } else if (authService.isPatient()) {
                setUserType('patient');
            } else if (authService.isNurse()) {
                setUserType('nurse')
            } else if (authService.isAttendant()) {
                setUserType('attendant')
            } else {
                setUserType('admin');
            }
        }
    }, [user]);

    const selectedHospital = networkData?.hospitals?.find((h: { id: string }) => h.id === currentUser?.hospitalId);

    const handleLogout = async () => {
        await authService.logout();
        window.location.href = '/sign-in';
    };

    // Função para retornar o ícone/badge do tipo de usuário
    const setUserTypeMenu = () => {
        switch (userType) {
            case 'doctor':
                return <div className="flex items-center space-x-20 lg:gap-x-8">
                            <Brand />
                            <HeaderNavigation />
                        </div>;
            case 'patient':
                return <div className="flex items-center space-x-40 lg:gap-x-8">
                            <Brand />
                            <HeaderNavigation />
                        </div>;
            case 'nurse':
                return <div className="flex items-center space-x-24 lg:gap-x-8">
                            <Brand />
                            <HeaderNavigation />
                        </div>
            case 'attendant':
                return <div className="flex items-center space-x-44 lg:gap-x-8">
                            <Brand />
                            <HeaderNavigation />
                        </div>
            case 'admin':
                return <div className="flex items-center space-x-6 lg:gap-x-8">
                            <Brand />
                            <HeaderNavigation />
                        </div>
            default:
                return null;
        }
    };

    return (
        <header className={`px-4 py-10 lg:px-14 pb-52
            ${theme === 'dark'
                ? 'bg-gradient-to-tr from-slate-800 to-cyan-900 shadow-xl'
                : 'bg-gradient-to-tr from-blue-200 to-blue-500 shadow-lg'
            }`
        }>
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-14">
                    {setUserTypeMenu()}
                    <div className="flex items-center gap-x-4">
                        <Button 
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            variant="outline" 
                            size="icon" 
                            className={`
                                relative
                                before:content-['']
                                before:absolute
                                before:inset-[-2px]
                                before:rounded-lg
                                before:bg-gradient-to-r
                                before:from-[#38BDF8]
                                before:via-[#22D3EE]
                                before:to-[#2DD4BF]
                                before:-z-10
                                before:transition-opacity
                                before:duration-300
                                hover:before:opacity-80
                                transition-all
                                bg-white/10 
                                hover:bg-white/20 
                                text-white 
                                dark:hover:bg-green-700 
                                dark:text-green-100
                                ${theme === 'dark'
                                    ? 'bg-[linear-gradient(135deg,#0F172A,#155E75)] shadow-[0_0_20px_rgba(15,23,42,0.5),0_0_40px_rgba(21,94,117,0.3)]'
                                    : 'bg-[linear-gradient(135deg,#aecddc,#459bc6)] shadow-lg'
                                }
                            `}
                        >
                            {theme === 'dark' 
                                ? <Sun className="h-[1.2rem] w-[1.2rem] relative z-10" />
                                : <Moon className="h-[1.2rem] w-[1.2rem] relative z-10" />
                            }
                        </Button>
                        {/* Botão redondo com imagem do usuário */}
                        <div className="relative bg-gradient-to-r from-blue-700 to-cyan-700 w-12 h-12 p-1 rounded-full">
                            <button 
                                onClick={() => setIsIntegrationsOpen(!isIntegrationsOpen)}
                                className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:border-blue-500"
                            >
                                {user?.profileImage ? (
                                    <Image 
                                        src={user?.profileImage}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                        width={40}
                                        height={40}
                                    />
                                ) : (
                                    <User className="ml-2 h-5 w-5"/>
                                )}
                            </button>
                            
                            <ConfigurationAndUserModalMenus
                                isOpen={isIntegrationsOpen} 
                                onClose={() => setIsIntegrationsOpen(false)}
                                user={user}
                                onLogout={handleLogout}
                            />
                        </div>
                    </div>
                </div>
                
                <WelcomeMsg />

                <div className='absolute rounded-full p-1 bg-gray-700 mt-20'>
                    <AlertsProvider hospitalId={selectedHospital as unknown as string || ''} checkInterval={30000}>
                            {/* Barra com Assistente IA e Chat */}
                            <CognitivaAssistantBar showTitle={false} />
                    </AlertsProvider>
                </div>
            </div>
        </header>
    )
}