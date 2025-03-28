'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface NavButtonProps {
    href: string
    label: string
    isActive?: boolean
    icon?: LucideIcon
}

export const NavButton = ({
    href,
    label,
    isActive,
    icon: Icon,
}: NavButtonProps) => {
    return (
        <Link 
            href={href}
            className={cn(
                'flex px-2',
                'text-sm font-medium rounded-full px-3 py-2 transition-all duration-300 ease-in-out relative',
                'hover:bg-white/20 hover:text-white',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400',
                isActive 
                    ? 'text-white bg-white/20' 
                    : 'text-white/60'
            )}
        >
            <span className="flex items-center">
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {label}
            </span>
            {isActive && (
                <span className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full" />
            )}
        </Link>
    )
}