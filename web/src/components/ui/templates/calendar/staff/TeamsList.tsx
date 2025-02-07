import { Badge } from "@/components/ui/organisms/badge"
import { ScrollArea } from "@/components/ui/organisms/scroll-area"
import { IStaffTeam } from "@/types/staff-types";
import { Users } from "lucide-react"

interface ITeamsList {
    teams: IStaffTeam[];
    selectedTeam: IStaffTeam | null;
    onSelectTeam: (team: IStaffTeam) => void;
}

export const TeamsList: React.FC<ITeamsList> = ({ 
    teams,
    selectedTeam,
    onSelectTeam,
}) => {
    return (
        <div className="h-48">
            <ScrollArea className="h-full">
                <div className="p-2 space-y-2">
                    {teams.map((team) => (
                    <button
                        key={team.id}
                        className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                        selectedTeam?.id === team.id
                            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-4 border-blue-500'
                            : 'hover:bg-blue-800/30'
                        }`}
                        onClick={() => onSelectTeam(team)}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">{team.name}</h3>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-blue-300/80">{team.department}</span>
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                                        {team.shift}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-300/80" />
                                <span className="text-sm text-blue-300/80">{team.members.length}</span>
                            </div>
                        </div>
                    </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}