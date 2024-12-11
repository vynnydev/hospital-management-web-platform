import React from 'react'
import { Home } from '@/components/ui/templates/Home'

import { Container } from "@/components/ui/atoms/Container"

import { MenuItem } from "@/utils/types"
import { HomeHeader } from "@/components/ui/organisms/HomeHeader"

const MENUITEMS: MenuItem[] = [
  { label: 'Entenda a TerraFarming', href: '/site' }
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