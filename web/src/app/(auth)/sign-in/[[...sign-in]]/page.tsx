'use client'
import Image from 'next/image'
import { SignInForm } from "@/components/ui/templates/SignInForm"
import { Container } from "@/components/ui/atoms/Container"
import { HomeHeader } from "@/components/ui/organisms/HomeHeader"
import { Toaster } from "@/components/ui/organisms/toaster"

export default function SignInPage() {
  return (
    <>
      <HomeHeader menuItems={[{ label: `Entenda o H24`, href: '/site' }]} />
      <Container>        
        <div className='absolute min-h-screen left-0 right-0 top-0 bottom-0 grid grid-cols-1 lg:grid-cols-2'>
          <div className='h-full lg:flex flex-col items-center justify-center px-4'>
            <div className='text-center space-y-4 mb-8'>
              <h1 className="font-bold text-3xl bg-gradient-to-r from-blue-700 to-cyan-700 text-transparent bg-clip-text">
                Bem vindo de volta!
              </h1>
            </div>
            <SignInForm />
          </div>
          <div className='h-full bg-cyan-700 hidden lg:flex items-center justify-center'>
            <Image src='/hospital-logo.png' height={300} width={300} alt='logo' priority />
          </div>
        </div>
      </Container>
      <Toaster /> {/* Removida a className redundante */}
    </>
  )
}