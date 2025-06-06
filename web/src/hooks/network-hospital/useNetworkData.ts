/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import type { INetworkData, INetworkInfo, IHospital, IBed, IPatientCareHistory, IStatusHistory } from '@/types/hospital-network-types';
import type { IAppUser, TPermission } from '@/types/auth-types';
import { authService } from '@/services/general/auth/AuthService';
import { usePermissions } from '../auth/usePermissions';
import { isValidCareHistory } from '@/services/validators/careHistoryValidators';

export const useNetworkData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkData, setNetworkData] = useState<INetworkData | null>(null);
  const [currentUser, setCurrentUser] = useState<IAppUser | null>(null);
  const [floors] = useState(['1', '2', '3', '4', '5']);
  const [beds, setBeds] = useState<IBed[]>([]);

  interface BedsPerFloor {
    [floorNumber: string]: IBed[];
  }

  const { permissions, loading: permissionsLoading } = usePermissions();

  const calculateNetworkMetrics = (hospitals: IHospital[]) => {
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

  const filterHospitalsByPermissions = (hospitals: IHospital[], user: IAppUser): IHospital[] => {
    if (!user?.permissions) return [];
    
    if (user.permissions.includes('VIEW_ALL_HOSPITALS')) {
      return hospitals;
    }

    if (user.permissions.includes('VIEW_SINGLE_HOSPITAL') && user.hospitalId) {
      return hospitals.filter(hospital => hospital.id === user.hospitalId);
    }

    return [];
  };
  
  // Adiciona função para filtrar usuários baseado em permissões
  const filterUsersByPermission = (users: IAppUser[], user: IAppUser): IAppUser[] => {
    if (!user?.permissions) return [];

    const hasAllHospitalsPermission = user.permissions.includes('VIEW_ALL_HOSPITALS' as TPermission);
    const hasSingleHospitalPermission = user.permissions.includes('VIEW_SINGLE_HOSPITAL' as TPermission);

    if (hasAllHospitalsPermission) {
      return users;
    }

    if (hasSingleHospitalPermission && user.hospitalId) {
      return users.filter(u => u.hospitalId === user.hospitalId);
    }

    return [];
  };
  
  const organizeBedsByFloor = (hospitals: IHospital[]): IBed[] => {
    const allBeds: IBed[] = [];
    
    hospitals.forEach(hospital => {
      if (!hospital?.departments) return;
  
      hospital.departments.forEach(dept => {
        if (!dept?.rooms) return;
  
        dept.rooms.forEach(room => {
          if (!room?.beds) return;
  
          room.beds.forEach(bed => {
            if (!bed?.floor) return;
            
            allBeds.push({
              ...bed,
              hospital: hospital.name,
              department: dept.name
            });
          });
        });
      });
    });
  
    return allBeds;
  };

  const getPatientCareHistory = (patientId: string): IPatientCareHistory | null => {
    if (!networkData) return null;
  
    for (const hospital of networkData.hospitals) {
      for (const department of hospital.departments) {
        for (const room of department.rooms) {
          for (const bed of room.beds) {
            if (bed.patient?.id === patientId && bed.patient.careHistory) {
              const validationResult = isValidCareHistory(bed.patient.careHistory);
              console.log('Validation details:', {
                basicFields: typeof bed.patient.careHistory === 'object',
                hasEvents: Array.isArray(bed.patient.careHistory.events),
                hasStatusHistory: Array.isArray(bed.patient.careHistory.statusHistory)
              });
              return validationResult ? bed.patient.careHistory : null;
            }
          }
        }
      }
    }
    return null;
  };

  const getPatientStatusHistory = (patientId: string): IStatusHistory[] | null => {
    const careHistory = getPatientCareHistory(patientId);
    if (!careHistory?.statusHistory) return null;
    return careHistory.statusHistory;
  };

  const getCurrentPatientStatus = (patientId: string): IStatusHistory | null => {
    const statusHistory = getPatientStatusHistory(patientId);
    if (!statusHistory?.length) return null;
    return statusHistory[statusHistory.length - 1];
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

        // Adiciona a busca de usuários junto com os outros dados
        const [networkInfoResponse, hospitalsResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:3001/networkInfo'),
          fetch('http://localhost:3001/hospitals'),
          fetch('http://localhost:3001/users')
        ]);

        if (!networkInfoResponse.ok || !hospitalsResponse.ok || !usersResponse.ok) {
          throw new Error('Falha ao buscar dados');
        }

        const networkInfo: INetworkInfo = await networkInfoResponse.json();
        const hospitals: IHospital[] = await hospitalsResponse.json();
        const users: IAppUser[] = await usersResponse.json();
        
        if (!mounted) return;

        const filteredHospitals = filterHospitalsByPermissions(hospitals, user);
        const filteredUsers = filterUsersByPermission(users, user);
        const bedsList = organizeBedsByFloor(filteredHospitals);
        const networkMetrics = calculateNetworkMetrics(filteredHospitals);

        setBeds(bedsList);
        setNetworkData({
          networkInfo: {
            ...networkInfo,
            totalHospitals: filteredHospitals.length,
            networkMetrics: networkMetrics || networkInfo.networkMetrics
          },
          hospitals: filteredHospitals,
          users: filteredUsers
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
    setNetworkData,
    getBedsForFloor: (floorNumber: string) => beds.filter(b => b.floor === floorNumber),
    getPatientCareHistory,
    getPatientStatusHistory,
    getCurrentPatientStatus
  };
};