'use client'

import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData'

export const WelcomeMsg = () => {
    const { currentUser } = useNetworkData()

    return (
        <div className='space-y-2 mb-4'>
            <header className="py-4 px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Bem-vindo de Volta, {currentUser?.name || 'Administrador'}!
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                        Este é seu relatório de visão geral do H24
                        </p>
                    </div>
                
                </div>
            </header>
        </div>
    )
}