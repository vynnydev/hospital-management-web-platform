"use client"

import { Heart, Activity, Thermometer } from "lucide-react"


export const HealthDashboard = () => {
    return (
        <div className="-mt-20 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-lg pt-2">
            <div className="bg-gray-100 dark:bg-[#0f1729] p-4 md:p-6 text-white rounded-lg">
                <div className="max-w-8xl space-y-6">
                    {/* Vital Signs Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Heart Rate Card */}
                    <div className="bg-[#1a2235] rounded-xl p-5">
                        <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-300 font-medium">Batimentos Cardíacos</h3>
                        <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                        </div>
                        <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">75</span>
                        <span className="text-gray-400 text-sm">bpm</span>
                        </div>
                        <div className="mt-4 bg-gray-700 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full w-[60%]"></div>
                        </div>
                    </div>
            
                    {/* Blood Pressure Card */}
                    <div className="bg-[#1a2235] rounded-xl p-5">
                        <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-300 font-medium">Pressão Arterial</h3>
                        <Activity className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">120/80</span>
                        <span className="text-gray-400 text-sm">mmHg</span>
                        </div>
                        <div className="mt-4 bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-[75%]"></div>
                        </div>
                    </div>
            
                    {/* Oxygen Card */}
                    <div className="bg-[#1a2235] rounded-xl p-5">
                        <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-300 font-medium">Oxigenação</h3>
                        <svg
                            className="h-5 w-5 text-green-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            />
                            <path
                            d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z"
                            fill="currentColor"
                            />
                        </svg>
                        </div>
                        <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">98</span>
                        <span className="text-gray-400 text-sm">%</span>
                        </div>
                        <div className="mt-4 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[98%]"></div>
                        </div>
                    </div>
            
                    {/* Temperature Card */}
                    <div className="bg-[#1a2235] rounded-xl p-5">
                        <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-300 font-medium">Temperatura</h3>
                        <Thermometer className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">36.5</span>
                        <span className="text-gray-400 text-sm">°C</span>
                        </div>
                        <div className="mt-4 bg-gray-700 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full w-[40%]"></div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}