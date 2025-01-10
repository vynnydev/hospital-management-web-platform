/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick'; // Biblioteca para o carrossel
import { FaHospital, FaHeart, FaChild, FaUserNurse, FaProcedures } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Cores de fundo
const departmentColors: Record<string, string> = {
    uti: 'from-red-400 via-red-600 to-red-800',
    enfermaria: 'from-blue-400 via-blue-600 to-blue-800',
    pediatria: 'from-green-400 via-green-600 to-green-800',
    cardiologia: 'from-purple-400 via-purple-600 to-purple-800',
};

// Ícones dos departamentos
const departmentIcons: Record<string, JSX.Element> = {
    todos: <FaHospital size={24} />,
    uti: <FaHeart size={24} />,
    enfermaria: <FaUserNurse size={24} />,
    pediatria: <FaChild size={24} />,
    cardiologia: <FaProcedures size={24} />,
};

export const DepartmentAreaCards: React.FC<{
    departments: { area: string; count: number; capacity: number }[];
    onClick: (area: string) => void; // Função recebida do pai
    selectedArea: string;
}> = ({ departments, onClick, selectedArea }) => {
    const uniqueDepartments = Array.from(
        new Map(departments.map((dept) => [dept.area, dept])).values()
    );

    const totalSlides = 5;
    const placeholders = Array(Math.max(0, totalSlides - uniqueDepartments.length)).fill(null);

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 480, settings: { slidesToShow: 2 } },
        ],
    };

    return (
        <Slider {...settings} className="mt-6 gap-x-4">
            {uniqueDepartments.map(({ area, count, capacity }) => {
                const progressPercentage = (count / capacity) * 100;
                const isSelected = selectedArea === area;

                return (
                    <motion.div
                        key={area}
                        whileHover={{ scale: 1.05 }}
                        className={`relative p-4 rounded-2xl cursor-pointer transition-transform duration-300 shadow-lg bg-gradient-to-br ${departmentColors[area]} w-[150px] h-[220px] ${
                            isSelected ? 'ring-4 ring-blue-300 ring-opacity-50' : ''
                        }`}
                        onClick={() => onClick(area)} // Chama a função passada pelo pai
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent blur-lg opacity-50 pointer-events-none"></div>
                        <div className="relative z-10 flex justify-between items-center mb-4">
                            <div className="p-2 bg-black/40 rounded-full shadow-md flex items-center justify-center">
                                {departmentIcons[area]}
                            </div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                                {area}
                            </h3>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-semibold text-white mb-2">
                                {count}/{capacity} pacientes
                            </p>
                            <div className="w-full mt-2 bg-white/30 rounded-full h-2">
                                <div
                                    className="h-full rounded-full bg-white transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            {placeholders.map((_, index) => (
                <div
                    key={`placeholder-${index}`}
                    className="w-[200px] h-[220px] bg-transparent"
                ></div>
            ))}
        </Slider>
    );
};

