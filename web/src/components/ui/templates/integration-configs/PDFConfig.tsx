/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Info, FileText } from 'lucide-react';

// Interface para os dados de configuração do PDF
export interface PDFConfig {
  outputPath: string;
  defaultSize: 'a4' | 'letter' | 'legal';
  defaultOrientation: 'portrait' | 'landscape';
  compression: boolean;
  compressionLevel: number; // 1-9
  encryption: boolean;
  password: string;
  securityLevel: 'low' | 'medium' | 'high';
  addWatermark: boolean;
  watermarkText: string;
  watermarkOpacity: number; // 0-100
  addHeader: boolean;
  addFooter: boolean;
  headerText: string;
  footerText: string;
  includePageNumbers: boolean;
  includeDateTime: boolean;
  fontFamily: string;
  fontSize: number;
  includeLogo: boolean;
  logoPosition: 'left' | 'center' | 'right';
  enableSignatures: boolean;
}

interface PDFConfigProps {
  config?: Partial<PDFConfig>;
  onChange: (config: Partial<PDFConfig>) => void;
}

export const PDFConfig: React.FC<PDFConfigProps> = ({
  config = {},
  onChange
}) => {
  // Estado local para gerenciar as configurações
  const [settings, setSettings] = useState<Partial<PDFConfig>>({
    outputPath: '/exports/pdf',
    defaultSize: 'a4',
    defaultOrientation: 'portrait',
    compression: true,
    compressionLevel: 6,
    encryption: false,
    password: '',
    securityLevel: 'medium',
    addWatermark: false,
    watermarkText: 'CONFIDENCIAL',
    watermarkOpacity: 30,
    addHeader: true,
    addFooter: true,
    headerText: 'Hospital System',
    footerText: '© {year} Hospital System',
    includePageNumbers: true,
    includeDateTime: true,
    fontFamily: 'Arial',
    fontSize: 11,
    includeLogo: true,
    logoPosition: 'left',
    enableSignatures: false,
    ...config
  });

  // Função para atualizar as configurações
  const updateSettings = (updates: Partial<PDFConfig>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onChange(newSettings);
  };

  // Função para alternar configurações booleanas
  const toggleSetting = (key: keyof PDFConfig) => {
    updateSettings({ [key]: !settings[key] } as any);
  };

  // Opções de fontes disponíveis
  const fontOptions = [
    'Arial', 'Times New Roman', 'Courier New', 'Verdana', 
    'Tahoma', 'Calibri', 'Helvetica', 'Roboto'
  ];

  return (
    <div className="space-y-6 lg:h-[500px] overflow-y-scroll">
      {/* Configurações Básicas */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações Básicas</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="output-path" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Diretório de Saída
            </label>
            <div className="mt-1">
              <input
                id="output-path"
                type="text"
                value={settings.outputPath}
                onChange={(e) => updateSettings({ outputPath: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="/pasta/exportacao/pdf"
                autoComplete="off"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Local onde os relatórios PDF serão salvos
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="default-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tamanho Padrão
              </label>
              <div className="mt-1">
                <select
                  id="default-size"
                  value={settings.defaultSize}
                  onChange={(e) => updateSettings({ defaultSize: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Carta</option>
                  <option value="legal">Ofício</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="default-orientation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Orientação
              </label>
              <div className="mt-1">
                <select
                  id="default-orientation"
                  value={settings.defaultOrientation}
                  onChange={(e) => updateSettings({ defaultOrientation: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                >
                  <option value="portrait">Retrato</option>
                  <option value="landscape">Paisagem</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="font-family" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fonte
              </label>
              <div className="mt-1">
                <select
                  id="font-family"
                  value={settings.fontFamily}
                  onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tamanho da Fonte
              </label>
              <div className="mt-1">
                <input
                  id="font-size"
                  type="number"
                  min="8"
                  max="16"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Cabeçalho e Rodapé */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cabeçalho e Rodapé</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Incluir Cabeçalho</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adicionar cabeçalho em todas as páginas
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('addHeader')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.addHeader ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.addHeader ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {settings.addHeader && (
            <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800">
              <div>
                <label htmlFor="header-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Texto do Cabeçalho
                </label>
                <div className="mt-1">
                  <input
                    id="header-text"
                    type="text"
                    value={settings.headerText}
                    onChange={(e) => updateSettings({ headerText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="mt-2 flex items-center space-x-2">
                <input
                  id="include-logo"
                  type="checkbox"
                  checked={settings.includeLogo}
                  onChange={() => toggleSetting('includeLogo')}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="include-logo" className="text-sm text-gray-700 dark:text-gray-300">
                  Incluir logo
                </label>
              </div>

              {settings.includeLogo && (
                <div className="mt-2">
                  <label htmlFor="logo-position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Posição da Logo
                  </label>
                  <div className="mt-1">
                    <select
                      id="logo-position"
                      value={settings.logoPosition}
                      onChange={(e) => updateSettings({ logoPosition: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    >
                      <option value="left">Esquerda</option>
                      <option value="center">Centro</option>
                      <option value="right">Direita</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Incluir Rodapé</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adicionar rodapé em todas as páginas
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('addFooter')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.addFooter ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.addFooter ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {settings.addFooter && (
            <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800">
              <div>
                <label htmlFor="footer-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Texto do Rodapé
                </label>
                <div className="mt-1">
                  <input
                    id="footer-text"
                    type="text"
                    value={settings.footerText}
                    onChange={(e) => updateSettings({ footerText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    autoComplete="off"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use {'{year}'} para incluir o ano atual
                </p>
              </div>

              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="include-page-numbers"
                    type="checkbox"
                    checked={settings.includePageNumbers}
                    onChange={() => toggleSetting('includePageNumbers')}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label htmlFor="include-page-numbers" className="text-sm text-gray-700 dark:text-gray-300">
                    Números de página
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="include-date-time"
                    type="checkbox"
                    checked={settings.includeDateTime}
                    onChange={() => toggleSetting('includeDateTime')}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label htmlFor="include-date-time" className="text-sm text-gray-700 dark:text-gray-300">
                    Data e hora
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configurações de Segurança */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Segurança e Marca d&apos;água</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Compressão</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comprimir o arquivo PDF para reduzir o tamanho
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('compression')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.compression ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.compression ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {settings.compression && (
            <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800">
              <label htmlFor="compression-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nível de Compressão
              </label>
              <div className="mt-1">
                <input
                  id="compression-level"
                  type="range"
                  min="1"
                  max="9"
                  value={settings.compressionLevel}
                  onChange={(e) => updateSettings({ compressionLevel: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Menor (Mais rápido)</span>
                  <span>Maior (Mais lento)</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Criptografia</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Proteger o PDF com senha
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('encryption')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.encryption ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.encryption ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {settings.encryption && (
            <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800 space-y-3">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha de Proteção
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    value={settings.password}
                    onChange={(e) => updateSettings({ password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="security-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nível de Segurança
                </label>
                <div className="mt-1">
                  <select
                    id="security-level"
                    value={settings.securityLevel}
                    onChange={(e) => updateSettings({ securityLevel: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                  >
                    <option value="low">Baixo - Apenas Abertura</option>
                    <option value="medium">Médio - Impedir Edição</option>
                    <option value="high">Alto - Restringir Impressão e Cópia</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Marca d&apos;água</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adicionar texto em marca d&apos;água nas páginas
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('addWatermark')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.addWatermark ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.addWatermark ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {settings.addWatermark && (
            <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800 space-y-3">
              <div>
                <label htmlFor="watermark-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Texto da Marca d&apos;água
                </label>
                <div className="mt-1">
                  <input
                    id="watermark-text"
                    type="text"
                    value={settings.watermarkText}
                    onChange={(e) => updateSettings({ watermarkText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="watermark-opacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Opacidade ({settings.watermarkOpacity}%)
                </label>
                <div className="mt-1">
                  <input
                    id="watermark-opacity"
                    type="range"
                    min="10"
                    max="90"
                    value={settings.watermarkOpacity}
                    onChange={(e) => updateSettings({ watermarkOpacity: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assinaturas Digitais */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Assinaturas Digitais</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Habilitar Assinaturas</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permitir a integração com assinaturas digitais
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('enableSignatures')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.enableSignatures ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.enableSignatures ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {settings.enableSignatures && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Para utilizar assinaturas digitais, você também precisa configurar a integração com DocSign ou outro serviço de assinatura digital.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview do PDF */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview do Documento</h3>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {(settings.defaultSize ?? 'a4').toUpperCase()} - {settings.defaultOrientation === 'portrait' ? 'Retrato' : 'Paisagem'}
              </span>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 flex justify-center">
            <div 
              className={`border border-gray-300 dark:border-gray-700 ${
                settings.defaultOrientation === 'portrait' ? 'w-48 h-64' : 'w-64 h-48'
              }`}
            >
              {/* Simulação de Cabeçalho */}
              {settings.addHeader && (
                <div className="border-b border-gray-300 dark:border-gray-700 p-2 text-xs text-center">
                  {settings.includeLogo && (
                    <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 mb-1 mx-auto rounded"></div>
                  )}
                  {settings.headerText}
                </div>
              )}
              
              {/* Corpo */}
              <div className="p-2 flex-grow text-xs text-gray-400 dark:text-gray-600 flex items-center justify-center">
                {settings.addWatermark && (
                  <div className="absolute transform rotate-45 text-gray-200 dark:text-gray-700 text-sm" style={{ opacity: (settings.watermarkOpacity ?? 100) / 100 }}>
                    {settings.watermarkText}
                  </div>
                )}
                <span>Conteúdo do documento</span>
              </div>
              
              {/* Rodapé */}
              {settings.addFooter && (
                <div className="border-t border-gray-300 dark:border-gray-700 p-1 text-[8px] text-gray-500 dark:text-gray-500 flex justify-between">
                  <span>{(settings.footerText ?? '').replace('{year}', new Date().getFullYear().toString())}</span>
                  {settings.includePageNumbers && <span>Página 1 de 1</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Aviso */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start">
        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium mb-1">Observação</p>
          <p>
            Documentos médicos em PDF podem exigir conformidade com regulamentações específicas de privacidade e segurança.
            Recomendamos a utilização de criptografia para qualquer documento que contenha informações sensíveis de pacientes.
          </p>
        </div>
      </div>
    </div>
  );
};