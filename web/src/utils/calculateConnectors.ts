/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/fieldMapping.ts

/**
 * Calcula a pontuação de similaridade entre duas strings usando a distância de Levenshtein
 * 
 * @param str1 Primeira string
 * @param str2 Segunda string
 * @returns Pontuação de similaridade (0-1, onde 1 é igual)
 */
export function calculateSimilarity(str1: string, str2: string): number {
    // Normaliza as strings para minúsculas e remove caracteres especiais
    const normalizeString = (str: string): string => {
      return str
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '');
    };
  
    const s1 = normalizeString(str1);
    const s2 = normalizeString(str2);
  
    // Caso especial: strings vazias ou iguais
    if (s1 === s2) return 1;
    if (s1.length === 0 || s2.length === 0) return 0;
  
    // Implementação da distância de Levenshtein
    const matrix: number[][] = [];
    
    // Inicializar a primeira linha e coluna da matriz
    for (let i = 0; i <= s1.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= s2.length; j++) {
      matrix[0][j] = j;
    }
    
    // Preencher a matriz
    for (let i = 1; i <= s1.length; i++) {
      for (let j = 1; j <= s2.length; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deleção
          matrix[i][j - 1] + 1, // inserção
          matrix[i - 1][j - 1] + cost // substituição
        );
      }
    }
    
    const distance = matrix[s1.length][s2.length];
    const maxLength = Math.max(s1.length, s2.length);
    
    // Converter distância em similaridade normalizada (0-1)
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
}
  
/**
 * Verifica se duas strings referem-se ao mesmo conceito semântico
 * 
 * @param sourceField Campo de origem
 * @param targetField Campo alvo
 * @returns Verdadeiro se os campos tiverem alta probabilidade de serem equivalentes
 */
export function areSemanticallyEquivalent(sourceField: string, targetField: string): boolean {
    // Normaliza e extrai palavras-chave
    const normalizeField = (field: string): string[] => {
      const normalized = field
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/[\s_-]+/g, ' ')
        .trim();
      
      // Remover palavras comuns que não são significativas
      const stopWords = ['a', 'an', 'the', 'o', 'os', 'a', 'as', 'de', 'da', 'das', 'do', 'dos', 'e', 'em', 'para', 'por'];
      return normalized
        .split(' ')
        .filter(word => !stopWords.includes(word) && word.length > 1);
    };
  
    const sourceWords = normalizeField(sourceField);
    const targetWords = normalizeField(targetField);
  
    // Verificar se há palavras-chave em comum
    const commonWords = sourceWords.filter(word => targetWords.includes(word));
    if (commonWords.length > 0) {
      return true;
    }
  
    // Verificar similaridade global
    const similarity = calculateSimilarity(sourceField, targetField);
    return similarity > 0.7;  // Limiar para considerar campos similares
  }
  
  /**
   * Lista de abreviações comuns e seus equivalentes completos
   */
  const commonAbbreviations: Record<string, string[]> = {
    'id': ['identifier', 'identificador', 'código', 'code'],
    'num': ['number', 'numero', 'número'],
    'desc': ['description', 'descrição', 'descricao'],
    'addr': ['address', 'endereço', 'endereco'],
    'tel': ['telephone', 'telefone', 'phone'],
    'qty': ['quantity', 'quantidade', 'quant'],
    'amt': ['amount', 'valor', 'montante'],
    'dt': ['date', 'data'],
    'dob': ['dateofbirth', 'birthdate', 'datanascimento', 'datanasc'],
    'fname': ['firstname', 'primeironome', 'nome'],
    'lname': ['lastname', 'sobrenome', 'ultimonome'],
    'cat': ['category', 'categoria'],
    'doc': ['document', 'documento']
};
  
/**
 * Verifica se um campo pode ser uma abreviação de outro
 * 
 * @param field1 Primeiro campo
 * @param field2 Segundo campo
 * @returns Verdadeiro se um for provável abreviação do outro
 */
export function checkAbbreviations(field1: string, field2: string): boolean {
    const f1 = field1.toLowerCase().replace(/[^a-z]/g, '');
    const f2 = field2.toLowerCase().replace(/[^a-z]/g, '');
    
    // Verificar se um é prefixo do outro
    if (f2.startsWith(f1) || f1.startsWith(f2)) {
      return true;
    }
    
    // Verificar abreviações conhecidas
    for (const [abbr, fullForms] of Object.entries(commonAbbreviations)) {
      const isField1Abbr = f1 === abbr || f1.includes(abbr);
      const isField2Abbr = f2 === abbr || f2.includes(abbr);
      
      if (isField1Abbr && fullForms.some(full => f2.includes(full))) return true;
      if (isField2Abbr && fullForms.some(full => f1.includes(full))) return true;
    }
    
    return false;
}
  
