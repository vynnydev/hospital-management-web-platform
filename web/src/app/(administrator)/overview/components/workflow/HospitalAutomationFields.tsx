import React from 'react';
import { Card, CardContent } from "@/components/ui/organisms/card";
import { ETaskParamType } from "@/types/workflow/task";
import { Workflow } from "lucide-react";
import { NodeInput } from './nodes/NodeInputs';
import { NodeOutput } from './nodes/NodeOutputs';

interface IHospitalAutomationFieldsProps {
    nodeId: string
}

export const HospitalAutomationFields = ({ nodeId }: IHospitalAutomationFieldsProps) => {
  return (
    <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 mt-8 rounded-md">
      <div className="flex items-center gap-2 mb-8">
        <Workflow className="h-6 w-6 text-violet-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Automação Hospitalar</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ocupação Máxima
                </label>
                <NodeInput
                  input={{
                    name: "ocupação_maxima",
                    type: ETaskParamType.STRING,
                    label: "Ocupação Máxima",
                  }}
                  nodeId={nodeId}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tempo de Resposta
                </label>
                <NodeInput
                  input={{
                    name: "tempo_resposta",
                    type: ETaskParamType.SELECT,
                    label: "Tempo de Resposta",
                    className: "bg-gray-50 dark:bg-gray-800",
                    options: [
                      { label: "Normal", value: "normal" },
                      { label: "Urgente", value: "urgent" },
                      { label: "Crítico", value: "critical" }
                    ]
                  }}
                  nodeId={nodeId}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-800 border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Outputs</h3>
            <div className="space-y-4">
              <NodeOutput 
                output={{
                  name: "status_leitos",
                  type: ETaskParamType.STRING,
                  label: "Status dos Leitos"
                }}
              />
              <NodeOutput 
                output={{
                  name: "alerta_ocupacao",
                  type: ETaskParamType.STRING,
                  label: "Alerta de Ocupação"
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};