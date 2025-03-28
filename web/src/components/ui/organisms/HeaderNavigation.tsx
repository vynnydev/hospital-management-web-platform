'use client'

import { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/organisms/button'
import { NavButton } from '@/components/ui/atoms/NavButton'

import { 
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/components/ui/organisms/sheet'
import { Menu, Activity, User, Calendar, FileText, Stethoscope, Hospital, BarChart3, Package, Settings } from 'lucide-react'
import { authService } from '@/services/auth/AuthService'

// Definição dos itens de menu para cada tipo de usuário
const adminRoutes = [
    {
        href: '/overview',
        label: 'Visão geral',
        icon: Activity
    },
    {
        href: '/health-digital-support',
        label: 'Atendimento Digital',
        icon: User
    },
    {
        href: '/bed-management',
        label: 'Gestão de Leitos',
        icon: Hospital
    },
    {
        href: '/patient-management',
        label: 'Gestão de Pacientes',
        icon: User
    },
    {
        href: '/staff-management',
        label: 'Gestão de Equipes',
        icon: User
    },
    {
        href: '/predictive-analysis',
        label: 'Análise Preditiva',
        icon: BarChart3
    },
    {
        href: '/inventory-resources',
        label: 'Recursos & Inventário',
        icon: Package
    },
    {
        href: '/process-studio-settings',
        label: 'Studio de Processos',
        icon: Settings
    },
]

const doctorRoutes = [
    {
        href: '/doctor/dashboard',
        label: 'Meu Painel',
        icon: Activity
    },
    {
        href: '/doctor/patients',
        label: 'Meus Pacientes',
        icon: User
    },
    {
        href: '/doctor/appointments',
        label: 'Consultas',
        icon: Calendar
    },
    {
        href: '/doctor/telemedicine',
        label: 'Telemedicina',
        icon: Stethoscope
    },
    {
        href: '/doctor/prescriptions',
        label: 'Prescrições',
        icon: FileText
    },
    {
        href: '/doctor/medical-records',
        label: 'Prontuários',
        icon: FileText
    },
    {
        href: '/doctor/analytics',
        label: 'Estatísticas',
        icon: BarChart3
    },
]

const patientRoutes = [
    {
        href: '/patient/dashboard',
        label: 'Meu Painel',
        icon: Activity
    },
    {
        href: '/patient/appointments',
        label: 'Minhas Consultas',
        icon: Calendar
    },
    {
        href: '/patient/telemedicine',
        label: 'Telemedicina',
        icon: Stethoscope
    },
    {
        href: '/patient/prescriptions',
        label: 'Minhas Prescrições',
        icon: FileText
    },
    {
        href: '/patient/medical-history',
        label: 'Histórico Médico',
        icon: FileText
    },
    {
        href: '/patient/profile',
        label: 'Meu Perfil',
        icon: User
    },
]

export const HeaderNavigation = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [userRoutes, setUserRoutes] = useState(adminRoutes) // Default para admin

    const router = useRouter()
    const pathname = usePathname()
    const isMobile = useMedia('(max-width: 1024px)', false)

    // Determinar quais rotas exibir com base no tipo de usuário
    useEffect(() => {
        const user = authService.getCurrentUser();
        
        if (user) {
            if (authService.isDoctor()) {
                setUserRoutes(doctorRoutes);
            } else if (authService.isPatient()) {
                setUserRoutes(patientRoutes);
            } else {
                // Administrador ou outros tipos de usuário
                setUserRoutes(adminRoutes);
            }
        }
    }, []);

    const onClick = (href: string) => {
        router.push(href)
        setIsOpen(false)
    }

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}> 
                <SheetTrigger>
                    <Button 
                        variant='outline'
                        size='sm'
                        className='
                            font-normal 
                            bg-white/10
                            hover:bg-white/20 
                            hover:text-white 
                            border-none 
                            focus-visible:ring-offset-0 
                            focus-visible:ring-transparent
                            outline-none
                            text-white
                            focus:bg-white/20
                            transition'
                        >
                            <Menu className='size-4' />
                    </Button>
                </SheetTrigger>
                <SheetContent side='left' className='bg-white px-2'>
                    <nav className='flex flex-col gap-y-2 pt-6'>
                        {userRoutes.map((route) => (
                            <Button
                                key={route.href}
                                variant={pathname.startsWith(route.href) ? 'secondary' : 'ghost'}
                                onClick={() => onClick(route.href)}
                                className='w-full justify-start'
                            >
                                {route.icon && <route.icon className="h-4 w-4 mr-1" />}
                                {route.label}
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <nav className="hidden lg:flex items-center space-x-2 overflow-x-auto">
            {userRoutes.map((route) => (
                <NavButton 
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    icon={route.icon}
                    isActive={pathname.startsWith(route.href)}
                />
            ))}
        </nav>
    )
}