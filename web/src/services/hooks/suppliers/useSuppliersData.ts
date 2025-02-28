/* eslint-disable @typescript-eslint/no-unused-vars */
// services/hooks/useSuppliersData.ts
import { useState, useEffect } from 'react';
import type { ISupplier, ISupplierRecommendation, IHospitalResourceNeeds, TResourceCategory } from '@/types/supplier-types';
import { useNetworkData } from '../network-hospital/useNetworkData';
import api from '../../api';

export const useSuppliersData = (selectedHospitalId: string | null) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [hospitalNeeds, setHospitalNeeds] = useState<IHospitalResourceNeeds | null>(null);
    const [recommendations, setRecommendations] = useState<ISupplierRecommendation[]>([]);
    const [aiEnhancedRecommendations, setAiEnhancedRecommendations] = useState<boolean>(true);
    
    const { networkData } = useNetworkData();
    
    // Buscar fornecedores do backend
    useEffect(() => {
      const fetchSuppliers = async () => {
        try {
          setLoading(true);
          // Na implementação real, você buscaria do backend
          // Por enquanto, vamos simular alguns dados
          const response = await api.get('/suppliers');
          setSuppliers(response.data);
          setError(null);
        } catch (err) {
          // Simulação de dados para desenvolvimento
          // Em produção, você usaria apenas o bloco catch para erros
          const mockSuppliers: ISupplier[] = [
            {
              id: "sup-001",
              name: "MedTech Equipamentos",
              address: "Av. Paulista, 1000",
              city: "São Paulo",
              state: "SP",
              coordinates: {
                lat: -23.561684,
                lng: -46.655291
              },
              contactInfo: {
                phone: "(11) 3333-4444",
                email: "contato@medtech.com.br",
                website: "www.medtech.com.br"
              },
              categories: ["equipment"],
              resourceTypes: ["respiradores", "monitores", "desfibriladores"],
              rating: 5,
              deliveryTimeHours: 12,
              status: "active",
              lastSupply: "2024-01-15",
              preferredVendor: true
            },
            {
              id: "sup-002",
              name: "SupriHospital",
              address: "Rua Augusta, 500",
              city: "São Paulo",
              state: "SP",
              coordinates: {
                lat: -23.551684,
                lng: -46.645291
              },
              contactInfo: {
                phone: "(11) 2222-3333",
                email: "vendas@suprihospital.com.br"
              },
              categories: ["supplies", "medication"],
              resourceTypes: ["seringas", "luvas", "máscaras", "medicamentos"],
              rating: 4,
              deliveryTimeHours: 6,
              status: "active",
              preferredVendor: false
            },
            {
              id: "sup-003",
              name: "CardioTech",
              address: "Av. Rebouças, 800",
              city: "São Paulo",
              state: "SP",
              coordinates: {
                lat: -23.558684,
                lng: -46.665291
              },
              contactInfo: {
                phone: "(11) 4444-5555",
                email: "vendas@cardiotech.com.br",
                website: "www.cardiotech.com.br"
              },
              categories: ["equipment"],
              resourceTypes: ["monitores", "desfibriladores"],
              rating: 4,
              deliveryTimeHours: 24,
              status: "active",
              lastSupply: "2024-02-10",
              preferredVendor: true
            },
            {
              id: "sup-004",
              name: "RespiraCare",
              address: "Av. Brigadeiro Faria Lima, 1500",
              city: "São Paulo",
              state: "SP",
              coordinates: {
                lat: -23.561684,
                lng: -46.675291
              },
              contactInfo: {
                phone: "(11) 5555-6666",
                email: "contato@respiracare.com.br"
              },
              categories: ["equipment"],
              resourceTypes: ["respiradores", "ventiladores"],
              rating: 5,
              deliveryTimeHours: 18,
              status: "active",
              preferredVendor: true
            }
          ];
          
          setSuppliers(mockSuppliers);
          console.warn("Usando dados simulados de fornecedores");
        } finally {
          setLoading(false);
        }
      };
  
      fetchSuppliers();
    }, []);
  
    // Buscar necessidades do hospital selecionado
    useEffect(() => {
      if (!selectedHospitalId || !networkData) {
        setHospitalNeeds(null);
        setRecommendations([]);
        return;
      }
  
      const fetchHospitalNeeds = async () => {
        try {
          setLoading(true);
          // Na implementação real, você buscaria do backend
          // Por enquanto, vamos simular alguns dados
          const response = await api.get(`/hospitals/${selectedHospitalId}/resourceNeeds`);
          setHospitalNeeds(response.data);
        } catch (err) {
          // Simulação de dados para desenvolvimento
          const selectedHospital = networkData.hospitals.find(h => h.id === selectedHospitalId);
          
          if (selectedHospital) {
            const mockNeeds: IHospitalResourceNeeds = {
              hospitalId: selectedHospitalId,
              hospitalName: selectedHospital.name,
              criticalResources: [
                {
                  resourceType: "respiradores",
                  category: "equipment",
                  quantityNeeded: 2,
                  urgencyLevel: "critical"
                },
                {
                  resourceType: "monitores",
                  category: "equipment",
                  quantityNeeded: 3,
                  urgencyLevel: "high"
                },
                {
                  resourceType: "seringas",
                  category: "supplies",
                  quantityNeeded: 100,
                  urgencyLevel: "medium"
                }
              ]
            };
            
            setHospitalNeeds(mockNeeds);
            console.warn("Usando dados simulados de necessidades de recursos");
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchHospitalNeeds();
    }, [selectedHospitalId, networkData]);
  
    // Gerar recomendações com base nas necessidades e fornecedores disponíveis
    useEffect(() => {
      if (!hospitalNeeds || !suppliers.length) {
        setRecommendations([]);
        return;
      }
  
      // Encontrar o hospital selecionado para calcular distâncias
      const selectedHospital = networkData?.hospitals.find(h => h.id === selectedHospitalId);
      if (!selectedHospital) return;
  
      // Calcular a distância entre dois pontos (simplificado para exemplo)
      const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lng2 - lng1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distância em km
        return Math.round(distance * 10) / 10; // Arredonda para 1 casa decimal
      };
  
      // Fornecedores com distância calculada
      const suppliersWithDistance = suppliers.map(supplier => {
        const distance = calculateDistance(
          selectedHospital.unit.coordinates.lat,
          selectedHospital.unit.coordinates.lng,
          supplier.coordinates.lat,
          supplier.coordinates.lng
        );
        
        return {
          ...supplier,
          distance
        };
      });
  
      // Gerar recomendações para cada recurso crítico
      const newRecommendations: ISupplierRecommendation[] = [];
      
      hospitalNeeds.criticalResources.forEach(resource => {
        // Filtrar fornecedores que têm o tipo de recurso necessário
        const matchingSuppliers = suppliersWithDistance.filter(supplier => 
          supplier.resourceTypes.includes(resource.resourceType) &&
          supplier.categories.includes(resource.category as TResourceCategory)
        );
        
        // Calcular pontuação de prioridade para cada fornecedor
        matchingSuppliers.forEach(supplier => {
          // Algoritmo básico para cálculo de pontuação
          let distanceScore = Math.max(0, 5 - supplier.distance! / 10);
          let ratingScore = supplier.rating;
          let preferredScore = supplier.preferredVendor ? 2 : 0;
          let deliveryScore = 5 - (supplier.deliveryTimeHours / 10);
          
          // Aplicar fatores de aprimoramento de IA se habilitado
          if (aiEnhancedRecommendations) {
            // Simular recomendações aprimoradas por IA
            // Em um sistema real, isso viria de um modelo de ML treinado
            
            // 1. Análise de padrões de compra anteriores
            // Simular maior peso para fornecedores com histórico positivo
            if (supplier.lastSupply) {
              const lastSupplyDate = new Date(supplier.lastSupply);
              const daysSinceLastSupply = Math.floor((new Date().getTime() - lastSupplyDate.getTime()) / (1000 * 3600 * 24));
              
              // Fornecedores com transações recentes recebem um boost
              if (daysSinceLastSupply < 30) {
                preferredScore += 1.5;
              }
            }
            
            // 2. Análise contextual baseada no tipo de recurso
            // Certos fornecedores têm especialidades em tipos específicos de recursos
            if (
              (resource.resourceType === 'respiradores' && supplier.name.includes('Respira')) ||
              (resource.resourceType === 'monitores' && supplier.name.includes('Cardio'))
            ) {
              ratingScore += 1; // Boost para fornecedores especializados
            }
            
            // 3. Análise de urgência adaptativa
            // Recursos críticos priorizam disponibilidade e entrega rápida
            if (resource.urgencyLevel === 'critical' || resource.urgencyLevel === 'high') {
              deliveryScore *= 1.5; // Maior peso para tempo de entrega em casos críticos
            }
            
            // 4. Otimização geográfica inteligente
            // Em emergências, proximidade é mais importante que preço
            if (resource.urgencyLevel === 'critical') {
              distanceScore *= 2; // Dobra a importância da proximidade para itens críticos
            }
          }
          
          // Ajustar tempo de entrega baseado na urgência
          let urgencyMultiplier = 1;
          switch(resource.urgencyLevel) {
            case 'critical': urgencyMultiplier = 0.5; break;
            case 'high': urgencyMultiplier = 0.7; break;
            case 'medium': urgencyMultiplier = 0.9; break;
            default: urgencyMultiplier = 1;
          }
          
          const estimatedDelivery = supplier.deliveryTimeHours * urgencyMultiplier;
          
          // Pontuação final combinando todos os fatores
          const priorityScore = distanceScore + ratingScore + preferredScore + deliveryScore;
          
          // Cálculo de preço (poderia ser aprimorado com dados reais ou IA de previsão)
          const basePrice = resource.category === 'equipment' ? 5000 : 500;
          // Simulação de preço baseado em vários fatores
          let price = basePrice + (supplier.distance! * 10);
          
          // Ajustes de preço baseados em IA
          if (aiEnhancedRecommendations) {
            // Simular descontos para compras frequentes
            if (supplier.lastSupply) {
              const lastSupplyDate = new Date(supplier.lastSupply);
              const daysSinceLastSupply = Math.floor((new Date().getTime() - lastSupplyDate.getTime()) / (1000 * 3600 * 24));
              if (daysSinceLastSupply < 60) {
                price *= 0.95; // 5% de desconto para compras regulares
              }
            }
            
            // Fornecedores preferenciais oferecem melhores preços
            if (supplier.preferredVendor) {
              price *= 0.9; // 10% de desconto
            }
          }
          
          newRecommendations.push({
            supplier,
            resourceType: resource.resourceType,
            category: resource.category as TResourceCategory,
            inStock: Math.random() > 0.3, // Simulação de disponibilidade
            estimatedDelivery,
            price,
            priorityScore
          });
        });
      });
      
      // Ordenar por pontuação de prioridade (maior primeiro)
      newRecommendations.sort((a, b) => b.priorityScore - a.priorityScore);
      
      setRecommendations(newRecommendations);
    }, [hospitalNeeds, suppliers, selectedHospitalId, networkData, aiEnhancedRecommendations]);
  
    // Toggle para habilitar/desabilitar recomendações aprimoradas por IA
    const toggleAiRecommendations = () => {
      setAiEnhancedRecommendations(prev => !prev);
    };
  
    return {
      suppliers,
      hospitalNeeds,
      recommendations,
      loading,
      error,
      aiEnhancedRecommendations,
      toggleAiRecommendations
    };
};