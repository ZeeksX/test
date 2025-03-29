export const toLocalISOString = (date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};


export const formatDate = (date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const suffixes = ["th", "st", "nd", "rd"];

  let day = date.getDate();
  let month = months[date.getMonth()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; 
  minutes = minutes.toString().padStart(2, "0");

  let suffix = suffixes[(day % 10)] || "th";
  if (day >= 11 && day <= 13) suffix = "th"; // Special case for 11th, 12th, 13th

  return `${month} ${day}${suffix}, ${hours}:${minutes} ${period}`;
}