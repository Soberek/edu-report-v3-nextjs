import dayjs from "dayjs";
import { TodoState } from "../types";

interface TodoCalendarProps {
  state: TodoState;
}

export const TodoCalendar = ({ state }: TodoCalendarProps) => {
  const today = dayjs();

  // Generate calendar days
  const generateCalendarDays = () => {
    const startOfMonth = dayjs().startOf("month");
    const endOfMonth = dayjs().endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    const days = [];
    let current = startDate;

    while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Kalendarz zadań</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center mb-6">
          <h4 className="text-xl font-semibold text-gray-900">{today.format("MMMM YYYY")}</h4>
        </div>

        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nie"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-3">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayTodos = state.todos.filter((todo) => dayjs(todo.dueDate).isSame(day, "day"));
            const isToday = day.isSame(today, "day");
            const isCurrentMonth = day.isSame(today, "month");
            const completedCount = dayTodos.filter((todo) => todo.completed).length;
            const pendingCount = dayTodos.length - completedCount;

            return (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg cursor-pointer transition-colors hover:shadow-md ${
                  isToday ? "bg-blue-600 text-white shadow-lg" : isCurrentMonth ? "hover:bg-gray-100 bg-white" : "text-gray-400 bg-gray-50"
                }`}
              >
                <span className="font-medium mb-1">{day.format("D")}</span>
                {dayTodos.length > 0 && (
                  <div className="flex flex-col space-y-1">
                    {completedCount > 0 && (
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(completedCount, 3) }).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        ))}
                        {completedCount > 3 && <div className="w-1.5 h-1.5 rounded-full bg-green-300" />}
                      </div>
                    )}
                    {pendingCount > 0 && (
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(pendingCount, 3) }).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        ))}
                        {pendingCount > 3 && <div className="w-1.5 h-1.5 rounded-full bg-orange-300" />}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-gray-600">Ukończone</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span className="text-gray-600">Do zrobienia</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-gray-600">Dzisiaj</span>
          </div>
        </div>
      </div>
    </div>
  );
};
