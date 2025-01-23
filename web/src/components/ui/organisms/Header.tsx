/* eslint-disable @typescript-eslint/no-unused-vars */
// components/ui/organisms/Header.tsx
'use client'
import Image from 'next/image';
import { LogOut, Moon, Puzzle, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Brand } from "@/components/ui/atoms/Brand"
import { HeaderNavigation } from "@/components/ui/organisms/HeaderNavigation"
import { WelcomeMsg } from "@/components/ui/templates/WelcomeMsg"
import { Button } from "@/components/ui/organisms/button"
import { authService } from "@/services/auth/AuthService"
import { useState } from "react"
import { ConfigurationAndUserModalMenus } from '../templates/ConfigurationAndUserModalMenus';
import { IntegrationsContent } from '../templates/modal-contents/IntegrationsContent';

export const Header = () => {
    const { theme, setTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
    const user = authService.getCurrentUser();

    const handleLogout = async () => {
        await authService.logout();
        window.location.href = '/sign-in';
    };

    return (
        <header className={`px-4 py-8 lg:px-14 pb-36
            ${theme === 'dark'
                ? 'bg-[linear-gradient(135deg,#1E293B,#164E63)] shadow-[0_0_20px_rgba(30,41,59,0.5),0_0_40px_rgba(22,78,99,0.3)]'
                : 'bg-[linear-gradient(135deg,#aecddc,#459bc6)] shadow-lg'
            }`
        }>
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-14">
                    <div className="flex items-center space-x-28 lg:gap-x-16">
                        <Brand />
                        <HeaderNavigation />
                    </div>
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
                                    <Image 
                                        src={user?.profileImage || '/images/default-avatar.png'}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                        width={40}
                                        height={40}
                                    />
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
            </div>
        </header>
    )
}
