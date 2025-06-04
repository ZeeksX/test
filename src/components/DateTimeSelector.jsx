import { useMemo, useState, useEffect } from "react";
import { format, set, isAfter, isBefore, isSameDay } from "date-fns";
import { Calendar } from "./ui/Calendar";
import { Input } from "./ui/Input";
import { FiHelpCircle, FiInfo } from "react-icons/fi";
import { parseTimeString, setTimeToDate } from "./modals/UIUtilities";
import { Label } from "./ui/Label";
import Toast from "./modals/Toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Tooltip";

export default function DateTimeSelector({ examData, updateExamData }) {
  const [date, setDate] = useState(
    examData.scheduleTime == "" ? new Date() : new Date(examData.scheduleTime)
  );
  const [scheduleTime, setScheduleTime] = useState(
    examData.scheduleTime == ""
      ? "00:00"
      : examData.scheduleTime.toTimeString().slice(0, 5)
  );
  const [dueTime, setDueTime] = useState(
    examData.dueTime == ""
      ? "23:59"
      : examData.dueTime.toTimeString().slice(0, 5)
  );

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const currentDate = new Date();
  const currentTime = format(currentDate, "HH:mm");

  // Check if selected date is today
  const isToday = useMemo(() => {
    return isSameDay(date, currentDate);
  }, [date, currentDate]);

  // Check if selected date is in the past
  const isDateInPast = useMemo(() => {
    const selectedDateOnly = new Date(date);
    selectedDateOnly.setHours(0, 0, 0, 0);
    const todayOnly = new Date(currentDate);
    todayOnly.setHours(0, 0, 0, 0);
    return isBefore(selectedDateOnly, todayOnly);
  }, [date, currentDate]);

  // Validate schedule time against current time
  const isScheduleTimeValid = useMemo(() => {
    if (isDateInPast) return false;
    if (isToday) {
      return scheduleTime >= currentTime;
    }
    return true;
  }, [scheduleTime, currentTime, isToday, isDateInPast]);

  // Validate due time against schedule time
  const isDueTimeValid = useMemo(() => {
    return dueTime > scheduleTime;
  }, [dueTime, scheduleTime]);

  // Get minimum time for schedule input
  const getMinScheduleTime = () => {
    if (isToday) {
      return currentTime;
    }
    return "00:00";
  };

  // Get minimum time for due input
  const getMinDueTime = () => {
    // Due time must be at least 1 minute after schedule time
    const [hours, minutes] = scheduleTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + 1;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    if (newHours >= 24) {
      return "23:59"; // Cap at end of day
    }

    return `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDateToInput = (date) => {
    return format(date, "dd-MM-yyyy");
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  // Handle date change with validation
  const handleDateChange = (newDate) => {
    const newDateOnly = new Date(newDate);
    newDateOnly.setHours(0, 0, 0, 0);
    const todayOnly = new Date(currentDate);
    todayOnly.setHours(0, 0, 0, 0);

    if (isBefore(newDateOnly, todayOnly)) {
      showToast("Cannot select a date in the past.", "error");
      return;
    }

    setDate(newDate);

    // If changing to today, validate current schedule time
    if (isSameDay(newDate, currentDate)) {
      if (scheduleTime < currentTime) {
        const newScheduleTime = currentTime;
        setScheduleTime(newScheduleTime);

        // Also update due time if it becomes invalid
        if (dueTime <= newScheduleTime) {
          const minDueTime = getMinDueTime();
          setDueTime(minDueTime);
          updateExamData({
            scheduleTime: setTimeToDate(newDate, newScheduleTime),
            dueTime: setTimeToDate(newDate, minDueTime),
          });
        } else {
          updateExamData({
            scheduleTime: setTimeToDate(newDate, newScheduleTime),
            dueTime: setTimeToDate(newDate, dueTime),
          });
        }

        showToast(
          "Schedule time adjusted to current time since date is today.",
          "info"
        );
      } else {
        updateExamData({
          scheduleTime: setTimeToDate(newDate, scheduleTime),
          dueTime: setTimeToDate(newDate, dueTime),
        });
      }
    } else {
      updateExamData({
        scheduleTime: setTimeToDate(newDate, scheduleTime),
        dueTime: setTimeToDate(newDate, dueTime),
      });
    }
  };

  // Handle schedule time change with validation
  const handleScheduleTimeChange = (e) => {
    const newScheduleTime = e.target.value;

    // Check if schedule time is in the past (for today)
    // if (isToday && newScheduleTime < currentTime) {
    //   showToast("Schedule time cannot be in the past.", "error");
    //   return;
    // }

    // Check if due time is still valid
    // if (dueTime <= newScheduleTime) {
    //   showToast("Due time must be later than schedule time.", "error");
    //   return;
    // }

    setScheduleTime(newScheduleTime);
    updateExamData({
      scheduleTime: setTimeToDate(date, newScheduleTime),
    });
  };

  // Handle due time change with validation
  const handleDueTimeChange = (e) => {
    const newDueTime = e.target.value;

    // if (newDueTime <= scheduleTime) {
    //   showToast("Due time must be later than schedule time.", "error");
    //   return;
    // }

    setDueTime(newDueTime);
    updateExamData({
      dueTime: setTimeToDate(date, newDueTime),
    });
  };

  // Auto-adjust times when component mounts or date changes
  useEffect(() => {
    if (isToday && scheduleTime < currentTime) {
      const newScheduleTime = currentTime;
      setScheduleTime(newScheduleTime);

      if (dueTime <= newScheduleTime) {
        const minDueTime = getMinDueTime();
        setDueTime(minDueTime);
      }
    }
  }, [date, isToday]);

  return (
    <TooltipProvider>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <Calendar
              value={date}
              onChange={handleDateChange}
              scheduleTime={scheduleTime}
              dueTime={dueTime}
              updateExamData={updateExamData}
              // Disable past dates
              minDate={currentDate}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="scheduleDate"
                className="block text-sm font-medium"
              >
                Schedule Date
              </label>
              <Input
                id="scheduleDate"
                value={formatDateToInput(date)}
                readOnly
                className={`w-full ${
                  isDateInPast ? "border-red-300 bg-red-50" : ""
                }`}
              />
              {isDateInPast && (
                <p className="text-xs text-red-600">
                  Date cannot be in the past
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="scheduleTime"
                  className="text-sm font-medium flex items-center gap-1 w-full justify-between"
                >
                  Schedule Time
                  <Tooltip>
                    <TooltipTrigger>
                      <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-gray-900 text-white p-3 rounded-lg max-w-xs"
                    >
                      <p className="font-medium mb-1">Schedule Time</p>
                      <p className="text-sm">
                        Choose when the questions should be available to the
                        students.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="time"
                  name="scheduleTime"
                  id="scheduleTime"
                  value={scheduleTime || ""}
                  onChange={handleScheduleTimeChange}
                  min={getMinScheduleTime()}
                  placeholder="Select Time"
                  className={`${
                    !isScheduleTimeValid ? "border-red-300 bg-red-50" : ""
                  }`}
                  required
                />
                {!isScheduleTimeValid && (
                  <p className="text-xs text-red-600">
                    {isToday
                      ? "Schedule time cannot be in the past"
                      : "Invalid schedule time"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dueTime"
                  className="text-sm font-medium flex items-center gap-1 w-full justify-between"
                >
                  Due Time
                  <Tooltip>
                    <TooltipTrigger>
                      <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-gray-900 text-white p-3 rounded-lg max-w-xs"
                    >
                      <p className="font-medium mb-1">Due Time</p>
                      <p className="text-sm">Set when the assignment is due.</p>
                    </TooltipContent>
                  </Tooltip>{" "}
                </Label>
                <Input
                  type="time"
                  name="dueTime"
                  id="dueTime"
                  value={dueTime || ""}
                  onChange={handleDueTimeChange}
                  min={getMinDueTime()}
                  placeholder="Select Time"
                  className={`${
                    !isDueTimeValid ? "border-red-300 bg-red-50" : ""
                  }`}
                  required
                />
                {!isDueTimeValid && (
                  <p className="text-xs text-red-600">
                    Due time must be later than schedule time
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={closeToast}
        />
      </div>
    </TooltipProvider>
  );
}
