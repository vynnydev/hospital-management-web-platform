import React, { useState } from 'react';
import { Save, Upload, Palette, AlertTriangle } from 'lucide-react';
import { authService } from '@/services/general/auth/AuthService';
import Image from 'next/image';

export const BrandingContent: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [brandingSettings, setBrandingSettings] = useState({
    brandColor: '#2C68F6',
    secondaryColor: '#10B981',
    useLogo: false,
    customLogoUrl: '',
    hideHospitalName: false,
    hospitalsCustomization: true,
    logoFile: null as File | null
  });

  const isAdmin = authService.isAdministrator();

  const handleColorChange = (colorType: 'brandColor' | 'secondaryColor', value: string) => {
    setBrandingSettings(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  const toggleSetting = (setting: string) => {
    setBrandingSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBrandingSettings(prev => ({
        ...prev,
        logoFile: e.target.files![0],
        useLogo: true
      }));
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Identidade Visual</h3>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </button>
      </div>
      
      {/* Cores da Marca */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Cores da Marca
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Defina as cores principais da interface do sistema
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cor Principal
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                value={brandingSettings.brandColor}
                onChange={(e) => handleColorChange('brandColor', e.target.value)}
                className="h-10 w-16 cursor-pointer border-0 rounded"
              />
              <input
                type="text"
                value={brandingSettings.brandColor.toUpperCase()}
                onChange={(e) => handleColorChange('brandColor', e.target.value)}
                className="px-3 py-2 border rounded-md w-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Usada em botões principais e elementos de destaque
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cor Secundária
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                value={brandingSettings.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="h-10 w-16 cursor-pointer border-0 rounded"
              />
              <input
                type="text"
                value={brandingSettings.secondaryColor.toUpperCase()}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="px-3 py-2 border rounded-md w-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Usada em elementos secundários e complementares
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visualização</h4>
            <div className="flex flex-wrap gap-3 mt-3">
              <div 
                className="px-4 py-2 rounded-md text-white text-sm" 
                style={{ backgroundColor: brandingSettings.brandColor }}
              >
                Botão Primário
              </div>
              <div 
                className="px-4 py-2 rounded-md text-white text-sm" 
                style={{ backgroundColor: brandingSettings.secondaryColor }}
              >
                Botão Secundário
              </div>
              <div className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm flex items-center">
                <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: brandingSettings.brandColor }}></div>
                Opção selecionada
              </div>
              <div className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm flex items-center">
                <div 
                  className="w-20 h-1 mr-2 rounded-full" 
                  style={{ backgroundColor: brandingSettings.secondaryColor }}
                ></div>
                Progresso
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logotipo */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Logotipo
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Personalize o logotipo exibido no sistema
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Usar Logotipo Personalizado</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Substituir o logotipo padrão por um personalizado
              </p>
            </div>
            <button
              onClick={() => toggleSetting('useLogo')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                brandingSettings.useLogo ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                brandingSettings.useLogo ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className={`space-y-4 ${!brandingSettings.useLogo ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center">
              <div className="w-24 h-24 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center bg-white dark:bg-gray-900">
                {brandingSettings.logoFile ? (
                  <Image 
                    src={URL.createObjectURL(brandingSettings.logoFile)}
                    alt="Logo Preview"
                    className="max-w-full max-h-full object-contain"
                    width={96} // Adjust width as needed
                    height={96} // Adjust height as needed
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="ml-6">
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Carregar Imagem</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  Formatos suportados: PNG, JPG, SVG. Tamanho máximo: 1MB.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Ocultar Nome do Hospital</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mostrar apenas o logotipo, sem o nome do hospital
                </p>
              </div>
              <button
                onClick={() => toggleSetting('hideHospitalName')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  brandingSettings.hideHospitalName ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                disabled={!brandingSettings.useLogo}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  brandingSettings.hideHospitalName ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customização por Hospital */}
      {isAdmin && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Customização por Hospital
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Defina a identidade visual para cada unidade hospitalar
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Habilitar Customização por Hospital</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Permitir configurações visuais específicas para cada unidade
                </p>
              </div>
              <button
                onClick={() => toggleSetting('hospitalsCustomization')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  brandingSettings.hospitalsCustomization ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  brandingSettings.hospitalsCustomization ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className={`space-y-4 ${!brandingSettings.hospitalsCustomization ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hospital</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cor Principal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Logotipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Hospital Itaim
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: '#2C68F6' }}></div>
                          #2C68F6
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Logo personalizado
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline">Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Hospital Morumbi
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: '#10B981' }}></div>
                          #10B981
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Logo padrão
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline">Editar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Hospital
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Avisos */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Observação sobre identidade visual</h4>
          <p className="text-sm text-yellow-500 dark:text-yellow-300 mt-1">
            Alterações na identidade visual serão aplicadas em todas as telas do sistema e podem afetar a experiência de todos os usuários.
            {isAdmin ? ' Como administrador, estas alterações afetarão todo o sistema.' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};