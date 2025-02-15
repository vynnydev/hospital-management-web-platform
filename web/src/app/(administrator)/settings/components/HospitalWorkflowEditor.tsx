/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, MouseEvent, useEffect } from 'react';
import { Card } from '@/components/ui/organisms/card';
import {
  Plus,
  Workflow,
  Bed,
  Stethoscope,
  ClipboardList,
  Users,
  Brain,
  AlertTriangle,
  Move,
  Grid,
  FileText,
  Copy,
  Save,
  Download,
  Upload,
  Link,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';
import { ISavedWorkflow, IWorkflowCollaboration, IWorkflowExportFormat, TNodeMovementMode } from './types/workflow-types';
import { toast } from '@/components/ui/molecules/Toast';
import { useWorkflowManager } from '@/services/hooks/useWorkflowManager';
import { WorkflowSlider } from './workflow/WorkflowSlider';
import { useToast } from "@/components/ui/hooks/use-toast";

// Tipos de departamentos
interface Department {
  id: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
  subtitle?: string;
}

// Interface para nó no workflow
interface WorkflowNode extends Department {
  x: number;
  y: number;
  parentId?: string;
}

const departmentTypes: Department[] = [
  { 
    id: 'reception', 
    label: 'Recepção', 
    icon: (props: { className?: string }) => <ClipboardList {...props} />,
    subtitle: 'Entrada do paciente'
  },
  { 
    id: 'triage', 
    label: 'Triagem', 
    icon: (props: { className?: string }) => <Stethoscope {...props} />,
    subtitle: 'Avaliação inicial'
  },
  { 
    id: 'emergency', 
    label: 'Emergência', 
    icon: (props: { className?: string }) => <Bed {...props} />,
    subtitle: 'Atendimento urgente'
  },
  { 
    id: 'ward', 
    label: 'Enfermaria', 
    icon: (props: { className?: string }) => <Users {...props} />,
    subtitle: 'Acompanhamento'
  },
  { 
    id: 'icu', 
    label: 'UTI', 
    icon: (props: { className?: string }) => <Brain {...props} />,
    subtitle: 'Cuidados intensivos'
  },
];

// Componente de Erros
const WorkflowErrors = ({ errors }: { errors: string[] }) => {
    if (errors.length === 0) return null;
  
    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {errors.map((error, index) => (
          <div 
            key={index} 
            className="bg-red-500/80 text-white p-3 rounded-lg shadow-lg flex items-center"
          >
            <AlertTriangle className="mr-2" />
            {error}
          </div>
        ))}
      </div>
    );
};

// Funções de Inteligência Artificial com Mocks
const suggestWorkflowPath = (currentNode: WorkflowNode): string[] => {
    const pathRules: Record<string, string[]> = {
      'reception': ['triage', 'emergency'],
      'triage': ['emergency', 'ward'],
      'emergency': ['icu', 'ward'],
      'ward': ['icu'],
      'icu': ['recovery']
    };
  
    return pathRules[currentNode.id] || [];
};
  
const analyzeWorkflowEfficiency = (workflow: WorkflowNode[]): {
    efficiency: number;
    recommendations: string[];
} => {
    const nodeCount = workflow.length;
    const connectionCount = workflow.filter(node => node.parentId).length;
    
    const efficiency = Math.min(
      100, 
      (connectionCount / nodeCount) * 75 + 
      (new Set(workflow.map(node => node.id)).size / nodeCount) * 25
    );
  
    const recommendations = [
      efficiency < 50 ? 'Considere simplificar o fluxo' : '',
      nodeCount > 10 ? 'Muitos nós podem tornar o processo complexo' : '',
      connectionCount === 0 ? 'Adicione conexões entre nós' : ''
    ].filter(Boolean);
  
    return { 
      efficiency: Math.round(efficiency), 
      recommendations 
    };
};

