/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/aiMappingService.ts
import axios from 'axios';

/**
 * Resultado do mapeamento de campos por IA
 */
export interface AIMappingResult {
  mappings: Array<{
    sourceField: string;
    targetField: string;
    confidence: number;
    explanation?: string;
  }>;
  transformations?: Array<{
    sourceField: string;
    targetField: string;
    transformation: string;
    explanation?: string;
  }>;
}

/**
 * Interface para o serviço de mapeamento com IA
 */
class AIMappingService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl = '/api/v1/ai', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Configura o serviço com uma nova URL base ou chave de API
   */
  configure(config: { baseUrl?: string; apiKey?: string }) {
    if (config.baseUrl) this.baseUrl = config.baseUrl;
    if (config.apiKey) this.apiKey = config.apiKey;
  }

  /**
   * Analisa e mapeia campos usando IA
   */
  async mapFields(
    sourceFields: string[],
    targetFields: string[],
    sampleData?: Record<string, any>
  ): Promise<AIMappingResult> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.apiKey) {
        headers['x-api-key'] = this.apiKey;
      }

      const response = await axios.post(
        `${this.baseUrl}/map-fields`,
        {
          sourceFields,
          targetFields,
          sampleData
        },
        { headers }
      );

      return response.data.data;
    } catch (error) {
      console.error('Erro ao usar serviço de IA para mapeamento:', error);
      throw new Error('Falha ao processar mapeamento com IA');
    }
  }

  /**
   * Analisa um esquema de dados com IA
   */
  async analyzeSchema(
    schema: Record<string, any> | any[],
    purpose: string
  ): Promise<{
    fields: Array<{ name: string; type: string; description: string; importance: 'high' | 'medium' | 'low' }>;
    recommendations: string[];
  }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.apiKey) {
        headers['x-api-key'] = this.apiKey;
      }

      const response = await axios.post(
        `${this.baseUrl}/analyze-schema`,
        {
          schema,
          purpose
        },
        { headers }
      );

      return response.data.data;
    } catch (error) {
      console.error('Erro ao analisar esquema com IA:', error);
      throw new Error('Falha ao analisar esquema com IA');
    }
  }

  /**
   * Gera um relatório de compatibilidade entre dois conjuntos de dados
   */
  async generateCompatibilityReport(
    sourceData: any,
    targetSchema: any
  ): Promise<{
    compatibilityScore: number;
    issues: Array<{ field: string; issue: string; severity: 'critical' | 'warning' | 'info' }>;
    recommendations: string[];
  }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.apiKey) {
        headers['x-api-key'] = this.apiKey;
      }

      const response = await axios.post(
        `${this.baseUrl}/compatibility-report`,
        {
          sourceData,
          targetSchema
        },
        { headers }
      );

      return response.data.data;
    } catch (error) {
      console.error('Erro ao gerar relatório de compatibilidade:', error);
      throw new Error('Falha ao gerar relatório de compatibilidade');
    }
  }

  /**
   * Adapta/normaliza dados para um formato específico usando IA
   */
  async normalizeData(
    data: any[],
    targetSchema: Record<string, any>,
    mappings: Array<{ source: string; target: string }>
  ): Promise<any[]> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.apiKey) {
        headers['x-api-key'] = this.apiKey;
      }

      const response = await axios.post(
        `${this.baseUrl}/normalize-data`,
        {
          data,
          targetSchema,
          mappings
        },
        { headers }
      );

      return response.data.data.normalizedData;
    } catch (error) {
      console.error('Erro ao normalizar dados com IA:', error);
      throw new Error('Falha ao normalizar dados com IA');
    }
  }

  /**
   * Configura conexão específica com AWS Bedrock
   */
  configureBedrock(config: {
    region?: string;
    modelId?: string;
    credentials?: {
      accessKeyId: string;
      secretAccessKey: string;
    }
  }): void {
    // Em uma implementação real, isso configuraria uma instância do Bedrock
    // Por enquanto, apenas simulamos a configuração
    console.log('Configurando AWS Bedrock com:', config);
  }
}

// Exportar uma instância única do serviço
export const aiMappingService = new AIMappingService();

export default aiMappingService;