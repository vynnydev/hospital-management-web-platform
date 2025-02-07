import { DayPicker } from "react-day-picker"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IMiniCalendarProps {
    selectedDate: Date
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
}

export const MiniCalendar: React.FC<IMiniCalendarProps> = ({
    selectedDate,
    setSelectedDate
}) => {
    return (
        <div className="flex-shrink-0 z-40 p-4 border-t border-blue-800/30 bg-gradient-to-b from-blue-900 to-cyan-900/30">
            <div className="mb-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-white">
                    {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
                </span>
            </div>
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={ptBR}
                showOutsideDays={false}
                className="rounded-lg border border-blue-800/30 bg-gradient-to-br from-blue-900/20 to-cyan-900/20"
                classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center text-blue-100 font-medium",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-blue-300/80 hover:text-white",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex justify-around",
                    head_cell: "text-blue-300/80 font-normal text-center rounded-md w-9 font-medium text-[0.8rem]",
                    row: "flex w-full mt-2 justify-around",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-500/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal text-blue-100 hover:bg-blue-800/50 focus:bg-blue-800/50 rounded-md aria-selected:opacity-100",
                    day_selected: "bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white hover:bg-blue-500 focus:bg-blue-500 focus:text-white",
                    day_today: "bg-blue-800/50 text-white font-semibold",
                    day_outside: "text-slate-500 opacity-50",
                    day_disabled: "text-slate-500 opacity-50",
                    day_range_middle: "aria-selected:bg-blue-500/20 aria-selected:text-slate-900",
                    day_hidden: "invisible",
                }}
            />
      </div>
    )
}