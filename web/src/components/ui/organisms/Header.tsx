// components/ui/organisms/Header.tsx
'use client'
import { UserButton } from "@clerk/nextjs"
import { Loader2, Moon, Sun } from 'lucide-react'
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { useTheme } from 'next-themes'

import { Brand } from "@/components/ui/atoms/Brand"
import { HeaderNavigation } from "@/components/ui/organisms/HeaderNavigation"
import { WelcomeMsg } from "@/components/ui/templates/WelcomeMsg"
import { Button } from "@/components/ui/button"

export const Header = () => {
    const { theme, setTheme } = useTheme();

    return (
        <header className={`px-4 py-8 lg:px-14 pb-36
            ${theme === 'dark'
                ? 'bg-[linear-gradient(135deg,#1E293B,#164E63)] shadow-[0_0_20px_rgba(30,41,59,0.5),0_0_40px_rgba(22,78,99,0.3)]'
                : 'bg-[linear-gradient(135deg,#E0F2FE,#A5F3FC)] shadow-lg'
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
                                : 'bg-[linear-gradient(135deg,#BAE6FD,#99F6E4)] shadow-lg'
                            }
                        `}
                    >
                        {theme === 'dark' 
                            ? <Sun className="h-[1.2rem] w-[1.2rem] relative z-10" />
                            : <Moon className="h-[1.2rem] w-[1.2rem] relative z-10" />
                        }
                    </Button>
                        <ClerkLoaded>
                            <UserButton 
                                signInUrl="/sign-in"
                                appearance={{
                                    elements: {
                                        avatarBox: "border-2 border-white dark:border-green-200"
                                    }
                                }}
                            />
                        </ClerkLoaded>
                        <ClerkLoading>
                            <Loader2 className="size-8 animate-spin text-white dark:text-green-200"/>
                        </ClerkLoading>
                    </div>
                </div>
                <WelcomeMsg />
            </div>
        </header>
    )
}
