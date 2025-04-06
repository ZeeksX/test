import { SERVER_URL } from "../../utils/constants";

// Helper function to map frontend question types to backend answer types
const mapQuestionTypeToAnswerType = (questionType) => {
  switch (questionType) {
    case "multiple-choice":
      return "mcq";
    case "cloze":
      return "cloze";
    case "theory":
      return "theory";
    default:
      return "unknown";
  }
};

// Helper function to get model answer based on question type
const getModelAnswer = (question) => {
  switch (question.type) {
    case "multiple-choice":
      // For MCQs, return array with correct option text
      const correctOption = question.options.find((opt) => opt.isCorrect);
      return correctOption ? [correctOption.text] : [""];
    case "cloze":
      // For cloze, return array of acceptable answers
      return [question.modelAnswer] || [question.acceptableAnswers || ""];
    case "theory":
      // For theory, return the model answer string
      return question.modelAnswer || "";
    default:
      return "";
  }
};

// Helper function to format student answer based on question type
const formatStudentAnswer = (answer, questionType) => {
  if (questionType === "multiple-choice") {
    // For MCQs, we need to return the selected option text
    return answer ? [answer] : [""];
  }
  // For other types, return the answer directly
  return answer || "";
};

export const submitExamForGrading = async (examId, userAnswers, exam) => {
  try {
    if (!exam || !exam.questions) {
      throw new Error("Exam data is missing!");
    }

    // Prepare grading requests
    const gradingRequests = exam.questions.map((question) => {
      const studentAnswerId = userAnswers[question.id];
      let studentAnswerText = "";

      // For MCQs, find the selected option text
      if (question.type === "multiple-choice") {
        const selectedOption = question.options.find(
          (opt) => opt.id === studentAnswerId
        );
        studentAnswerText = selectedOption ? selectedOption.text : "";
      } else {
        studentAnswerText = studentAnswerId || ""; // For other types, use the answer directly
      }

      return {
        question: question.text,
        answer_type: mapQuestionTypeToAnswerType(question.type),
        model_answer: getModelAnswer(question),
        student_answers: {
          1:
            question.type === "multiple-choice"
              ? [studentAnswerText]
              : studentAnswerText,
        },
        max_score: question.score || 0,
      };
    });

    // Prepare request body
    const requestBody = {
      exam_id: examId,
      strict: `"${exam.strict}"`,
      grading_requests: gradingRequests,
    };

    console.log("Submitting exam with data:", requestBody);

    const response = await fetch(`${SERVER_URL}/exams/grade-exam/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.error || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    console.log("Response from the backend", data);
    return data;
  } catch (error) {
    console.error("Error submitting exam for grading:", error);
    throw new Error("Submission failed: " + error.message);
  }
};
