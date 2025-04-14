// Interface para os dados de configuração do Microsoft Word
export interface IWordConfig {
  apiKey: string;
  templatePath: string;
  autoSave: boolean;
  defaultFormat: 'docx' | 'doc' | 'pdf';
  headerFooterEnabled: boolean;
  customHeaderText: string;
  customFooterText: string;
  pageNumbering: boolean;
  watermarkText: string;
  watermarkEnabled: boolean;
  fontFamily: string;
  fontSize: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  templates: {
    id: string;
    name: string;
    description: string;
  }[];
}