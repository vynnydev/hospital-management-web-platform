'use client'
import Image from 'next/image'
import { SignInForm } from "@/components/ui/templates/SignInForm";
import { Container } from "@/components/ui/atoms/Container";
import { HomeHeader } from "@/components/ui/organisms/HomeHeader";
import { Toaster } from "@/components/ui/organisms/toaster";

export default function SignInPage() {
  return (
    <>
      <HomeHeader menuItems={[{ label: 'Entenda a Rede D\'Or', href: '/site' }]} />
      <Container>        
        <div className='absolute min-h-screen left-0 right-0 top-0 bottom-0 grid grid-cols-1 lg:grid-cols-2'>
          <div className='h-full lg:flex flex-col items-center justify-center px-4'>
            <div className='text-center space-y-4 mb-8'>
              <h1 className="font-bold text-3xl bg-gradient-to-r from-blue-700 to-cyan-700 text-transparent bg-clip-text">
                Bem vindo de volta!
              </h1>
              {/* <p className='text-base text-[#7E8CA0]'>
                Faça login ou crie uma conta para voltar ao seu painel de controle 
              </p> */}
            </div>
            <SignInForm />
          </div>
          <div className='h-full bg-cyan-700 hidden lg:flex items-center justify-center'>
            <Image src='/hospital-logo.png' height={300} width={300} alt='logo'/>
          </div>
        </div>
      </Container>
      <Toaster className="fixed top-4 left-1/2 transform -translate-x-1/2" />
    </>
  );
}