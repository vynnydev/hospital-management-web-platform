'use client'
import Image from 'next/image'
import { SignInForm } from "@/components/ui/templates/SignInForm"
import { Container } from "@/components/ui/atoms/Container"
import { HomeHeader } from "@/components/ui/organisms/HomeHeader"
import { Toaster } from "@/components/ui/organisms/toaster"

export default function SignInPage() {
  return (
    <>
      <HomeHeader menuItems={[{ label: `Entenda o Cognitiva`, href: '/site' }]} />
      <Container>        
        <div className='absolute min-h-screen left-0 right-0 top-0 bottom-0 grid grid-cols-1 lg:grid-cols-2'>
          
          <SignInForm />

          <div className='h-full bg-cyan-700 hidden lg:flex items-center justify-center'>
            <Image src='/hospital-logo.png' height={300} width={300} alt='logo' priority />
          </div>
        </div>
      </Container>
      <Toaster /> {/* Removida a className redundante */}
    </>
  )
}