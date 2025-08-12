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

export function getStudentGroupsByIds(studentGroups, groupIds) {
  return studentGroups.filter((group) => groupIds.includes(group.id));
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export function countQuestionTypes(examData) {
  const questionCounts = {
    theory: 0,
    cloze: 0,
    mcq: 0,
  };

  if (!examData || !examData.questions || !Array.isArray(examData.questions)) {
    return questionCounts;
  }

  mapQuestions(examData.questions).forEach((question) => {
    switch (question.type) {
      case "theory":
        questionCounts.theory++;
        break;
      case "cloze":
        questionCounts.cloze++;
        break;
      case "multiple-choice":
        questionCounts.mcq++;
        break;
      default:
        console.warn(`Unknown question type: ${question.type}`);
    }
  });

  return questionCounts;
}

export function unMapQuestion(inputQuestions) {
  return inputQuestions.map((q) => {
    if (typeof q.id === "number") {
      return q;
    }

    const converted = {
      id: parseInt(q.id),
      text: q.text,
      type: q.type === "multiple-choice" ? "mcq" : q.type,
      score: q.score,
      options: null,
    };

    if (q.type === "multiple-choice") {
      const correctOption = q.options.find((opt) => opt.isCorrect);
      converted.answer = correctOption ? [correctOption.text] : [];

      converted.options = q.options.map((opt) => opt.text);
    } else if (q.type === "cloze") {
      converted.answer = q.modelAnswer.split(",").map((item) => item.trim());
    } else {
      converted.answer = q.modelAnswer;
    }

    return converted;
  });
}

export const mapQuestions = (inputQuestion) => {
  return inputQuestion.map((q) => {
    if (typeof q.id === "string") {
      return q;
    }

    let mappedQuestion = {
      id: `${q.id}`,
      text: q.question ? q.question : q.text,
      score: q.max_score ? q.max_score : q.score,
    };

    if (q.answer_type) {
      if (q.answer_type === "mcq") {
        mappedQuestion.type = "multiple-choice";
        mappedQuestion.options = q.mcq_options.map((option, index) => ({
          id: `q${q.id}_opt${index + 1}`,
          text: option,
          isCorrect: q.model_answer.includes(option),
        }));
      } else if (q.answer_type === "theory") {
        mappedQuestion.type = "theory";
        mappedQuestion.options = [];
        mappedQuestion.modelAnswer = q.model_answer;
      } else if (q.answer_type === "cloze") {
        mappedQuestion.type = "cloze";
        mappedQuestion.options = [];
        mappedQuestion.modelAnswer = Array.isArray(q.model_answer)
          ? q.model_answer.join(", ")
          : q.model_answer;
      }
    } else {
      if (q.type === "mcq") {
        mappedQuestion.type = "multiple-choice";
        mappedQuestion.options = q.options.map((option, index) => ({
          id: `q${q.id}_opt${index + 1}`,
          text: option,
          isCorrect: q.answer.includes(option),
        }));
      } else if (q.type === "theory") {
        mappedQuestion.type = "theory";
        mappedQuestion.options = [];
        mappedQuestion.modelAnswer = q.answer;
      } else if (q.type === "cloze") {
        mappedQuestion.type = "cloze";
        mappedQuestion.options = [];
        mappedQuestion.modelAnswer = Array.isArray(q.answer)
          ? q.answer.join(", ")
          : q.answer;
      }
    }

    return mappedQuestion;
  });
};

export function convertDetailStructure(data) {
  // Check if data structure is already in the target format (second type)
  // Target format has "question_scores" key and each question has only one sub-question
  if (data?.question_scores && typeof data.question_scores === "object") {
    // Check if it's already flattened (each question has only sub-question "1")
    const firstQuestionKey = Object.keys(data).find(
      (key) => key !== "question_scores"
    );
    if (
      firstQuestionKey &&
      data[firstQuestionKey] &&
      Object.keys(data[firstQuestionKey]).length === 1
    ) {
      // Already in target format, return as is
      return data;
    }
  }

  // Convert from nested format to flattened format
  const result = {};
  const questionScores = {};
  let currentQuestionIndex = 0;

  // Process each main question
  for (const questionId in data) {
    if (questionId === "question_scores") continue; // Skip if it exists

    const questionData = data[questionId];

    // Process each sub-question within the main question
    for (const subQuestionId in questionData) {
      const subQuestionData = questionData[subQuestionId];

      // Create a new flattened question entry
      result[currentQuestionIndex] = {
        1: {
          score: subQuestionData.score,
          feedback: subQuestionData.feedback,
        },
      };

      // Store the score for this question
      questionScores[currentQuestionIndex] = subQuestionData.score;

      currentQuestionIndex++;
    }
  }

  // Add question_scores to the result
  result.question_scores = questionScores;

  return result;
}

export const parseScoreBreakdown = (feedbackStr) => {
  if (!feedbackStr || typeof feedbackStr !== "string") return null;

  const scoreBreakdownMatch = feedbackStr.match(
    /Score Breakdown:([\s\S]*?)(?:$|(?=\n\n))/
  );
  if (!scoreBreakdownMatch) return null;

  const scoreBreakdownText = scoreBreakdownMatch[1].trim();
  const criteriaLines = scoreBreakdownText
    .split("\n")
    .filter((line) => line.trim().startsWith("Criterion"));

  if (criteriaLines.length === 0) return null;

  return criteriaLines
    .map((line, index) => {
      const criterionMatch = line.match(
        /Criterion (\d+) - (.*?) - (\d+\.\d+)\/(\d+\.\d+)/
      );
      if (!criterionMatch) return null;

      return {
        criterionNumber: criterionMatch[1],
        criterionText: criterionMatch[2],
        scoreObtained: criterionMatch[3],
        maxScore: criterionMatch[4],
      };
    })
    .filter(Boolean);
};

export const extractGeneralFeedback = (feedbackStr) => {
  if (!feedbackStr || typeof feedbackStr !== "string") return "";

  const withoutScoreBreakdown = feedbackStr
    .replace(/Score Breakdown:[\s\S]*/, "")
    .trim();

  const cleaned = withoutScoreBreakdown.replace(
    /General Feedback:/i,
    "**General Feedback:**"
  );

  return cleaned.replace(/Model Answer:/i, "**Model Answer:**\n\n");
};

export const formatBoldText = (text) => {
  if (!text || typeof text !== "string") return text;
  return text.replace(/\*([^*]+)\*/g, "**$1**");
};
