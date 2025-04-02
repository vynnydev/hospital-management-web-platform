import React from 'react'
import { Home } from '@/components/ui/templates/Home'

import { Container } from "@/components/ui/atoms/Container"

import { MenuItem } from "@/types/maps"
import { HomeHeader } from "@/components/ui/organisms/HomeHeader"

const MENUITEMS: MenuItem[] = [
  { label: 'Entenda a Cognitiva', href: '/site' }
]

const HomePage = () => {
  return (
    <>
      <HomeHeader menuItems={MENUITEMS} />
      <Container>
        <Home />
      </Container>
    </>
  )
}

export default HomePage