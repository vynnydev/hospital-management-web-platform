import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/organisms/accordion";
import { Button } from "@/components/ui/organisms/button";
import { Badge } from "@/components/ui/organisms/badge";
import { 
  BedDouble, 
  Users, 
  Activity,
  Brain,
  HeartPulse,
  AlertTriangle,
  Settings2
} from "lucide-react";

export const HospitalFlowAutomationMenu = () => {
  return (
    <aside className="w-full border-2 border-gray-600 dark:border-gray-600 
            rounded-lg h-full p-6 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 
            dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 
            dark:hover:scrollbar-thumb-gray-500 dark:bg-gray-800">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-white">Menu de Controle</h2>
        <p className="text-sm text-gray-300">Gerencie as funcionalidades do hospital</p>
      </div>

      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "patient-management",
          "bed-management",
          "analytics",
          "automation"
        ]}
      >
        <AccordionItem value="patient-management">
          <AccordionTrigger className="font-bold text-white">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-blue-400" />
              Gestão de Pacientes
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <HospitalMenuBtn icon={Users} label="Admissão" bgColor="bg-blue-500" hoverColor="hover:bg-blue-600" />
            <HospitalMenuBtn icon={HeartPulse} label="Monitoramento" bgColor="bg-purple-500" hoverColor="hover:bg-purple-600" />
            <HospitalMenuBtn icon={Activity} label="Alta" bgColor="bg-green-500" hoverColor="hover:bg-green-600" />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="bed-management">
          <AccordionTrigger className="font-bold text-white">
            <div className="flex items-center gap-2">
              <BedDouble size={20} className="text-indigo-400" />
              Gestão de Leitos
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <HospitalMenuBtn icon={BedDouble} label="Ocupação" bgColor="bg-indigo-500" hoverColor="hover:bg-indigo-600" />
            <HospitalMenuBtn icon={AlertTriangle} label="Gestão de Risco" bgColor="bg-red-500" hoverColor="hover:bg-red-600" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="analytics">
          <AccordionTrigger className="font-bold text-white">
            <div className="flex items-center gap-2">
              <Brain size={20} className="text-cyan-400" />
              Análise Preditiva
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <HospitalMenuBtn icon={Brain} label="Previsão de Demanda" bgColor="bg-cyan-500" hoverColor="hover:bg-cyan-600" />
            <HospitalMenuBtn icon={Activity} label="Indicadores" bgColor="bg-teal-500" hoverColor="hover:bg-teal-600" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="automation">
          <AccordionTrigger className="font-bold text-white">
            <div className="flex items-center gap-2">
              <Settings2 size={20} className="text-orange-400" />
              Automação
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <HospitalMenuBtn icon={Settings2} label="Configurar Automação" bgColor="bg-orange-500" hoverColor="hover:bg-orange-600" />
            <HospitalMenuBtn icon={AlertTriangle} label="Alertas" bgColor="bg-amber-500" hoverColor="hover:bg-amber-600" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

interface HospitalMenuBtnProps {
  icon: React.ElementType;
  label: string;
  bgColor: string;
  hoverColor: string;
}

function HospitalMenuBtn({ 
  icon: Icon, 
  label,
  bgColor,
  hoverColor
}: HospitalMenuBtnProps) {
  return (
    <Button
      variant="secondary"
      className={`flex justify-between items-center gap-2 w-full text-white ${bgColor} ${hoverColor} border-0`}
    >
      <div className="flex gap-2 items-center">
        <Icon size={20} />
        {label}
      </div>
      <Badge 
        className="bg-white/20 text-white" 
        variant="secondary"
      >
        Novo
      </Badge>
    </Button>
  );
}