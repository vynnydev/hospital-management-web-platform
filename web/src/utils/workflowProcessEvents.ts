// Utilitário para lidar com eventos de workflow de forma centralizada

/**
 * Dispara um evento de início de processo de workflow
 * @param name Nome do processo ou departamento
 */
export const triggerProcessStarted = (name: string): void => {
    // Criar um novo evento com detalhes
    const processStartedEvent = new CustomEvent('workflow-process-started', {
      detail: { name }
    });
    
    // Disparar o evento
    console.log('Disparando evento: workflow-process-started', { name });
    window.dispatchEvent(processStartedEvent);
  };
  
  /**
   * Dispara um evento de cancelamento de processo de workflow
   */
  export const triggerProcessCanceled = (): void => {
    // Criar um novo evento
    const processCanceledEvent = new CustomEvent('workflow-process-canceled');
    
    // Disparar o evento
    console.log('Disparando evento: workflow-process-canceled');
    window.dispatchEvent(processCanceledEvent);
  };
  
  /**
   * Registra uma função para ser chamada quando um processo é iniciado
   * @param callback Função a ser chamada quando o processo inicia
   * @returns Função para remover o event listener
   */
  export const onProcessStarted = (callback: (event: CustomEvent) => void): (() => void) => {
    const wrappedCallback = (e: Event) => {
      callback(e as CustomEvent);
    };
    
    window.addEventListener('workflow-process-started', wrappedCallback);
    
    // Retornar função para limpar o listener
    return () => {
      window.removeEventListener('workflow-process-started', wrappedCallback);
    };
  };
  
  /**
   * Registra uma função para ser chamada quando um processo é cancelado
   * @param callback Função a ser chamada quando o processo é cancelado
   * @returns Função para remover o event listener
   */
  export const onProcessCanceled = (callback: () => void): (() => void) => {
    window.addEventListener('workflow-process-canceled', callback);
    
    // Retornar função para limpar o listener
    return () => {
      window.removeEventListener('workflow-process-canceled', callback);
    };
  };