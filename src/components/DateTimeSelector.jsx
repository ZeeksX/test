// import { useMemo, useState, useEffect } from "react";
// import { format, set, isAfter, isBefore, isSameDay } from "date-fns";
// import { Calendar } from "./ui/Calendar";
// import { Input } from "./ui/Input";
// import { FiHelpCircle, FiInfo } from "react-icons/fi";
// import { parseTimeString, setTimeToDate } from "./modals/UIUtilities";
// import { Label } from "./ui/Label";
// import Toast from "./modals/Toast";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "./ui/Tooltip";

// export default function DateTimeSelector({ examData, updateExamData }) {
//   const [date, setDate] = useState(
//     examData.scheduleTime == "" ? new Date() : new Date(examData.scheduleTime)
//   );
//   const [scheduleTime, setScheduleTime] = useState(
//     examData.scheduleTime == ""
//       ? "00:00"
//       : examData.scheduleTime.toTimeString().slice(0, 5)
//   );
//   const [dueTime, setDueTime] = useState(
//     examData.dueTime == ""
//       ? "23:59"
//       : examData.dueTime.toTimeString().slice(0, 5)
//   );

//   const [toast, setToast] = useState({
//     open: false,
//     message: "",
//     severity: "info",
//   });

//   const currentDate = new Date();
//   const currentTime = format(currentDate, "HH:mm");

//   // Check if selected date is today
//   const isToday = useMemo(() => {
//     return isSameDay(date, currentDate);
//   }, [date, currentDate]);

//   // Check if selected date is in the past
//   const isDateInPast = useMemo(() => {
//     const selectedDateOnly = new Date(date);
//     selectedDateOnly.setHours(0, 0, 0, 0);
//     const todayOnly = new Date(currentDate);
//     todayOnly.setHours(0, 0, 0, 0);
//     return isBefore(selectedDateOnly, todayOnly);
//   }, [date, currentDate]);

//   // Validate schedule time against current time
//   const isScheduleTimeValid = useMemo(() => {
//     if (isDateInPast) return false;
//     if (isToday) {
//       return scheduleTime >= currentTime;
//     }
//     return true;
//   }, [scheduleTime, currentTime, isToday, isDateInPast]);

//   // Validate due time against schedule time
//   const isDueTimeValid = useMemo(() => {
//     return dueTime > scheduleTime;
//   }, [dueTime, scheduleTime]);

//   // Get minimum time for schedule input
//   const getMinScheduleTime = () => {
//     if (isToday) {
//       return currentTime;
//     }
//     return "00:00";
//   };

//   // Get minimum time for due input
//   const getMinDueTime = () => {
//     // Due time must be at least 1 minute after schedule time
//     const [hours, minutes] = scheduleTime.split(":").map(Number);
//     const totalMinutes = hours * 60 + minutes + 1;
//     const newHours = Math.floor(totalMinutes / 60);
//     const newMinutes = totalMinutes % 60;

//     if (newHours >= 24) {
//       return "23:59"; // Cap at end of day
//     }

