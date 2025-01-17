import { Card } from "@/components/ui/organisms/card"
import { Hospital } from "@/types/hospital-network-types"
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"

interface OccupancyRateChartsProps {
    filteredHospitals: Hospital[]
}

export const OccupancyRateCharts: React.FC<OccupancyRateChartsProps> = ({
    filteredHospitals,
}) => {
    return (
        <div>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Taxa de Ocupação</h3>
              <BarChart
                width={500}
                height={300}
                data={filteredHospitals.map(h => ({
                  name: h.name.replace('Hospital ', ''),
                  ocupacao: h.metrics.overall.occupancyRate
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ocupacao" fill="#3b82f6" name="Ocupação %" />
              </BarChart>
            </Card>
        </div>
    )
}