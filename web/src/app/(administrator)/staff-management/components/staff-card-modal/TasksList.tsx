import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/organisms/card";

// Tipos
import { IStaffTask, TTaskStatus } from "@/types/staff-types";
import { Calendar } from "lucide-react";

interface ITasksListProps {
    tasks: IStaffTask[];
    isLoading?: boolean;
}

// Sub-componente: Lista de Tarefas
export const TasksList: React.FC<ITasksListProps> = ({
    tasks,
    isLoading
}) => {
    const getStatusColor = (status: TTaskStatus) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            delayed: 'bg-red-100 text-red-800',
            scheduled: 'bg-purple-100 text-purple-800'
        };
        return colors[status];
    };
  
    if (isLoading) {
        return (
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Carregando tarefas...
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mb-6 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Tarefas da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>Responsável: {task.assignedTo}</div>
                    <div>Duração: {task.estimatedDuration}min</div>
                    <div>Prioridade: {task.priority}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    );
};