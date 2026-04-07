export const formatDate = (dateString) => {
  if (!dateString) return "No date";

  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};


export const convertToIsoFormat = (dateString) => {
  if (!dateString) return "";

  // 1. Remove the word "at" so the Date constructor can parse it
  // "6 April 2026 at 10:00 am" -> "6 April 2026 10:00 am"
  const cleanString = dateString.replace(/\s+at\s+/i, " ");
  
  const date = new Date(cleanString);

  // Check if the date is actually valid
  if (isNaN(date.getTime())) {
    console.error("Invalid Date String provided");
    return "Invalid Date";
  }

  // 2. Extract parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 3. Return in YYYY-MM-DDTHH:mm:ss format
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};