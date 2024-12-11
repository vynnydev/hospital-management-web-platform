import React from 'react'
import { Home } from '@/components/ui/templates/Home'

import { Container } from "@/components/ui/atoms/Container"

import { MenuItem } from "@/utils/types"
import { HomeHeader } from "@/components/ui/organisms/HomeHeader"

const MENUITEMS: MenuItem[] = [
  { label: 'Entenda a H24', href: '/site' }
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