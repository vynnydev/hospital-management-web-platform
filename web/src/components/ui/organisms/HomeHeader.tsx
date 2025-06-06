import React from 'react'
import Link from 'next/link'
import { BaseComponent, MenuItem, Role } from '@/types/maps'
import { Brand } from '../atoms/Brand'
import { Container } from '../atoms/Container'
import { Button } from '../atoms/Button'
import { NavSidebar } from './NavSidebar'
import { Menus } from './Menus'

export type IHeaderProps = {
  type?: Role
  menuItems: MenuItem[]
} & BaseComponent

export const HomeHeader = ({ type, menuItems }: IHeaderProps) => {
  return (
    <header>
      <nav className="fixed z-40 top-0 w-full shadow-md bg-white/50 backdrop-blur-md max-md:px-6 max-lg:px-6">
        <Container className="relative flex items-center justify-between h-16 py-2 gap-16">
          <Link href="/" aria-label="Home" className="w-auto z-50">
            <Brand type={type} className="hidden h-10 sm:block" />
            <Brand type={type} shortForm className="block sm:hidden" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="text-sm flex gap-2">
                <Menus menuItems={menuItems} />
              </div>
              <NavSidebar menuItems={menuItems} />
            </div>
            {/* <Link href="/sign-up">
              <Button variant="outlined" className="hidden md:block border-cyan-600">
                Registre-se
              </Button>
            </Link> */}
            <Link href="/sign-in">
              <Button className='w-32 border-cyan-600'>Log in</Button>
            </Link>
          </div>
        </Container>
      </nav>
      <div className="h-16" />
    </header>
  )
}