export const HospitalWorkflowEditor = () => {
    const {
        workflow,
        setWorkflow,
        savedWorkflows,
        setSavedWorkflows,
        currentWorkflowSlide,
        setCurrentWorkflowSlide,
        saveWorkflow,
        errors
    } = useWorkflowManager();
      
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
    const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
    const [newNode, setNewNode] = useState({ title: '', subtitle: '' });
    const [movementMode, setMovementMode] = useState<TNodeMovementMode>('free');
    const [gridSize, setGridSize] = useState(20);
    const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
    const [collaboration, setCollaboration] = useState<IWorkflowCollaboration | null>(null);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<WorkflowNode | null>(null);
    const [nodeToDelete, setNodeToDelete] = useState<WorkflowNode | null>(null);
    const [workflowInProgress, setWorkflowInProgress] = useState<boolean>(false);
    const [currentWorkflowName, setCurrentWorkflowName] = useState<string>('');
    const [cancelWorkflowModalOpen, setCancelWorkflowModalOpen] = useState<boolean>(false);

    const { toast } = useToast();

    // Funções de colaboração
    const createCollaborativeWorkflow = () => {
        const newCollaboration: IWorkflowCollaboration = {
        id: `collab-${Date.now()}`,
        workflow,
        collaborators: [{
            id: 'current-user', // Substituir com autenticação real
            name: 'Usuário Atual',
            role: 'owner'
        }],
        inviteCode: Math.random().toString(36).substring(7)
        };

        setCollaboration(newCollaboration);
        toast.success('Workflow colaborativo criado');
    };

    const joinCollaborativeWorkflow = (inviteCode: string) => {
        // Lógica simulada de juntar-se a um workflow
        if (collaboration?.inviteCode === inviteCode) {
          const updatedCollaboration = {
            ...collaboration,
            collaborators: [
              ...collaboration.collaborators,
              {
                id: `user-${Date.now()}`,
                name: 'Novo Colaborador',
                role: 'editor'
              }
            ]
          };
    
          setCollaboration(updatedCollaboration);
          toast.success('Você entrou no workflow colaborativo');
        } else {
          toast.error('Código de convite inválido');
        }
    };

    // Componente de Convite
    const CollaborationInviteModal = () => {
        const [inviteCode, setInviteCode] = useState('');

        return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-xl font-semibold text-white">
                Colaboração em Workflow
            </h2>

            <div>
                <label className="block text-sm text-gray-400 mb-2">
                Código de Convite
                </label>
                <input 
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Digite o código de convite"
                className="w-full p-2 bg-gray-700 rounded"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <button 
                onClick={() => setInviteModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                Cancelar
                </button>
                <button 
                onClick={() => {
                    joinCollaborativeWorkflow(inviteCode);
                    setInviteModalOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                Entrar
                </button>
            </div>
            </div>
        </div>
        );
    };


    // Componente de Colaboradores
    const CollaboratorList = () => {
        if (!collaboration) return null;

        return (
        <div className="fixed top-4 left-4 bg-gray-800 rounded-lg p-3 z-50 space-y-2">
            <h3 className="text-white font-semibold">Colaboradores</h3>
            <div className="flex -space-x-2">
            {collaboration.collaborators.map((collaborator) => (
                <div 
                key={collaborator.id}
                className="relative"
                title={`${collaborator.name} (${collaborator.role})`}
                >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    {collaborator.name.charAt(0).toUpperCase()}
                </div>
                </div>
            ))}
            </div>
            {collaboration.inviteCode && (
            <div className="mt-2">
                <p className="text-xs text-gray-400">Código de Convite:</p>
                <div 
                className="bg-gray-700 text-white p-1 rounded flex items-center justify-between"
                onClick={() => {
                    navigator.clipboard.writeText(collaboration.inviteCode || '');
                    toast.success('Código copiado');
                }}
                >
                <span className="text-sm">{collaboration.inviteCode}</span>
                <Copy className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
            </div>
            )}
        </div>
        );
    };
  
    // Função para calcular posição com grade
    const calculateGridPosition = (x: number, y: number) => {
      if (movementMode === 'grid') {
        return {
          x: Math.round(x / gridSize) * gridSize,
          y: Math.round(y / gridSize) * gridSize
        };
      }
      return { x, y };
    };

    const loadWorkflow = (savedWorkflow: ISavedWorkflow) => {
        setWorkflow(savedWorkflow.nodes);
        toast.success(`Workflow "${savedWorkflow.name}" carregado`);
      };
    
      const deleteWorkflow = (id: string) => {
        setSavedWorkflows(prev => prev.filter(w => w.id !== id));
        toast.success('Workflow removido com sucesso');
    };

    // Funções de navegação do slider
    const goToPreviousWorkflow = () => {
        setCurrentWorkflowSlide(prev => 
        prev > 0 ? prev - 1 : savedWorkflows.length - 1
        );
    };

    const goToNextWorkflow = () => {
        setCurrentWorkflowSlide(prev => 
        prev < savedWorkflows.length - 1 ? prev + 1 : 0
        );
    };

    const handleAddNode = (dept: Department) => {
        const newNode: WorkflowNode = {
        ...dept,
        x: Math.random() * 600,
        y: Math.random() * 400
        };

        setWorkflow(prevWorkflow => [...prevWorkflow, newNode]);
    };

    const handleAddChildNode = () => {
        if (selectedNode) {
        const childNode: WorkflowNode = {
            id: `child-${Math.random().toString(36).substr(2, 9)}`,
            label: newNode.title || 'Novo Nó',
            subtitle: newNode.subtitle,
            icon: (props: { className?: string }) => <div {...props}>+</div>,
            x: selectedNode.x + 200,
            y: selectedNode.y + 100,
            parentId: selectedNode.id
        };

        setWorkflow(prevWorkflow => [...prevWorkflow, childNode]);
        setIsAddNodeModalOpen(false);
        setNewNode({ title: '', subtitle: '' });
        }
    };

    const renderConnections = () => {
        return workflow
        .filter(node => node.parentId)
        .map(childNode => {
            const parentNode = workflow.find(node => node.id === childNode.parentId);
            
            if (!parentNode) return null;

            return (
            <svg 
                key={childNode.id} 
                className="absolute pointer-events-none"
                style={{ 
                left: 0, 
                top: 0, 
                width: '100%', 
                height: '100%' 
                }}
            >
                <line
                x1={parentNode.x + 90}
                y1={parentNode.y + 50}
                x2={childNode.x + 90}
                y2={childNode.y + 50}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                />
            </svg>
            );
        });
    };

    const handleAddSubNode = (parentNode: WorkflowNode) => {
        const subNode: WorkflowNode = {
          id: `sub-${Math.random().toString(36).substr(2, 9)}`,
          label: 'Novo Processo', // Título padrão
          subtitle: 'Defina suas informações', // Subtítulo padrão
          icon: (props: { className?: string }) => <ClipboardList {...props} />, // Ícone padrão
          x: parentNode.x + 200, // Posição horizontal próxima ao nó pai
          y: parentNode.y + 100, // Posição vertical abaixo do nó pai
          parentId: parentNode.id // Referência ao nó pai
        };
      
        // Adiciona o novo nó ao workflow
        setWorkflow(prev => [...prev, subNode]);
      
        // Opcional: Seleciona o novo nó para edição
        setSelectedNodeForConfig(subNode);
    };

    const [draggingNode, setDraggingNode] = useState<{
        node: WorkflowNode;
        offsetX: number;
        offsetY: number;
      } | null>(null);
      
        const startDragging = (
            e: React.MouseEvent<HTMLDivElement>, 
            node: WorkflowNode
        ) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setDraggingNode({
            node,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        });
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!draggingNode) return;
      
        const containerRect = e.currentTarget.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - draggingNode.offsetX;
        const newY = e.clientY - containerRect.top - draggingNode.offsetY;
      
        setWorkflow(prev => prev.map(node => 
          node.id === draggingNode.node.id 
            ? {...node, x: newX, y: newY} 
            : node
        ));
    };
    
    const stopDragging = () => {
        setDraggingNode(null);
    };

    const showSuccessAIRecommendationsWorkflowToast = (message: string) => {
        toast({
          title: "Sobre o workflow:",
          description: message,
          variant: "default",
          duration: 1500, // Reduzido para 3s para melhor UX
        });
    };

    const showSuccessEfficiencyAIRecommendationsWorkflowToast = (analysis: {
        efficiency: number;
        recommendations: string[];
    }, message: string) => {
        toast({
          title: `Eficiência do Workflow: ${analysis.efficiency}%`, 
          description: message,
          variant: "default",
          duration: 1500, // Reduzido para 3s para melhor UX
        });
    };
    
    const handleAIRecommendations = () => {
        if (workflow.length === 0) {
          showSuccessAIRecommendationsWorkflowToast('Crie um workflow primeiro');
          return;
        }
    
        const analysis = analyzeWorkflowEfficiency(workflow);

        const efficiencyMessage = {
            description: analysis.recommendations.length > 0 
              ? analysis.recommendations.join('\n') 
              : 'Workflow bem estruturado!'
        }

        const { description } = efficiencyMessage
        
        showSuccessEfficiencyAIRecommendationsWorkflowToast(analysis, description)
    };

      // Configurações de movimento
    const MovementModeSelector = () => (
        <div className="fixed bottom-4 left-4 bg-gray-800 rounded-lg p-2 flex space-x-2 z-50">
        <button 
            onClick={() => setMovementMode('free')}
            className={`p-2 rounded ${
            movementMode === 'free' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-400 hover:bg-gray-700'
            }`}
            title="Movimento Livre"
        >
            <Move size={18} />
        </button>
        <button 
            onClick={() => setMovementMode('grid')}
            className={`p-2 rounded ${
            movementMode === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-400 hover:bg-gray-700'
            }`}
            title="Movimento em Grade"
        >
            <Grid size={18} />
        </button>
        <input 
            type="range"
            min="10"
            max="50"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="ml-2 w-24"
            title="Tamanho da Grade"
        />
        </div>
    );

    const showSuccessExportWorkflowToast = (message: string) => {
        toast({
          title: "Workflow exportado com sucesso!",
          description: message,
          variant: "default",
          duration: 1500, // Reduzido para 3s para melhor UX
        });
    };
    
    const showErrorExportWorkflowToast = (title: string, description: string) => {
        toast({
          title,
          description,
          variant: "destructive",
          duration: 3000,
        });
    };

    const showSuccessImportWorkflowToast = (message: string) => {
        toast({
          title: "Workflow importado com sucesso!",
          description: message,
          variant: "default",
          duration: 1500, // Reduzido para 3s para melhor UX
        });
    };
    
    const showErrorImportWorkflowToast = (title: string, description: string) => {
        toast({
          title,
          description,
          variant: "destructive",
          duration: 3000,
        });
    };

    // Funções de exportação e importação
    const exportWorkflow = () => {
        if (workflow.length === 0) {
        showErrorExportWorkflowToast('Erro ao exportar.', 'Não há workflow para exportar');
        return;
        }

        const exportData: IWorkflowExportFormat = {
        version: '1.0.0',
        metadata: {
            createdAt: new Date().toISOString(),
            name: `Workflow_${Date.now()}`
        },
        nodes: workflow
        };

        if (exportFormat === 'json') {
        const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(jsonBlob);
        link.download = `workflow_${exportData.metadata.name}.json`;
        link.click();
        } else {
        // Exportação básica para CSV
        const csvContent = workflow.map(node => 
            `${node.label},${node.subtitle},${node.x},${node.y}`
        ).join('\n');
        
        const csvBlob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(csvBlob);
        link.download = `workflow_${exportData.metadata.name}.csv`;
        link.click();
        }

        showSuccessExportWorkflowToast('Exportando workflow...');
    };

    const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            let importedWorkflow: WorkflowNode[];
    
            if (file.name.endsWith('.json')) {
              const parsed: IWorkflowExportFormat = JSON.parse(content);
              importedWorkflow = parsed.nodes;
            } else if (file.name.endsWith('.csv')) {
              importedWorkflow = content.split('\n').map(row => {
                const [label, subtitle, x, y] = row.split(',');
                return {
                  id: `imported-${Math.random().toString(36).substr(2, 9)}`,
                  label,
                  subtitle,
                  x: Number(x),
                  y: Number(y),
                  icon: (props: { className?: string }) => <FileText {...props} />
                };
              });
            } else {
              throw new Error('Formato de arquivo não suportado');
            }
    
            setWorkflow(importedWorkflow);
            showSuccessImportWorkflowToast('Importando workflow...');
          } catch (error) {
            showErrorImportWorkflowToast('Erro ao importar.', 'Erro ao importar workflow');
            console.error(error);
          }
        };
    
        reader.readAsText(file);
    };
    
    // Persistência local
    useEffect(() => {
        const savedWorkflows = localStorage.getItem('hospitalWorkflows');
        if (savedWorkflows) {
            setSavedWorkflows(JSON.parse(savedWorkflows));
        }
    }, []);

    useEffect(() => {
        if (savedWorkflows.length > 0) {
            localStorage.setItem('hospitalWorkflows', JSON.stringify(savedWorkflows));
        }
    }, [savedWorkflows]);


    // Função de configuração avançada de nó
    const [selectedNodeForConfig, setSelectedNodeForConfig] = useState<WorkflowNode | null>(null);

    const NodeConfigModal = () => {
        if (!selectedNodeForConfig) return null;

        return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-xl font-semibold text-white">
                Configurações Avançadas do Nó
            </h2>
            
            <div>
                <label className="block text-sm text-gray-400 mb-2">Cor do Nó</label>
                <div className="flex space-x-2">
                {['blue', 'green', 'red', 'purple', 'orange'].map((color) => (
                    <button
                    key={color}
                    className={`w-8 h-8 rounded-full bg-${color}-500`}
                    onClick={() => {
                        setWorkflow(prev => prev.map(node => 
                        node.id === selectedNodeForConfig.id 
                            ? {...node, color} 
                            : node
                        ));
                    }}
                    />
                ))}
                </div>
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-2">Prioridade</label>
                <select
                className="w-full p-2 bg-gray-700 rounded"
                value={selectedNodeForConfig.priority || 'medium'}
                onChange={(e) => {
                    setWorkflow(prev => prev.map(node => 
                    node.id === selectedNodeForConfig.id 
                        ? {...node, priority: e.target.value} 
                        : node
                    ));
                }}
                >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
                </select>
            </div>

            <div className="flex justify-end space-x-2">
                <button 
                onClick={() => setSelectedNodeForConfig(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                Cancelar
                </button>
                <button 
                onClick={() => setSelectedNodeForConfig(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                Salvar
                </button>
            </div>
            </div>
        </div>
        );
    };

    const handleNodeCreation = (parentNode?: WorkflowNode) => {
        const newNode: WorkflowNode = {
          id: `node-${Date.now()}`,
          label: 'Novo Processo',
          subtitle: 'Defina suas informações',
          icon: (props: { className?: string }) => <Plus {...props} />,
          x: parentNode 
            ? parentNode.x + 200 
            : Math.random() * 600,
          y: parentNode 
            ? parentNode.y + 100 
            : Math.random() * 400,
          parentId: parentNode?.id
        };
      
        setWorkflow(prev => [...prev, newNode]);
        setSelectedNodeForConfig(newNode);
      };
      
      const handleNodeConnection = (sourceNode: WorkflowNode, targetNode: WorkflowNode) => {
        // Lógica para criar conexão entre nós
        const updatedWorkflow = workflow.map(node => 
          node.id === targetNode.id 
            ? {...node, parentId: sourceNode.id} 
            : node
        );
      
        setWorkflow(updatedWorkflow);
      };
      
      const handleNodeDelete = (nodeToDelete: WorkflowNode) => {
        // Remove o nó e todas as suas conexões filho
        const remainingNodes = workflow.filter(node => 
          node.id !== nodeToDelete.id && 
          node.parentId !== nodeToDelete.id
        );
      
        setWorkflow(remainingNodes);
    };


    const handleNodeEdit = (node: WorkflowNode) => {
        setEditingNode(node);
      };
      
      const handleNodeUpdate = () => {
        if (editingNode) {
          setWorkflow(prev => 
            prev.map(node => 
              node.id === editingNode.id 
                ? { ...node, label: editingNode.label, subtitle: editingNode.subtitle } 
                : node
            )
          );
          setEditingNode(null);
        }
    };

    // Modal de Edição de Nó
    const NodeEditModal = () => {
        if (!editingNode) return null;
  
        return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-xl font-semibold text-white">
                Editar Processo
            </h2>
            <div>
                <label className="block text-sm text-gray-400 mb-2">Título</label>
                <input 
                type="text"
                value={editingNode.label}
                onChange={(e) => setEditingNode(prev => prev ? {...prev, label: e.target.value} : null)}
                className="w-full p-2 bg-gray-700 rounded text-white"
                />
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-2">Subtítulo</label>
                <input 
                type="text"
                value={editingNode.subtitle}
                onChange={(e) => setEditingNode(prev => prev ? {...prev, subtitle: e.target.value} : null)}
                className="w-full p-2 bg-gray-700 rounded text-white"
                />
            </div>
            <div className="flex justify-end space-x-2">
                <button 
                onClick={() => setEditingNode(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                Cancelar
                </button>
                <button 
                onClick={handleNodeUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                Salvar
                </button>
            </div>
            </div>
        </div>
        );
    };

    const showSuccessRemoveNodeWorkflowToast = (message: string) => {
        toast({
          title: "Nó removido com com sucesso!",
          description: message,
          variant: "default",
          duration: 1500, // Reduzido para 3s para melhor UX
        });
    };

    const showSuccessSaveWorkflowToast = (message: string) => {
        toast({
          title: "Processo salvo com sucesso!",
          description: message,
          variant: "default",
          duration: 1500, // Reduzido para 3s para melhor UX
        });
    };
    
    const showErrorSaveWorkflowToast = (title: string, description: string) => {
        toast({
          title,
          description,
          variant: "destructive",
          duration: 3000,
        });
    };

    // Botão de Salvar Workflow na parte inferior
    const handleSaveWorkflow = () => {
        const newWorkflow: ISavedWorkflow = {
        id: `workflow-${Date.now()}`,
        name: `Workflow ${savedWorkflows.length + 1}`,
        nodes: workflow,
        createdAt: new Date()
        };
    
        setSavedWorkflows(prev => [...prev, newWorkflow]);
        showSuccessSaveWorkflowToast('Salvando processo workflow...');
    };

    // Função para iniciar o processo de exclusão
    const handleDeleteNodeStart = (node: WorkflowNode) => {
        setNodeToDelete(node);
    };

    // Função para confirmar a exclusão
    const handleDeleteNodeConfirm = () => {
        if (nodeToDelete) {
        // Remove o nó e todos os seus nós filhos
        setWorkflow(prev => 
                prev.filter(node => 
                node.id !== nodeToDelete.id && 
                node.parentId !== nodeToDelete.id
            )
        );
            setNodeToDelete(null);
            showSuccessRemoveNodeWorkflowToast('Removendo nó...');
        }
    };

    // Componente de Modal de Confirmação de Exclusão
    const DeleteNodeModal = () => {
        if (!nodeToDelete) return null;
    
        return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-xl font-semibold text-white">
                Confirmar Exclusão
            </h2>
            <p className="text-gray-300">
                Tem certeza que deseja excluir o nó "{nodeToDelete.label}"? 
                Todos os nós filhos também serão removidos.
            </p>
            <div className="flex justify-end space-x-2">
                <button 
                onClick={() => setNodeToDelete(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                Cancelar
                </button>
                <button 
                onClick={handleDeleteNodeConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded"
                >
                Excluir
                </button>
            </div>
            </div>
        </div>
        );
    };

    const showSuccessWorkflowToast = (message: string) => {
        toast({
          title: "Processo cancelado com sucesso!",
          description: message,
          variant: "default",
          duration: 1500, // Reduzido para 3s para melhor UX
        });
    };
    
    const showErrorWorkflowToast = (title: string, description: string) => {
        toast({
          title,
          description,
          variant: "destructive",
          duration: 3000,
        });
    };

    // Função para iniciar o workflow
    const startWorkflow = (dept: Department) => {
        if (!workflowInProgress) {
        handleAddNode(dept);
        setWorkflowInProgress(true);
        setCurrentWorkflowName(dept.label); // Definir o nome do workflow atual
        }
    };
    
    // Função para cancelar o workflow
    const cancelWorkflow = () => {
        setCancelWorkflowModalOpen(true);
    };
    
    // Função para confirmar cancelamento
    const confirmCancelWorkflow = () => {
        setWorkflow(prev => prev.slice(0, -1)); // Remove o último nó
        setWorkflowInProgress(false);
        setCurrentWorkflowName('');
        setCancelWorkflowModalOpen(false);
        showSuccessWorkflowToast("Cancelando o Processo...");
    };

    // Modal de Cancelamento
    const CancelWorkflowModal = () => {
        if (!cancelWorkflowModalOpen) return null;
    
        return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-xl font-semibold text-white">
                Cancelar Processo
            </h2>
            <p className="text-gray-300">
                Tem certeza que deseja cancelar o processo de {currentWorkflowName}?
            </p>
            <div className="flex justify-end space-x-2">
                <button 
                onClick={() => setCancelWorkflowModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                Manter
                </button>
                <button 
                onClick={confirmCancelWorkflow}
                className="bg-red-600 text-white px-4 py-2 rounded"
                >
                Cancelar Processo
                </button>
            </div>
            </div>
        </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-gray-950 text-white">
          {/* Barra Superior Global */}
          <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <Workflow className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-bold">Editor de Workflow Hospitalar</h1>
            </div>
            
            {/* Menu de Exportação/Importação */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-300">Formato:</label>
                <select 
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                  className="bg-gray-700 text-white rounded p-1"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={exportWorkflow}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center"
                >
                  <Download className="mr-2" size={16} />
                  Exportar
                </button>
                
                <label className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center cursor-pointer">
                  <Upload className="mr-2" size={16} />
                  Importar
                  <input 
                    type="file" 
                    accept=".json,.csv"
                    onChange={importWorkflow}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
    
          {/* Área Principal com Workflow e Controles */}
          <div className="flex-1 flex relative min-h-0">
            {/* Barra Lateral de Departamentos */}
            <div className="w-64 bg-gray-900/50 p-4 border-r border-gray-800 overflow-y-auto relative">
            {workflowInProgress && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center">
                <p className="text-white/70 text-sm">
                Um processo está em andamento
                </p>
            </div>
            )}

            <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-400">
                Departamentos Disponíveis
            </h3>
            {workflowInProgress && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <p className="text-white/70 text-sm mb-2">
                    Um processo está em andamento
                </p>
                <p className="text-white font-medium">
                    {currentWorkflowName}
                </p>
                <button 
                    onClick={cancelWorkflow}
                    className="mt-4 text-red-400 hover:text-red-300 text-sm"
                >
                    Cancelar Processo
                </button>
                </div>
            )}
            </div>
              <div className="space-y-2">
                {departmentTypes.map((dept) => {
                    const Icon = dept.icon;
                    return (
                    <div
                        key={dept.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border border-gray-700 
                        ${workflowInProgress 
                            ? 'bg-gray-900/50 cursor-not-allowed opacity-50' 
                            : 'bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer'
                        }`}
                        onClick={() => startWorkflow(dept)}
                    >
                        <div className="p-2 rounded-md bg-blue-500/10">
                        <Icon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-white">{dept.label}</h4>
                        <p className="text-xs text-gray-400">{dept.subtitle}</p>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
    
            {/* Área do Workflow */}
            <div 
                className="flex-1 relative"
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                style={{
                    backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            >
              {/* Componentes de Workflow existentes */}
              {renderConnections()}
              {workflow.map((node) => {
                const Icon = node.icon;
                return (
                    <div 
                        key={node.id}
                        className="absolute cursor-move group"
                        style={{ 
                            left: `${node.x}px`, 
                            top: `${node.y}px` 
                        }}
                        onMouseDown={(e) => startDragging(e, node)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNodeEdit(node);
                        }}
                    >
                    <div className="flex items-center">
                        <Card className="min-w-[180px] bg-gray-900 border-gray-700 shadow-lg relative">
                        {/* Botão de exclusão */}
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNodeStart(node);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 hover:bg-red-600"
                        >
                        <X size={14} />
                        </button>
                        <div className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                            <Icon className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                            <h4 className="font-medium text-white">{node.label}</h4>
                            {node.subtitle && (
                                <p className="text-sm text-gray-400">{node.subtitle}</p>
                            )}
                            </div>
                        </div>
                        </Card>
                        
                        {/* Botão circular de adicionar sub-nó */}
                        <button 
                        onClick={() => handleAddSubNode(node)}
                        className="ml-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors"
                        >
                        <Plus size={16} />
                        </button>
                    </div>
                    </div>
                );
            })}
    
              {/* Controles Flutuantes */}
              <div className="absolute bottom-4 left-4 flex space-x-2">
                <MovementModeSelector />
                <button 
                  onClick={handleAIRecommendations}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg flex items-center"
                >
                  <Brain className="mr-2" />
                  Análise de IA
                </button>
              </div>

                {/* Botão de Salvar */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <button 
                    onClick={handleSaveWorkflow}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-colors"
                >
                    <Save className="mr-2 inline-block" />
                    Salvar Workflow
                </button>
                </div>
    
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button 
                  onClick={createCollaborativeWorkflow}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg flex items-center"
                >
                  <Users className="mr-2" />
                  Criar Colaboração
                </button>
                <button 
                  onClick={() => setInviteModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg flex items-center"
                >
                  <Link className="mr-2" />
                  Entrar em Colaboração
                </button>
              </div>
            </div>
          </div>

            {/* Modais */}
            <CancelWorkflowModal />
            <NodeEditModal />
            <DeleteNodeModal />
            <WorkflowErrors errors={errors} />
            {inviteModalOpen && <CollaborationInviteModal />}
            <CollaboratorList />
            <NodeConfigModal />
        </div>
    );
};