/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { FaHeart, FaChild, FaUserNurse, FaProcedures, FaHospital } from 'react-icons/fa';
import { AlertCircle, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Cores e ícones dos departamentos
const departmentColors: Record<string, { bg: string; icon: string }> = {
    uti: { 
      bg: 'from-red-400/90 to-red-600/90 dark:from-red-500/80 dark:to-red-700/80',
      icon: 'bg-red-400/30 text-red-100'
    },
    enfermaria: { 
      bg: 'from-blue-400/90 to-blue-600/90 dark:from-blue-500/80 dark:to-blue-700/80',
      icon: 'bg-blue-400/30 text-blue-100'
    },
    pediatria: { 
      bg: 'from-green-400/90 to-green-600/90 dark:from-green-500/80 dark:to-green-700/80',
      icon: 'bg-green-400/30 text-green-100'
    },
    cardiologia: { 
      bg: 'from-purple-400/90 to-purple-600/90 dark:from-purple-500/80 dark:to-purple-700/80',
      icon: 'bg-purple-400/30 text-purple-100'
    },
    placeholder: { 
      bg: 'from-gray-400/90 to-gray-600/90 dark:from-gray-500/80 dark:to-gray-700/80',
      icon: 'bg-gray-400/30 text-gray-100'
    }
};

const departmentIcons: Record<string, JSX.Element> = {
    uti: <FaHeart size={24} />,
    enfermaria: <FaUserNurse size={24} />,
    pediatria: <FaChild size={24} />,
    cardiologia: <FaProcedures size={24} />,
    placeholder: <FaHospital size={24} />
};

interface IDepartmentAreaCardsProps {
    departments: { area: string; count: number; capacity: number }[];
    onClick: (area: string) => void;
    selectedArea: string;
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
}

// Card de Skeleton Loading
const LoadingCard: React.FC = () => (
    <motion.div 
        className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-100/90 to-gray-200/90 
                 dark:from-gray-800/90 dark:to-gray-700/90 shadow-lg w-[200px] h-[220px] 
                 overflow-hidden"
    >
        {/* Overlay de gradiente */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 
                     via-transparent to-transparent opacity-50">
        </div>

        {/* Efeito de shimmer */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] 
                     bg-gradient-to-r from-transparent via-white/20 to-transparent">
        </div>

        {/* Conteúdo do skeleton */}
        <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-300/30 dark:bg-gray-600/30"></div>
                <div className="w-20 h-4 rounded bg-gray-300/30 dark:bg-gray-600/30"></div>
            </div>

            <div className="mt-auto space-y-4">
                <div className="flex justify-between items-center">
                    <div className="w-16 h-3 rounded bg-gray-300/30 dark:bg-gray-600/30"></div>
                    <div className="w-12 h-3 rounded bg-gray-300/30 dark:bg-gray-600/30"></div>
                </div>
                <div className="w-24 h-3 rounded bg-gray-300/30 dark:bg-gray-600/30"></div>
                <div className="w-full h-2 rounded-full bg-gray-300/30 dark:bg-gray-600/30"></div>
            </div>
        </div>
    </motion.div>
);

// Card quando nenhum hospital está selecionado
const NoHospitalSelectedCard: React.FC = () => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative p-6 rounded-2xl cursor-default shadow-lg bg-gradient-to-br 
                 from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 
                 border border-blue-200/50 dark:border-blue-700/50 w-[200px] h-[220px]"
    >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 
                     via-transparent to-transparent opacity-50">
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
            <div className="p-4 bg-blue-100/50 dark:bg-blue-800/30 rounded-full">
                <Building2 className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 text-center">
                Selecione um Hospital
            </h3>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 text-center">
                Visualize os departamentos
            </p>
        </div>
    </motion.div>
);

// Card de erro
const ErrorCard: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative p-4 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg 
                 bg-gradient-to-br from-red-400/90 to-red-600/90 dark:from-red-500/80 dark:to-red-700/80 
                 w-[200px] h-[220px]"
        onClick={onRetry}
    >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent 
                     to-transparent blur-lg opacity-50">
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
            <div className="p-3 bg-white/20 rounded-full shadow-md">
                <AlertCircle size={24} className="text-white" />
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-white">
                    {message}
                </p>
                {onRetry && (
                    <button 
                        className="mt-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full 
                                text-xs text-white transition-colors"
                        onClick={onRetry}
                    >
                        Tentar novamente
                    </button>
                )}
            </div>
        </div>
    </motion.div>
);

// Componente principal
export const DepartmentAreaCards: React.FC<IDepartmentAreaCardsProps> = ({ 
    departments, 
    onClick, 
    selectedArea,
    loading,
    error,
    onRetry 
}) => {
    const uniqueDepartments = Array.from(
        new Map(departments.map((dept) => [dept.area, dept])).values()
    );

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: true,
        responsive: [
            { breakpoint: 1536, settings: { slidesToShow: 4 } },
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    // Componentes personalizados para as setas
    function NextArrow(props: any) {
        const { onClick } = props;
        return (
            <button
                onClick={onClick}
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full 
                         bg-white/90 dark:bg-gray-800/90 shadow-lg hover:bg-white dark:hover:bg-gray-700 
                         transition-all duration-200 group"
            >
                <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300 
                                    group-hover:text-gray-900 dark:group-hover:text-white" />
            </button>
        );
    }

    function PrevArrow(props: any) {
        const { onClick } = props;
        return (
            <button
                onClick={onClick}
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full 
                         bg-white/90 dark:bg-gray-800/90 shadow-lg hover:bg-white dark:hover:bg-gray-700 
                         transition-all duration-200 group"
            >
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300 
                                   group-hover:text-gray-900 dark:group-hover:text-white" />
            </button>
        );
    }

    if (loading) {
        return (
            <div className="relative">
                <Slider {...settings} className="gap-x-2 pl-0">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <div key={`loading-${index}`} className="px-2">
                            <LoadingCard />
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative">
                <Slider {...settings} className="gap-x-4 -mx-2">
                    <div className="px-2">
                        <ErrorCard message="Erro ao carregar departamentos" onRetry={onRetry} />
                    </div>
                </Slider>
            </div>
        );
    }

    if (uniqueDepartments.length === 0) {
        return (
            <div className="relative">
                <Slider {...settings} className="gap-x-4 -mx-2">
                    <div className="px-2">
                        <NoHospitalSelectedCard />
                    </div>
                </Slider>
            </div>
        );
    }

    return (
        <div className="relative">
            <Slider {...settings} className="gap-x-4 -mx-2 pl-20">
                {uniqueDepartments.map(({ area, count, capacity }) => {
                    const progressPercentage = (count / capacity) * 100;
                    const isSelected = selectedArea === area;
                    const colors = departmentColors[area] || departmentColors.placeholder;

                    return (
                        <div key={area} className="px-2">
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 
                                        shadow-lg bg-gradient-to-br ${colors.bg} w-[200px] h-[220px]
                                        ${isSelected ? 'ring-2 ring-white/50 shadow-xl' : ''}`}
                                onClick={() => onClick(area)}
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 
                                             via-transparent to-transparent opacity-50">
                                </div>
                                
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-3 rounded-full ${colors.icon}`}>
                                            {departmentIcons[area]}
                                        </div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                                            {area}
                                        </h3>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-white/90">Ocupação</span>
                                            <span className="text-sm font-bold text-white">
                                                {progressPercentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-white/90 mb-3">
                                            {count}/{capacity} pacientes
                                        </p>
                                        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-white transition-all duration-500"
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};