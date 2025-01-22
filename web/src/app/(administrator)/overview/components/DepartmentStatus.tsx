import { Card } from "@/components/ui/organisms/card";
import { NetworkData } from "@/types/hospital-network-types";
import { Activity, Users, Bed, Stethoscope, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { useState, useRef, useEffect } from 'react';

interface DepartmentStatusProps {
    networkData: NetworkData,
    selectedHospital: string | null,
    getStatusColor: (status: "normal" | "attention" | "critical") => string
}

const getGradientByOccupancy = (occupancy: number | string) => {
    const occupancyNum = Number(occupancy);
    if (occupancyNum >= 80) return 'bg-gradient-to-br from-pink-100/80 via-rose-100/50 to-red-50/40';
    if (occupancyNum >= 60) return 'bg-gradient-to-br from-amber-100/80 via-yellow-100/50 to-orange-50/40';
    return 'bg-gradient-to-br from-emerald-100/80 via-teal-100/50 to-green-50/40';
};

const getProgressColor = (occupancy: number | string) => {
    const occupancyNum = Number(occupancy);
    if (occupancyNum >= 80) return 'bg-gradient-to-r from-pink-400 to-red-400';
    if (occupancyNum >= 60) return 'bg-gradient-to-r from-amber-400 to-yellow-400';
    return 'bg-gradient-to-r from-emerald-400 to-teal-400';
};

export const DepartmentStatus: React.FC<DepartmentStatusProps> = ({
    networkData,
    selectedHospital
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth;
        const newScrollLeft = direction === 'left' 
            ? container.scrollLeft - scrollAmount 
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };

    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
            container.scrollLeft < (container.scrollWidth - container.clientWidth)
        );
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            checkScroll();
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScroll);
            }
        };
    }, []);

    const renderContent = () => {
        if (!selectedHospital) {
            return (
                <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-gray-800/30 backdrop-blur-sm">
                    <Building2 className="w-16 h-16 text-gray-400 mb-4" />
                    <h4 className="text-xl font-medium text-gray-300 mb-2">Selecione um Hospital</h4>
                    <p className="text-gray-400 text-center max-w-md">
                        Escolha um hospital na lista para visualizar a situação detalhada de seus departamentos.
                    </p>
                </div>
            );
        }

        const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
        if (!hospital?.metrics?.departmental) {
            return (
                <div className="w-full text-center p-8 rounded-xl bg-gray-800/50">
                    <p className="text-gray-400">Nenhum dado disponível para este hospital.</p>
                </div>
            );
        }

        return (
            <div className="flex gap-4 pb-4">
                {Object.entries(hospital.metrics.departmental).map(([deptName, dept]) => (
                    <div 
                        key={deptName} 
                        className={`flex-none w-[360px] p-6 rounded-2xl backdrop-blur-sm ${getGradientByOccupancy(dept.occupancy)}`}
                        style={{ scrollSnapAlign: 'start' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
                                    <Stethoscope className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="text-lg font-medium text-white capitalize">{deptName}</h4>
                            </div>
                            <span className="text-2xl font-semibold text-white">{dept.occupancy}%</span>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-white/80">
                                    <Bed className="w-5 h-5" />
                                    <span>Leitos</span>
                                </div>
                                <span className="text-lg font-medium text-white">{dept.beds}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-white/80">
                                    <Users className="w-5 h-5" />
                                    <span>Pacientes</span>
                                </div>
                                <span className="text-lg font-medium text-white">{dept.patients}</span>
                            </div>
                            
                            <div className="mt-6">
                                <div className="w-full h-2.5 bg-gray-950/20 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(dept.occupancy)}`}
                                        style={{ width: `${dept.occupancy}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-8xl mx-auto p-2">
            <Card className="p-6 bg-gray-950/40 backdrop-blur-sm relative">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-white" />
                    <h3 className="text-2xl font-semibold text-white">Situação dos Departamentos</h3>
                </div>
                
                <div className="relative">
                    {showLeftArrow && (
                        <button 
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-gray-900/50 backdrop-blur-sm text-white hover:bg-gray-900/70 transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                    
                    {showRightArrow && (
                        <button 
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-gray-900/50 backdrop-blur-sm text-white hover:bg-gray-900/70 transition-all"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}

                    <div 
                        ref={scrollContainerRef}
                        className="overflow-x-auto scrollbar-hide"
                        style={{
                            scrollSnapType: 'x mandatory',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        {renderContent()}
                    </div>
                </div>
            </Card>
        </div>
    );
};