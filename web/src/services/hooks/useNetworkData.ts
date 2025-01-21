/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useNetworkData.ts
import { useState, useEffect } from 'react';
import type { NetworkData, NetworkInfo, Hospital } from '../../types/hospital-network-types';
import type { AppUser } from '../../types/auth-types';
import { authService } from '../auth/AuthService';
import { usePermissions } from './auth/usePermissions';

export const useNetworkData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authorizedHospitals, setAuthorizedHospitals] = useState<Hospital[]>([]);

  const { permissions, loading: permissionsLoading } = usePermissions();

  // Função auxiliar para calcular métricas da rede
  const calculateNetworkMetrics = (hospitals: Hospital[]) => {
    const totalPatients = hospitals.reduce((acc, hospital) => 
      acc + hospital.metrics.overall.totalPatients, 0);
    
    const totalBeds = hospitals.reduce((acc, hospital) => 
      acc + hospital.metrics.overall.totalBeds, 0);
    
    const averageOccupancy = hospitals.length > 0
      ? hospitals.reduce((acc, hospital) => 
          acc + hospital.metrics.overall.occupancyRate, 0) / hospitals.length
      : 0;


    // Calcular network efficiency
    const networkEfficiency = {
        avgWaitTime: hospitals.length > 0
            ? hospitals.reduce((acc, hospital) => 
                acc + (hospital.metrics.overall.avgStayDuration || 0), 0) / hospitals.length
            : 0,
        bedTurnover: hospitals.length > 0
            ? hospitals.reduce((acc, hospital) => 
                acc + (hospital.metrics.overall.turnoverRate || 0), 0) / hospitals.length
            : 0,
        resourceUtilization: averageOccupancy  // Usando ocupação média como métrica de utilização
        };

    // Calcular métricas regionais
    const regionalMetrics = hospitals.reduce((acc, hospital) => {
        const state = hospital.unit.state;
        if (!acc[state]) {
          acc[state] = {
            hospitals: 0,
            totalBeds: 0,
            totalPatients: 0,
            avgOccupancy: 0
          };
        }
        
        acc[state].hospitals += 1;
        acc[state].totalBeds += hospital.metrics.overall.totalBeds;
        acc[state].totalPatients += hospital.metrics.overall.totalPatients;
        acc[state].avgOccupancy = (acc[state].avgOccupancy * (acc[state].hospitals - 1) + 
          hospital.metrics.overall.occupancyRate) / acc[state].hospitals;
        
        return acc;
      }, {} as Record<string, {
        hospitals: number;
        totalBeds: number;
        totalPatients: number;
        avgOccupancy: number;
      }>);

      return {
        totalBeds,
        totalPatients,
        averageOccupancy,
        networkEfficiency,  // Adicionando networkEfficiency ao retorno
        regionalMetrics
      };
  };

  const filterHospitalsByPermissions = (hospitals: Hospital[], user: AppUser): Hospital[] => {
    if (user.permissions.includes('VIEW_ALL_HOSPITALS')) {
      return hospitals;
    }

    if (user.permissions.includes('VIEW_SINGLE_HOSPITAL') && user.hospitalId) {
      return hospitals.filter(hospital => hospital.id === user.hospitalId);
    }

    return [];
  };

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        setCurrentUser(currentUser);

        if (!currentUser || permissionsLoading) return;

        const [networkInfoResponse, hospitalsResponse] = await Promise.all([
          fetch('http://localhost:3001/networkInfo'),
          fetch('http://localhost:3001/hospitals')
        ]);

        if (!networkInfoResponse.ok || !hospitalsResponse.ok) {
          throw new Error('Falha ao encontrar o usuário');
        }

        const networkInfo: NetworkInfo = await networkInfoResponse.json();
        const hospitals: Hospital[] = await hospitalsResponse.json();

        const filteredHospitals = filterHospitalsByPermissions(hospitals, currentUser);
        setAuthorizedHospitals(filteredHospitals);

        const networkMetrics = calculateNetworkMetrics(filteredHospitals);

        setNetworkData({
          networkInfo: {
            ...networkInfo,
            totalHospitals: filteredHospitals.length,
            networkMetrics
          },
          hospitals: filteredHospitals
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (!permissionsLoading) {
      fetchNetworkData();
    }
  }, [permissions, permissionsLoading]);

  return { networkData, currentUser, loading, error };
};