import { useState } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CustomButton } from "./Button";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { setTimeToDate } from "../modals/UIUtilities";

export function Calendar({
  value,
  onChange,
  scheduleTime,
  dueTime,
  updateExamData,
}) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const selectedDate = value || new Date();

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date) => {
    onChange?.(date);
    updateExamData({
      scheduleTime: setTimeToDate(date, scheduleTime),
      dueTime: setTimeToDate(date, dueTime),
    });
  };

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });

    const days = [];

    let day = startDate;
    for (let i = 0; i < 42; i++) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const formatDateToInput = (date) => {
    return format(date, "dd-MM-yyyy");
  };

  function isEqual(str1, str2) {
    return String(str1).trim() === String(str2).trim();
  }

  return (
    <div className="p-3 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <CustomButton
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          className="text-gray-500 hover:bg-gray-100"
        >
          <FiChevronLeft className="h-5 w-5" />
        </CustomButton>
        <h2 className="text-base font-medium text-center">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <CustomButton
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="text-gray-500 hover:bg-gray-100"
        >
          <FiChevronRight className="h-5 w-5" />
        </CustomButton>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-rows-6 gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              const isSelected = isEqual(
                formatDateToInput(day),
                formatDateToInput(selectedDate)
              );
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const dayNumber = format(day, "d");

              return (
                <button
                  key={dayIndex}
                  className={`
                    w-full p-2 rounded-md text-xs font-normal justify-center
                    ${
                      isSelected
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "hover:bg-gray-100"
                    }
                    ${!isCurrentMonth ? "text-gray-400" : ""}
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  {dayNumber}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
