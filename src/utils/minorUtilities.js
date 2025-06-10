/**
 * Copies the given text to the clipboard.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @returns {Promise<boolean>} - Resolves to true if copied successfully, false otherwise.
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy: ", err);
    return false;
  }
};

export const areAllSubmissionsScored = (examSubmissions) => {
  // Return false if no submissions exist
  if (!examSubmissions || examSubmissions.length === 0) {
    return false;
  }

  // Check if every submission has a non-null score
  return examSubmissions.every(
    (submission) => submission.score !== null && submission.score !== undefined
  );
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
