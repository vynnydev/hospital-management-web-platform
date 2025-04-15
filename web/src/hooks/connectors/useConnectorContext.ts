import { IConnectorContextProps } from "@/types/connectors-types";
import { createContext, useContext } from "react";

// Criar o contexto
const ConnectorContext = createContext<IConnectorContextProps | undefined>(undefined);

export const useConnectorContext = () => {
    const context = useContext(ConnectorContext);
    if (context === undefined) {
      throw new Error('useConnectorContext deve ser usado dentro de um ConnectorProvider');
    }
    return context;
};