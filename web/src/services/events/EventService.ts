/* eslint-disable @typescript-eslint/no-explicit-any */
type EventCallback = (...args: any[]) => void;

/**
 * Serviço simples de eventos para comunicação entre componentes
 * que não estão diretamente relacionados na hierarquia de componentes
 */
class EventService {
  private events: Record<string, EventCallback[]> = {};

  /**
   * Registra um callback para um evento específico
   */
  subscribe(eventName: string, callback: EventCallback): () => void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);

    // Retorna uma função para desinscrever o callback
    return () => {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    };
  }

  /**
   * Emite um evento com os argumentos fornecidos
   */
  emit(eventName: string, ...args: any[]): void {
    if (!this.events[eventName]) return;

    this.events[eventName].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event callback for ${eventName}:`, error);
      }
    });
  }

  /**
   * Remove todos os callbacks para um evento específico
   */
  clearEvent(eventName: string): void {
    delete this.events[eventName];
  }

  /**
   * Remove todos os callbacks para todos os eventos
   */
  clearAllEvents(): void {
    this.events = {};
  }
}

// Exporta uma instância única do serviço
export const eventService = new EventService();