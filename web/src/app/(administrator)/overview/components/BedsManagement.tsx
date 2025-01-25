/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/organisms/card';
import { 
  Building2, Users, AlertCircle, Calendar, Clock, Grid, 
  MapPin, Loader2, ChevronsUpDown, BedDouble, Stethoscope 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { Hospital, IBed, Patient, Department } from '@/types/hospital-network-types';
import { BedModelCanva } from './beds-management-map/BedModelCanva';

export const BedsManagement: React.FC = () => {
  const { networkData, floors, beds, loading, error, getBedsForFloor } = useNetworkData();
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedBed, setSelectedBed] = useState<IBed | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string>('1');

  useEffect(() => {
    if (selectedHospital) {
      setSelectedDepartment('');
      setSelectedSpecialty('');
      setSelectedBed(null);
    }
  }, [selectedHospital]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
  
  if (error) return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="text-red-500 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        {error}
      </div>
    </div>
  );
  
  if (!networkData) return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="text-gray-300 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        No data available
      </div>
    </div>
  );

  const floorOptions = floors.map(f => ({
    label: `${f}º Andar`,
    value: f
  }));

  const getBedsForDepartment = (department: string) => {
    if (!selectedHospital) return [];
    
    return beds.filter(bed => 
      bed.hospital === selectedHospital.name &&
      bed.department === department &&
      bed.floor === selectedFloor &&
      (!selectedSpecialty || bed.specialty === selectedSpecialty)
    );
  };

  return (
    <div className="pt-2 pb-2 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md">
      <div className="flex h-screen bg-gray-900">
        {/* Left Sidebar - Hospital Selection */}
        <div className="w-72 bg-gray-800/50 p-6 rounded-r-3xl shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-bold flex items-center gap-3 text-gray-100 mb-8">
            <Building2 className="h-6 w-6 text-blue-500" />
            Hospitais
          </h2>
          <div className="space-y-3">
            {networkData.hospitals.map((hospital: Hospital) => (
              <button
                key={hospital.id}
                onClick={() => setSelectedHospital(hospital)}
                className={`w-full p-4 text-left rounded-2xl flex items-center gap-3 transition-all
                  ${selectedHospital?.id === hospital.id 
                    ? 'bg-blue-600/20 text-blue-100 shadow-lg border border-blue-500/20' 
                    : 'text-gray-100 hover:bg-gray-700/50'
                  }`}
              >
                <MapPin className={`h-5 w-5 ${selectedHospital?.id === hospital.id ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="font-medium">{hospital.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {selectedHospital ? (
            <>
              {/* Controls Header */}
              <div className="mb-8 space-y-6">
                {/* Hospital Info */}
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-100">
                    {selectedHospital.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 flex items-center gap-2">
                      <BedDouble className="h-5 w-5" />
                      {selectedHospital.metrics.overall.totalBeds} beds
                    </span>
                    <span className="text-gray-400 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {selectedHospital.metrics.overall.totalPatients} patients
                    </span>
                  </div>
                </div>

                {/* Departments and Floor Selection */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex gap-3">
                    {selectedHospital.departments.map((dept: Department) => (
                      <button
                        key={dept.name}
                        onClick={() => setSelectedDepartment(dept.name)}
                        className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2
                          ${selectedDepartment === dept.name
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-800/50 text-gray-100 hover:bg-gray-700'
                          }`}
                      >
                        <Users className="h-4 w-4" />
                        {dept.name}
                      </button>
                    ))}
                  </div>

                  <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                    <SelectTrigger className="w-48 bg-gray-100 dark:bg-gray-800/50 text-white border-0 rounded-xl">
                      <ChevronsUpDown className="h-4 w-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-100 dark:bg-gray-800 divide-y divide-gray-200'>
                      {floorOptions.map((floor) => (
                        <SelectItem 
                          key={floor.value} 
                          value={floor.value}
                          className="hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {floor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-3">
                  {selectedHospital.specialties.map((specialty: string) => (
                    <button
                      key={specialty}
                      onClick={() => setSelectedSpecialty(specialty)}
                      className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2
                        ${selectedSpecialty === specialty
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-800/50 text-gray-100 hover:bg-gray-700'
                        }`}
                    >
                      <Stethoscope className="h-4 w-4" />
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Beds Grid by Department */}
              <div className="space-y-8 overflow-hidden">
                {selectedHospital.departments
                  .filter(dept => !selectedDepartment || dept.name === selectedDepartment)
                  .map((dept: Department) => {
                    const departmentBeds = getBedsForDepartment(dept.name);
                    
                    if (departmentBeds.length === 0) return null;

                    console.log("camas por departamento:", departmentBeds)

                    return (
                      <div key={dept.name} 
                        className="bg-gray-800/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700"
                      >
                        <h3 className="text-lg font-medium text-gray-200 mb-6 flex items-center gap-2">
                          <Grid className="h-5 w-5 text-blue-400" />
                          {dept.name}
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                          {[0, 1].map(corridor => {
                            const corridorBeds = departmentBeds
                              .slice(corridor * 3, (corridor + 1) * 3);

                            if (corridorBeds.length === 0) return null;

                            return (
                              <div key={corridor} 
                                className="bg-gray-900/50 p-4 rounded-xl max-w-full overflow-hidden"
                              >
                                <div className="mb-4 text-gray-400 flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Corredor {corridor + 1}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  {corridorBeds.map((bed: IBed) => (
                                    <Card
                                      key={bed.id}
                                      onClick={() => setSelectedBed(bed)}
                                      className={`
                                        cursor-pointer relative transition-all h-48
                                        ${bed.patient ? 'bg-blue-900/20' : 'bg-gray-800/50'}
                                        ${selectedBed?.id === bed.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                                        hover:bg-gray-700/50 rounded-xl backdrop-blur-sm
                                      `}
                                    >
                                      <CardContent className="p-2 h-full flex flex-col">
                                        <div className="flex-1 relative">
                                          <div className="absolute inset-0">
                                            <BedModelCanva
                                              patient={bed.patient}
                                              isSelected={selectedBed?.id === bed.id}
                                            />
                                          </div>
                                        </div>
                                        <div className="text-center mt-2">
                                          <div className="text-sm font-medium text-gray-100">
                                            {bed.number}
                                          </div>
                                          {bed.patient && (
                                            <div className="text-xs text-blue-400 mt-1 truncate">
                                              {bed.patient.name}
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-lg">Selecione um hospital para visualizar os leitos</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Patient Information */}
        <div className="w-96 bg-gray-800/50 p-6 rounded-l-3xl shadow-lg backdrop-blur-sm">
          {selectedBed?.patient ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-blue-400" />
                Patient Information
              </h2>
              <div className="space-y-4 bg-gray-900/50 p-6 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-400 flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    Admission Date
                  </h3>
                  <p className="text-gray-100">
                    {selectedBed.patient.admissionDate}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-400 flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    Expected Discharge
                  </h3>
                  <p className="text-gray-100">
                    {selectedBed.patient.expectedDischarge}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-gray-400">
              <div>
                <BedDouble className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-lg">Selecione uma cama com um paciente para visualizar as informações</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};