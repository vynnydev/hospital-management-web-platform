# hospital-management-platform
Hospital management web frontend solution using NextJS with React, Tailwind, AI with AWS Bedrock and others resources and features.


// Estrutura de componentes
├── SettingsDashboard.tsx (componente principal)
├── navigation/
│   └── NavigationTabs.tsx (Navegação entre abas)
├── workflow/
│   ├── WorkflowTab.tsx (Aba de Fluxos de Trabalho completa)
│   ├── TemplatesSidebar.tsx (Painel lateral de templates)
│   ├── SLAEditor.tsx (Editor de SLAs)
│   ├── ExceptionFlowsEditor.tsx (Editor de fluxos de exceção)
│   └── ClinicalProtocols.tsx (Protocolos clínicos)
├── analytics/
│   ├── AnalyticsTab.tsx (Aba de Painel Analítico completa)
│   ├── MetricCategoriesSidebar.tsx (Categorias de métricas)
│   ├── MetricEditor.tsx (Editor de métricas)
│   └── MetricsLibrary.tsx (Biblioteca de métricas)
├── ai-assistant/
│   ├── AIAssistantTab.tsx (Aba de Assistente IA completa)
│   ├── ChatInterface.tsx (Interface de chat)
│   ├── AIPreview.tsx (Prévia de conteúdo gerado)
│   └── AILibrary.tsx (Histórico e biblioteca de prompts)
├── notifications/
│   ├── NotificationsTab.tsx (Aba de Sistema de Notificações completa)
│   ├── AlertEditor.tsx (Editor de alertas)
│   ├── AlertHistory.tsx (Histórico de alertas)
│   └── AlertTemplates.tsx (Templates de alertas)
├── calendar/
│   ├── CalendarTab.tsx (Aba de Calendário Hospitalar completa)
│   ├── MonthlyCalendar.tsx (Visualização do calendário)
│   ├── EventsList.tsx (Lista de próximos eventos)
│   └── EventForm.tsx (Formulário de eventos)
└── connections/
    ├── ConnectionsTab.tsx (Aba de Conexões de Sistemas completa)
    ├── ConnectionsList.tsx (Lista de conexões)
    ├── ConnectionStats.tsx (Estatísticas de conexões)
    ├── ConnectionHistory.tsx (Histórico de sincronizações)
    └── ConnectionForm.tsx (Formulário de nova conexão)