/**
 * Analisa campos de um dataset e sugere mapeamentos para campos do sistema
 * 
 * @param sourceFields Lista de campos do dataset de origem
 * @param targetFields Lista de campos do sistema de destino
 * @returns Mapeamentos sugeridos com pontuação de confiança
 */
export function suggestFieldMappings(
    sourceFields: string[],
    targetFields: string[]
): Array<{ sourceField: string; suggestedTargetField: string; confidence: number }> {
    const suggestions: Array<{ sourceField: string; suggestedTargetField: string; confidence: number }> = [];
    
    for (const sourceField of sourceFields) {
      let bestMatch = '';
      let bestConfidence = 0;
      
      for (const targetField of targetFields) {
        // Calcular similaridade direta
        let confidence = calculateSimilarity(sourceField, targetField);
        
        // Aumentar confiança se forem semanticamente equivalentes
        if (areSemanticallyEquivalent(sourceField, targetField)) {
          confidence = Math.max(confidence, 0.8);
        }
        
        // Verificar abreviações
        if (checkAbbreviations(sourceField, targetField)) {
          confidence = Math.max(confidence, 0.75);
        }
        
        // Atualizar melhor correspondência
        if (confidence > bestConfidence && confidence > 0.4) {
          bestMatch = targetField;
          bestConfidence = confidence;
        }
      }
      
      if (bestMatch) {
        suggestions.push({
          sourceField,
          suggestedTargetField: bestMatch,
          confidence: bestConfidence
        });
      }
    }
    
    return suggestions;
}
  
/**
 * Analisa uma amostra de dados e extrai os campos disponíveis
 * 
 * @param data Amostra de dados (objeto ou array)
 * @returns Lista de campos encontrados
 */
export function extractFieldsFromSample(data: any): string[] {
    // Para arrays, usar o primeiro item
    if (Array.isArray(data) && data.length > 0) {
      return extractFieldsFromSample(data[0]);
    }
    
    // Para objetos, extrair chaves recursivamente
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const fields: string[] = [];
      
      for (const [key, value] of Object.entries(data)) {
        fields.push(key);
        
        // Recursão para objetos aninhados
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          const nestedFields = extractFieldsFromSample(value);
          fields.push(...nestedFields.map(field => `${key}.${field}`));
        }
      }
      
      return fields;
    }
    
    return [];
}
  
/**
 * Funções de transformação para ajudar no mapeamento de campos
 */
export const transformFunctions = {
    /**
     * Converte uma string para minúsculas
     */
    toLowerCase: (value: string): string => value.toLowerCase(),
    
    /**
     * Converte uma string para maiúsculas
     */
    toUpperCase: (value: string): string => value.toUpperCase(),
    
    /**
     * Extrai o primeiro nome de um nome completo
     */
    extractFirstName: (fullName: string): string => {
      const parts = fullName.trim().split(/\s+/);
      return parts[0] || '';
    },
    
    /**
     * Extrai o último nome de um nome completo
     */
    extractLastName: (fullName: string): string => {
      const parts = fullName.trim().split(/\s+/);
      return parts.length > 1 ? parts[parts.length - 1] : '';
    },
    
    /**
     * Formata um CPF com máscara
     */
    formatCPF: (cpf: string): string => {
      const cleaned = cpf.replace(/\D/g, '');
      if (cleaned.length !== 11) return cpf;
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    
    /**
     * Formata um CNPJ com máscara
     */
    formatCNPJ: (cnpj: string): string => {
      const cleaned = cnpj.replace(/\D/g, '');
      if (cleaned.length !== 14) return cnpj;
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    },
    
    /**
     * Formata um telefone com máscara
     */
    formatPhone: (phone: string): string => {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length < 10) return phone;
      if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    },
    
    /**
     * Formata uma data no padrão brasileiro
     */
    formatDateBR: (date: string): string => {
      if (!date) return '';
      
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return date;
        
        return d.toLocaleDateString('pt-BR');
      } catch {
        return date;
      }
    },
    
    /**
     * Converte uma data para o formato ISO
     */
    formatDateISO: (date: string): string => {
      if (!date) return '';
      
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return date;
        
        return d.toISOString().split('T')[0];
      } catch {
        return date;
      }
    }
};