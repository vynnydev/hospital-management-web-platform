'use client'
import { useState } from "react";
import { Card } from "@/components/ui/organisms/card";
import { PatientMonitoringDashboard } from "@/components/ui/templates/PatientMonitoringDashboard"
import { useAmbulanceData } from "@/hooks/ambulance/useAmbulanceData";
import { useNetworkData } from "@/hooks/network-hospital/useNetworkData";
import { useStaffData } from "@/hooks/staffs/useStaffData";

const NurseDashboard = () => {
  const { networkData, loading, error } = useNetworkData();
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  const {
    staffData
  } = useStaffData();

  const {
    ambulanceData
  } = useAmbulanceData(selectedHospital);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !networkData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 bg-gray-200 dark:bg-gray-700">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">{error || 'Dados não disponíveis'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="-mt-20">
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg py-2">
          <PatientMonitoringDashboard 
              selectedHospitalId={selectedHospital || ''}
              setSelectedHospitalId={setSelectedHospital}
              networkData={networkData}
              staffData={staffData}
              ambulanceData={ambulanceData}
          />
        </div>
    </div>
  )
}

export default NurseDashboard