//     return `${newHours.toString().padStart(2, "0")}:${newMinutes
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const formatDateToInput = (date) => {
//     return format(date, "dd-MM-yyyy");
//   };

//   const showToast = (message, severity = "info") => {
//     setToast({ open: true, message, severity });
//   };

//   const closeToast = () => {
//     setToast({ open: false, message: "", severity: "info" });
//   };

//   // Handle date change with validation
//   const handleDateChange = (newDate) => {
//     const newDateOnly = new Date(newDate);
//     newDateOnly.setHours(0, 0, 0, 0);
//     const todayOnly = new Date(currentDate);
//     todayOnly.setHours(0, 0, 0, 0);

//     if (isBefore(newDateOnly, todayOnly)) {
//       showToast("Cannot select a date in the past.", "error");
//       return;
//     }

//     setDate(newDate);

//     // If changing to today, validate current schedule time
//     if (isSameDay(newDate, currentDate)) {
//       if (scheduleTime < currentTime) {
//         const newScheduleTime = currentTime;
//         setScheduleTime(newScheduleTime);

//         // Also update due time if it becomes invalid
//         if (dueTime <= newScheduleTime) {
//           const minDueTime = getMinDueTime();
//           setDueTime(minDueTime);
//           updateExamData({
//             scheduleTime: setTimeToDate(newDate, newScheduleTime),
//             dueTime: setTimeToDate(newDate, minDueTime),
//           });
//         } else {
//           updateExamData({
//             scheduleTime: setTimeToDate(newDate, newScheduleTime),
//             dueTime: setTimeToDate(newDate, dueTime),
//           });
//         }

//         showToast(
//           "Schedule time adjusted to current time since date is today.",
//           "info"
//         );
//       } else {
//         updateExamData({
//           scheduleTime: setTimeToDate(newDate, scheduleTime),
//           dueTime: setTimeToDate(newDate, dueTime),
//         });
//       }
//     } else {
//       updateExamData({
//         scheduleTime: setTimeToDate(newDate, scheduleTime),
//         dueTime: setTimeToDate(newDate, dueTime),
//       });
//     }
//   };

//   // Handle schedule time change with validation
//   const handleScheduleTimeChange = (e) => {
//     const newScheduleTime = e.target.value;

//     // Check if schedule time is in the past (for today)
//     // if (isToday && newScheduleTime < currentTime) {
//     //   showToast("Schedule time cannot be in the past.", "error");
//     //   return;
//     // }

//     // Check if due time is still valid
//     // if (dueTime <= newScheduleTime) {
//     //   showToast("Due time must be later than schedule time.", "error");
//     //   return;
//     // }

//     setScheduleTime(newScheduleTime);
//     updateExamData({
//       scheduleTime: setTimeToDate(date, newScheduleTime),
//     });
//   };

//   // Handle due time change with validation
//   const handleDueTimeChange = (e) => {
//     const newDueTime = e.target.value;

//     // if (newDueTime <= scheduleTime) {
//     //   showToast("Due time must be later than schedule time.", "error");
//     //   return;
//     // }

//     setDueTime(newDueTime);
//     updateExamData({
//       dueTime: setTimeToDate(date, newDueTime),
//     });
//   };

//   // Auto-adjust times when component mounts or date changes
//   useEffect(() => {
//     if (isToday && scheduleTime < currentTime) {
//       const newScheduleTime = currentTime;
//       setScheduleTime(newScheduleTime);

//       if (dueTime <= newScheduleTime) {
//         const minDueTime = getMinDueTime();
//         setDueTime(minDueTime);
//       }
//     }
//   }, [date, isToday]);

//   return (
//     <TooltipProvider>
//       <div className="max-w-3xl mx-auto space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="border rounded-lg overflow-hidden shadow-sm">
//             <Calendar
//               value={date}
//               onChange={handleDateChange}
//               scheduleTime={scheduleTime}
//               dueTime={dueTime}
//               updateExamData={updateExamData}
//               // Disable past dates
//               minDate={currentDate}
//             />
//           </div>

//           <div className="space-y-6">
//             <div className="space-y-2">
//               <label
//                 htmlFor="scheduleDate"
//                 className="block text-sm font-medium"
//               >
//                 Schedule Date
//               </label>
//               <Input
//                 id="scheduleDate"
//                 value={formatDateToInput(date)}
//                 readOnly
//                 className={`w-full ${
//                   isDateInPast ? "border-red-300 bg-red-50" : ""
//                 }`}
//               />
//               {isDateInPast && (
//                 <p className="text-xs text-red-600">
//                   Date cannot be in the past
//                 </p>
//               )}
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="scheduleTime"
//                   className="text-sm font-medium flex items-center gap-1 w-full justify-between"
//                 >
//                   Schedule Time
//                   <Tooltip>
//                     <TooltipTrigger>
//                       <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
//                     </TooltipTrigger>
//                     <TooltipContent
//                       side="top"
//                       className="bg-gray-900 text-white p-3 rounded-lg max-w-xs"
//                     >
//                       <p className="font-medium mb-1">Schedule Time</p>
//                       <p className="text-sm">
//                         Choose when the questions should be available to the
//                         students.
//                       </p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </Label>
//                 <Input
//                   type="time"
//                   name="scheduleTime"
//                   id="scheduleTime"
//                   value={scheduleTime || ""}
//                   onChange={handleScheduleTimeChange}
//                   min={getMinScheduleTime()}
//                   placeholder="Select Time"
//                   className={`${
//                     !isScheduleTimeValid ? "border-red-300 bg-red-50" : ""
//                   }`}
//                   required
//                 />
//                 {!isScheduleTimeValid && (
//                   <p className="text-xs text-red-600">
//                     {isToday
//                       ? "Schedule time cannot be in the past"
//                       : "Invalid schedule time"}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="dueTime"
//                   className="text-sm font-medium flex items-center gap-1 w-full justify-between"
//                 >
//                   Due Time
//                   <Tooltip>
//                     <TooltipTrigger>
//                       <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
//                     </TooltipTrigger>
//                     <TooltipContent
//                       side="top"
//                       className="bg-gray-900 text-white p-3 rounded-lg max-w-xs"
//                     >
//                       <p className="font-medium mb-1">Due Time</p>
//                       <p className="text-sm">Set when the assignment is due.</p>
//                     </TooltipContent>
//                   </Tooltip>{" "}
//                 </Label>
//                 <Input
//                   type="time"
//                   name="dueTime"
//                   id="dueTime"
//                   value={dueTime || ""}
//                   onChange={handleDueTimeChange}
//                   min={getMinDueTime()}
//                   placeholder="Select Time"
//                   className={`${
//                     !isDueTimeValid ? "border-red-300 bg-red-50" : ""
//                   }`}
//                   required
//                 />
//                 {!isDueTimeValid && (
//                   <p className="text-xs text-red-600">
//                     Due time must be later than schedule time
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <Toast
//           open={toast.open}
//           message={toast.message}
//           severity={toast.severity}
//           onClose={closeToast}
//         />
//       </div>
//     </TooltipProvider>
//   );
// }

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
  
  // Duration in minutes - default to 60 minutes (1 hour)
  const [duration, setDuration] = useState(
    examData.duration || 60
  );

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const currentDate = new Date();
  const currentTime = format(currentDate, "HH:mm");

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    
    // Handle overflow to next day
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate if end time goes to next day
  const isEndTimeNextDay = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    return totalMinutes >= 24 * 60;
  };

  // Get calculated end time
  const endTime = useMemo(() => {
    return calculateEndTime(scheduleTime, duration);
  }, [scheduleTime, duration]);

  // Check if end time is next day
  const isNextDay = useMemo(() => {
    return isEndTimeNextDay(scheduleTime, duration);
  }, [scheduleTime, duration]);

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

  // Validate duration (must be positive)
  const isDurationValid = useMemo(() => {
    return duration > 0 && duration <= 1440; // Max 24 hours (1440 minutes)
  }, [duration]);

  // Get minimum time for schedule input
  const getMinScheduleTime = () => {
    if (isToday) {
      return currentTime;
    }
    return "00:00";
  };

  const formatDateToInput = (date) => {
    return format(date, "dd-MM-yyyy");
  };

  // Convert duration minutes to hours and minutes for display
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  // Calculate due date (end date) considering if it goes to next day
  const calculateDueDate = (startDate, startTime, durationMinutes) => {
    const dueDate = new Date(startDate);
    if (isEndTimeNextDay(startTime, durationMinutes)) {
      dueDate.setDate(dueDate.getDate() + 1);
    }
    return dueDate;
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

    // Calculate due date and time
    const dueDate = calculateDueDate(newDate, scheduleTime, duration);
    const dueTime = setTimeToDate(dueDate, endTime);

    // If changing to today, validate current schedule time
    if (isSameDay(newDate, currentDate)) {
      if (scheduleTime < currentTime) {
        const newScheduleTime = currentTime;
        setScheduleTime(newScheduleTime);

        // Recalculate due time with new schedule time
        const newEndTime = calculateEndTime(newScheduleTime, duration);
        const newDueDate = calculateDueDate(newDate, newScheduleTime, duration);
        const newDueTime = setTimeToDate(newDueDate, newEndTime);

        updateExamData({
          scheduleTime: setTimeToDate(newDate, newScheduleTime),
          dueTime: newDueTime,
          duration: duration,
        });

        showToast(
          "Schedule time adjusted to current time since date is today.",
          "info"
        );
      } else {
        updateExamData({
          scheduleTime: setTimeToDate(newDate, scheduleTime),
          dueTime: dueTime,
          duration: duration,
        });
      }
    } else {
      updateExamData({
        scheduleTime: setTimeToDate(newDate, scheduleTime),
        dueTime: dueTime,
        duration: duration,
      });
    }
  };

  // Handle schedule time change with validation
  const handleScheduleTimeChange = (e) => {
    const newScheduleTime = e.target.value;
    setScheduleTime(newScheduleTime);

    // Calculate new due date and time
    const dueDate = calculateDueDate(date, newScheduleTime, duration);
    const newEndTime = calculateEndTime(newScheduleTime, duration);
    const dueTime = setTimeToDate(dueDate, newEndTime);

    updateExamData({
      scheduleTime: setTimeToDate(date, newScheduleTime),
      dueTime: dueTime,
      duration: duration,
    });
  };

  // Handle duration change
  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value) || 0;
    setDuration(newDuration);

    // Calculate new due date and time
    const dueDate = calculateDueDate(date, scheduleTime, newDuration);
    const newEndTime = calculateEndTime(scheduleTime, newDuration);
    const dueTime = setTimeToDate(dueDate, newEndTime);

    updateExamData({
      scheduleTime: setTimeToDate(date, scheduleTime),
      dueTime: dueTime,
      duration: newDuration,
    });
  };

  // Auto-adjust times when component mounts or date changes
  useEffect(() => {
    if (isToday && scheduleTime < currentTime) {
      const newScheduleTime = currentTime;
      setScheduleTime(newScheduleTime);

      // Recalculate due time
      const dueDate = calculateDueDate(date, newScheduleTime, duration);
      const newEndTime = calculateEndTime(newScheduleTime, duration);
      const dueTime = setTimeToDate(dueDate, newEndTime);

      updateExamData({
        scheduleTime: setTimeToDate(date, newScheduleTime),
        dueTime: dueTime,
        duration: duration,
      });
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
              dueTime={endTime}
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
                  Start Time
                  <Tooltip>
                    <TooltipTrigger>
                      <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-gray-900 text-white p-3 rounded-lg max-w-xs"
                    >
                      <p className="font-medium mb-1">Start Time</p>
                      <p className="text-sm">
                        Choose when the exam should start and be available to students.
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
                      ? "Start time cannot be in the past"
                      : "Invalid start time"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium flex items-center gap-1 w-full justify-between"
                >
                  Duration (minutes)
                  <Tooltip>
                    <TooltipTrigger>
                      <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-gray-900 text-white p-3 rounded-lg max-w-xs"
                    >
                      <p className="font-medium mb-1">Duration</p>
                      <p className="text-sm">
                        Set how long the exam should last in minutes.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="number"
                  name="duration"
                  id="duration"
                  value={duration || ""}
                  onChange={handleDurationChange}
                  min="1"
                  max="1440"
                  placeholder="Duration in minutes"
                  className={`${
                    !isDurationValid ? "border-red-300 bg-red-50" : ""
                  }`}
                  required
                />
                {!isDurationValid && (
                  <p className="text-xs text-red-600">
                    Duration must be between 1 and 1440 minutes (24 hours)
                  </p>
                )}
                {isDurationValid && (
                  <p className="text-xs text-gray-500">
                    Duration: {formatDuration(duration)}
                  </p>
                )}
              </div>
            </div>

            {/* Calculated End Time Display */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1 w-full justify-between">
                Calculated End Time
                <Tooltip>
                  <TooltipTrigger>
                    <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-gray-900 text-white p-3 rounded-lg max-w-xs"
                  >
                    <p className="font-medium mb-1">End Time</p>
                    <p className="text-sm">
                      Automatically calculated based on start time and duration.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                value={`${endTime}${isNextDay ? " (+1 day)" : ""}`}
                readOnly
                className="w-full bg-gray-50 text-gray-700"
                placeholder="End time will be calculated"
              />
              {isNextDay && (
                <p className="text-xs text-blue-600">
                  End time extends to the next day
                </p>
              )}
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