import React from 'react'
import { HeroSection } from './components/HeroSection/HeroSection'
import { AboutSection } from './components/AboutSection/AboutSection'
import { ControlAgricultureSection } from './components/ControlAgricultureSection/ControlAgricultureSection'
import { ServicesSection } from './components/ServicesSection/ServicesSection'
import { WhyChooseUsSections } from './components/WhyChooseUsSections/WhyChooseUsSections'
import { FrequentlyAskedQuestions } from './components/FrequentlyAskedQuestions/FrequentlyAskedQuestions'
import { Footer } from './components/Footer/Footer'
import { JoinUsSection } from './components/JoinUsSection/JoinUsSection'
import MediMindAIAssistantSection from './components/MediMindAIAssistantSection/MediMindAIAssistantSection'
import AccessibilityAssistantSection from './components/AccessibilityAssistantSection/AccessibilityAssistantSection'

export const HomeSite = () => {
    return (
        <div>
            <HeroSection />
            <AboutSection />
            <ControlAgricultureSection />
            <ServicesSection />
            <MediMindAIAssistantSection />
            <WhyChooseUsSections />
            <AccessibilityAssistantSection />
            <FrequentlyAskedQuestions />
            <JoinUsSection />
            <Footer />
        </div>
    )
}