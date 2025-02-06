import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/organisms/card";

// Sub-componente: Membros da Equipe
export const TeamMembers = ({ members }: { members: string[] }) => (
    <Card className="mb-6 bg-gray-100 dark:bg-gray-700 rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Membros da Equipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium">{member}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
);