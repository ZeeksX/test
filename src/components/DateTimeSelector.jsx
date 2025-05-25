import { useMemo, useState } from "react";
import { format, set } from "date-fns";
import { Calendar } from "./ui/Calendar";
import { Input } from "./ui/Input";
import { FiInfo } from "react-icons/fi";
import { parseTimeString, setTimeToDate } from "./modals/UIUtilities";
import { Label } from "./ui/Label";
import Toast from "./modals/Toast";

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
  const [allocatedMinutes, setAllocatedMinutes] = useState(59);

  const maxHours = useMemo(() => {
    const start = parseTimeString(scheduleTime);
    const end = parseTimeString(dueTime);
    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    return Math.max(diffHrs, 0);
  }, [scheduleTime, dueTime]);

  const [allocatedHours, setAllocatedHours] = useState(maxHours - 1);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const formatDateToInput = (date) => {
    return format(date, "dd-MM-yyyy");
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <Calendar
            value={date}
            onChange={setDate}
            scheduleTime={scheduleTime}
            dueTime={dueTime}
            updateExamData={updateExamData}
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="scheduleDate" className="block text-sm font-medium">
              Schedule Date
            </label>
            <Input
              id="scheduleDate"
              value={formatDateToInput(date)}
              readOnly
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="scheduleTime"
                className="text-sm font-medium flex items-center gap-1"
              >
                Schedule Time
                <FiInfo className="h-4 w-4 text-muted-foreground" />
              </Label>
              <Input
                type="time"
                name="scheduleTime"
                id="scheduleTime"
                value={scheduleTime || ""}
                onChange={(e) => {
                  const newSchedule = e.target.value;
                  if (dueTime > newSchedule) {
                    setScheduleTime(newSchedule);
                    updateExamData({
                      scheduleTime: setTimeToDate(date, newSchedule),
                    });
                  } else {
                    showToast(
                      "Due time must be later than schedule time.",
                      "error"
                    );
                  }
                }}
                placeholder="Select Time"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="dueTime"
                className="text-sm font-medium flex items-center gap-1"
              >
                Due Time
                <FiInfo className="h-4 w-4 text-muted-foreground" />
              </Label>
              <Input
                type="time"
                name="dueTime"
                id="dueTime"
                value={dueTime || ""}
                onChange={(e) => {
                  const newDue = e.target.value;
                  if (newDue > scheduleTime) {
                    setDueTime(newDue);
                    updateExamData({
                      dueTime: setTimeToDate(date, newDue),
                    });
                  } else {
                    showToast(
                      "Due time must be later than schedule time.",
                      "error"
                    );
                  }
                }}
                placeholder="Select Time"
                required
              />
            </div>
          </div>

          {/* <div className="space-y-2 w-1/2">
            <Label
              htmlFor="allocatedTime"
              className="text-sm font-medium flex items-center gap-1"
            >
              Allocated Time
              <FiInfo className="h-4 w-4 text-muted-foreground" />
            </Label>
            <div className="flex items-center border rounded-md">
              <div className="flex-1 flex items-center justify-center relative">
                <Input
                  type="number"
                  value={allocatedHours.toString().padStart(2, "0")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                    setAllocatedHours(value ? parseInt(value, 10) : 0);
                  }}
                  min={0}
                  max={maxHours - 1}
                  className="text-center border-0 focus-visible:ring-0"
                />
              </div>
              <span className="text-lg px-1">:</span>
              <div className="flex-1 flex items-center justify-center relative">
                <Input
                  type="number"
                  value={allocatedMinutes.toString().padStart(2, "0")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                    setAllocatedMinutes(value ? parseInt(value, 10) : 0);
                  }}
                  min={0}
                  max={59}
                  className="text-center border-0 focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-start">
              <Label className="flex-1">Hours</Label>
              <Label className="flex-1">Minutes</Label>
            </div>
          </div> */}
        </div>
      </div>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
}
