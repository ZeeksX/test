import apiCall from "../../utils/apiCall";

export const toLocalISOString = (date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

export const formatDate = (date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const suffixes = ["th", "st", "nd", "rd"];

  let day = date.getDate();
  let month = months[date.getMonth()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  minutes = minutes.toString().padStart(2, "0");

  let suffix = suffixes[day % 10] || "th";
  if (day >= 11 && day <= 13) suffix = "th"; // Special case for 11th, 12th, 13th

  return `${month} ${day}${suffix}, ${hours}:${minutes} ${period}`;
};

export function newFormatDate(dateString) {
  const date = new Date(dateString);

  // Months array
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get parts of the date
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the hour into 12-hour format with AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Get day suffix (st, nd, rd, th)
  const daySuffix = getDaySuffix(day);

  return `${month} ${day}${daySuffix}, ${formattedHours}:${formattedMinutes} ${ampm}`;
}

// Helper function to get the day suffix (st, nd, rd, th)
function getDaySuffix(day) {
  if (day >= 11 && day <= 13) return "th";
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatScheduleTime(
  scheduleTime,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
) {
  const date = new Date(scheduleTime);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone, // Dynamic time zone
  };

  let formattedDate = date.toLocaleString("en-US", options);

  // Get correct day from the same time zone
  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    timeZone,
  });
  const day = parseInt(dayFormatter.format(date), 10);

  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
  ];

  formattedDate = formattedDate.replace(/\b\d+\b/, `${day}${suffix}`);

  return formattedDate;
}

export const parseTimeString = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export function setTimeToDate(date, scheduleTime) {
  const [hours, minutes] = scheduleTime.split(":").map(Number);

  const updatedDate = new Date(date);

  updatedDate.setHours(hours, minutes, 0, 0);

  return updatedDate;
}

export async function filterExamsByStudentSubmissions(examinations, studentId) {
  try {
    const availableExams = [];

    for (const exam of examinations) {
      try {
        const response = await apiCall.get(`/exams/${exam.id}/results/`);
        const submissions = response.data;

        // Check if the student has already submitted for this exam
        const studentSubmission = submissions.find(
          (submission) => submission.student.student_id === studentId
        );

        if (!studentSubmission) {
          availableExams.push(exam);
        } else {
          console.log(
            `Student ${studentId} has already submitted for exam: ${exam.title} (ID: ${exam.id})`
          );
        }
      } catch (error) {
        console.error(`Error fetching results for exam ${exam.id}:`, error);
        availableExams.push(exam);
      }
    }

    return availableExams;
  } catch (error) {
    console.error("Error filtering exams:", error);
    return examinations;
  }
}
