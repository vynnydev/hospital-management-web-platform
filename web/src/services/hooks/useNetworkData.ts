/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import type { NetworkData, NetworkInfo, Hospital, IBed } from '../../types/hospital-network-types';
import type { AppUser } from '../../types/auth-types';
import { authService } from '../auth/AuthService';
import { usePermissions } from './auth/usePermissions';

export const useNetworkData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [floors] = useState(['1', '2', '3', '4', '5']);
  const [beds, setBeds] = useState<IBed[]>([]);

  interface BedsPerFloor {
    [floorNumber: string]: IBed[];
  }

  const { permissions, loading: permissionsLoading } = usePermissions();

  const calculateNetworkMetrics = (hospitals: Hospital[]) => {
    if (!hospitals.length) return null;

    const totalPatients = hospitals.reduce((acc, hospital) => 
      acc + (hospital.metrics?.overall?.totalPatients || 0), 0);
    
    const totalBeds = hospitals.reduce((acc, hospital) => 
      acc + (hospital.metrics?.overall?.totalBeds || 0), 0);
    
    const averageOccupancy = hospitals.reduce((acc, hospital) => 
      acc + (hospital.metrics?.overall?.occupancyRate || 0), 0) / hospitals.length;

    const networkEfficiency = {
      avgWaitTime: hospitals.reduce((acc, hospital) => 
        acc + (hospital.metrics?.overall?.avgStayDuration || 0), 0) / hospitals.length,
      bedTurnover: hospitals.reduce((acc, hospital) => 
        acc + (hospital.metrics?.overall?.turnoverRate || 0), 0) / hospitals.length,
      resourceUtilization: averageOccupancy
    };

    const regionalMetrics = hospitals.reduce((acc, hospital) => {
      const state = hospital.unit?.state;
      if (!state) return acc;

      if (!acc[state]) {
        acc[state] = {
          hospitals: 0,
          totalBeds: 0,
          avgOccupancy: 0
        };
      }
      
      acc[state].hospitals += 1;
      acc[state].totalBeds += hospital.metrics?.overall?.totalBeds || 0;
      acc[state].avgOccupancy = (acc[state].avgOccupancy * (acc[state].hospitals - 1) + 
        (hospital.metrics?.overall?.occupancyRate || 0)) / acc[state].hospitals;
      
      return acc;
    }, {} as Record<string, {
      hospitals: number;
      totalBeds: number;
      avgOccupancy: number;
    }>);

    return {
      totalBeds,
      totalPatients,
      averageOccupancy,
      networkEfficiency,
      regionalMetrics
    };
  };

  const filterHospitalsByPermissions = (hospitals: Hospital[], user: AppUser): Hospital[] => {
    if (!user?.permissions) return [];
    
    if (user.permissions.includes('VIEW_ALL_HOSPITALS')) {
      return hospitals;
    }

    if (user.permissions.includes('VIEW_SINGLE_HOSPITAL') && user.hospitalId) {
      return hospitals.filter(hospital => hospital.id === user.hospitalId);
    }

    return [];
  };
  
  const organizeBedsByFloor = (hospitals: Hospital[]): IBed[] => {
    const allBeds: IBed[] = [];
    
    hospitals.forEach(hospital => {
      if (!hospital?.departments) return;

      hospital.departments.forEach(dept => {
        if (!dept?.beds) return;

        dept.beds.forEach(bed => {
          if (!bed?.floor) return;
          
          allBeds.push({
            ...bed,
            hospital: hospital.name,
            department: dept.name
          });
        });
      });
    });

    return allBeds;
  };

  useEffect(() => {
    let mounted = true;

    const fetchNetworkData = async () => {
      if (permissionsLoading) return;

      try {
        setLoading(true);
        const user = authService.getCurrentUser();
        if (!user) throw new Error('Usuário não autenticado');
        
        if (mounted) setCurrentUser(user);

        const [networkInfoResponse, hospitalsResponse] = await Promise.all([
          fetch('http://localhost:3001/networkInfo'),
          fetch('http://localhost:3001/hospitals')
        ]);

        if (!networkInfoResponse.ok || !hospitalsResponse.ok) {
          throw new Error('Falha ao buscar dados');
        }

        const networkInfo: NetworkInfo = await networkInfoResponse.json();
        const hospitals: Hospital[] = await hospitalsResponse.json();
        
        if (!mounted) return;

        const filteredHospitals = filterHospitalsByPermissions(hospitals, user);
        const bedsList = organizeBedsByFloor(filteredHospitals);
        const networkMetrics = calculateNetworkMetrics(filteredHospitals);

        setBeds(bedsList);
        setNetworkData({
          networkInfo: {
            ...networkInfo,
            totalHospitals: filteredHospitals.length,
            networkMetrics: networkMetrics || networkInfo.networkMetrics
          },
          hospitals: filteredHospitals
        });
        
        setError(null);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Ocorreu um erro');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchNetworkData();

    return () => {
      mounted = false;
    };
  }, [permissionsLoading]);

  return { 
    networkData, 
    currentUser, 
    floors, 
    beds,
    loading, 
    error,
    getBedsForFloor: (floorNumber: string) => beds.filter(b => b.floor === floorNumber)
  };
};