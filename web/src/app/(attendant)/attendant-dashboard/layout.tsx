// app/(platform)/layout.tsx
import { Header } from "@/components/ui/organisms/Header"
import { FooterApplication } from "@/components/ui/templates/FooterApplication"

import { TooltipProvider } from '@/components/ui/organisms/tooltip';

type Props = {
    children: React.ReactNode
}

const AttendantDashbaordLayout = ({ children }: Props) => {
    return (
        <div>
            <Header />
            <main className="px-3 lg:px-14">
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </main>
            <FooterApplication />
        </div>
    )
}

export default AttendantDashbaordLayout