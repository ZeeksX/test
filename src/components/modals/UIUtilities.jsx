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

export function formatScheduleTime(scheduleTime) {
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
    timeZone: "UTC", 
  };

  let formattedDate = date.toLocaleString("en-US", options);

  const day = date.getUTCDate();
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
  ];
  formattedDate = formattedDate.replace(/\d+/, `${day}${suffix}`);

  return formattedDate;
}
