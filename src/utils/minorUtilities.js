/**
 * Copies the given text to the clipboard.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @returns {Promise<void>} - A promise that resolves when the text is successfully copied.
 * @throws {Error} - If copying fails, an error is logged to the console.
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

export const areAllSubmissionsScored = (examSubmissions) => {
  // Return false if no submissions exist
  if (!examSubmissions || examSubmissions.length === 0) {
    return false;
  }
  
  // Check if every submission has a non-null score
  return examSubmissions.every(submission => 
    submission.score !== null && submission.score !== undefined
  );
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
