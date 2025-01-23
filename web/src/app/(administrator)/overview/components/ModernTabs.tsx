import { IntegrationsPreviewPressable } from "@/components/ui/organisms/IntegrationsPreviewPressable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/organisms/tabs";
import { Home, Activity, MessageSquare, Map } from "lucide-react";
import { useState } from "react";

interface ModernTabsProps {
  children: {
    overview: React.ReactNode;
    hospitalsLocations: React.ReactNode;
    analytics: React.ReactNode;
    messageCenter: React.ReactNode;
  };
}

export const ModernTabs: React.FC<ModernTabsProps> = ({ children }) => {
    const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    
  return (
    <Tabs defaultValue="overview" className="w-full p-4">
      <div className="flex flex-row mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50 mb-2">
            Explore todos os recursos
          </h2>
          <p className="text-slate-400">
            Gerencie e monitore todas as informações do seu hospital
          </p>
        </div>

        {/* Deixar mostrando no maximo 5 com o plus */}
        <div className='ml-[830px] py-2'>
          <IntegrationsPreviewPressable 
            onSelectIntegration={() => {
              setIsIntegrationsOpen(true);
              setActiveSection('integrations');
            }} 
          />
        </div>
      </div>


      <TabsList className="grid grid-cols-4 gap-4 bg-transparent p-0 mb-8 pt-6">
        {[
          {
            value: "overview",
            label: "Visão Geral",
            icon: Home,
            gradient: "from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30"
          },
          {
            value: "hospitals-locations",
            label: "Localização",
            icon: Map,
            gradient: "from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30"
          },
          {
            value: "analytics",
            label: "Analises AI",
            icon: Activity,
            gradient: "from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30"
          },
          {
            value: "message-center",
            label: "Comunicação",
            icon: MessageSquare,
            gradient: "from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30"
          }
        ].map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`
              relative overflow-hidden rounded-2xl border-0 bg-gradient-to-r ${tab.gradient}
              p-4 text-slate-300 transition-all duration-300
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-800 data-[state=active]:to-slate-700
              data-[state=active]:text-white data-[state=active]:shadow-lg
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <tab.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{tab.label}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-16">
        <TabsContent 
            value="overview"
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
        >
            {children.overview}
        </TabsContent>

        <TabsContent 
            value="hospitals-locations"
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
        >
            {children.hospitalsLocations}
        </TabsContent>

        <TabsContent 
            value="analytics"
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
        >
            {children.analytics}
        </TabsContent>

        <TabsContent 
            value="message-center"
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
        >
            {children.messageCenter}
        </TabsContent>
      </div>
    </Tabs>
  );
};