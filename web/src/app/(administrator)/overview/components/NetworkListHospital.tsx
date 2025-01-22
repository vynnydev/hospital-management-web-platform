import React from 'react';
import { Card } from "@/components/ui/organisms/card";
import { AppUser } from "@/types/auth-types";
import { Hospital } from "@/types/hospital-network-types";
import { Building2, MapPin } from "lucide-react";

interface NetworkListHospitalProps {
    filteredHospitals: Hospital[],
    setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>,
    currentUser: AppUser | null
}

const ProgressIndicator = ({ value }: { value: number }) => {
    const segments = 25;
    const filledSegments = Math.floor((value / 100) * segments);

    return (
        <div className="flex space-x-0.5">
            {[...Array(segments)].map((_, idx) => (
                <div
                    key={idx}
                    className={`h-2 w-2 rounded-sm transition-all duration-200 
                        ${idx < filledSegments 
                            ? 'bg-gradient-to-r from-blue-500 to-teal-400' 
                            : 'bg-gray-200 dark:bg-gray-600'}`}
                />
            ))}
        </div>
    );
};

export const NetworkListHospital: React.FC<NetworkListHospitalProps> = ({
    filteredHospitals,
    setSelectedHospital,
    currentUser
}) => {
    return (
        <div className="w-full h-full">
            <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentUser?.permissions.includes('VIEW_ALL_HOSPITALS')
                            ? 'Hospitais da Rede'
                            : 'Seu Hospital'}
                    </h3>
                </div>
                
                {/* Container com scroll */}
                <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    {filteredHospitals.map(hospital => (
                        <div
                            key={hospital.id}
                            className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 
                                     rounded-xl border border-gray-100 dark:border-gray-700 
                                     hover:bg-blue-50 dark:hover:bg-gray-700 
                                     cursor-pointer transition-all duration-200"
                            onClick={() => setSelectedHospital(hospital.id)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-lg 
                                              group-hover:bg-blue-100 dark:group-hover:bg-gray-600 
                                              transition-colors">
                                    <Building2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                        {hospital.name}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>
                                            {hospital.unit.city}, {hospital.unit.state}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                                    {hospital.metrics.overall.occupancyRate}%
                                </span>
                                <div className="w-48">
                                    <ProgressIndicator value={hospital.metrics.overall.occupancyRate} />
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Taxa de Ocupação
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
