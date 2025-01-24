/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowEditor } from "./FlowEditor";
import { FlowValidationContextProvider } from "@/components/ui/context/FlowValidationContext";
import { NetworkData } from "@/types/hospital-network-types";

interface EditorProps {
  networkData: NetworkData; // Adicionando networkData como prop
}

export const Editor = ({ networkData }: EditorProps) => {
  return (
    <ReactFlowProvider>
      <FlowValidationContextProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <section className="flex h-full overflow-auto">
            <FlowEditor networkData={networkData} />
          </section>
        </div>
      </FlowValidationContextProvider>
    </ReactFlowProvider>
  );
};