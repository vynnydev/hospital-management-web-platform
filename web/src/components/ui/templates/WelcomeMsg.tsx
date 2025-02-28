'use client'

import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData'

export const WelcomeMsg = () => {
    const { currentUser, loading } = useNetworkData()

    return (
        <div className='space-y-2 mb-4'>
            <h2 className='text-2xl lg:text-3xl text-white font-medium'>
                Bem-vindo de Volta{loading ? ', ' : ' '}{currentUser?.name} 😄 
            </h2>
            <p className='text-sm lg:text-base text-cyan-100 dark:text-cyan-400'>
                Este é seu relatório de visão geral do H24
            </p>
        </div>
    )
}