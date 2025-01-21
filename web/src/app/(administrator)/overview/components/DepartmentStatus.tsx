import { Card } from "@/components/ui/organisms/card";
import { NetworkData } from "@/types/hospital-network-types";
import { Badge } from "lucide-react";

interface DepartmentStatusProps {
    networkData: NetworkData,
    selectedHospital: string | null,
    getStatusColor: (status: "normal" | "attention" | "critical") => string
}

export const DepartmentStatus: React.FC<DepartmentStatusProps> = ({
    networkData,
    selectedHospital,
    getStatusColor
}) => {
    return (
        <div>
            {/* Department Status Section */}
            <Card className="p-4 mt-8 dark:bg-gray-700">
                <h3 className="text-lg font-semibold mb-4">Situação dos Departamentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedHospital &&
                    (() => {
                    const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
                    if (!hospital?.metrics?.departmental) return <p>Nenhum dado disponível.</p>;

                    return Object.entries(hospital.metrics.departmental).map(([deptName, dept]) => (
                        <div key={deptName} className="p-4 rounded-lg dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                            {/* Removido o uso de `dept.icon` pois a API não o fornece */}
                            <h4 className="font-medium">{deptName}</h4>
                            </div>
                            <Badge className={getStatusColor(dept.occupancy)}>
                            {dept.occupancy}%
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                            <span>Ocupação:</span>
                            <span className="font-medium">{dept.occupancy}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                            <span>Leitos:</span>
                            <span className="font-medium">{dept.beds}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                            <span>Pacientes:</span>
                            <span className="font-medium">{dept.patients}</span>
                            </div>
                        </div>
                        </div>
                    ));
                    })()}
                </div>
            </Card>
        </div>
    )
}