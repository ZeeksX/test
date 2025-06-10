import { useEffect, useState } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { CardFormattedText } from "../ui/Card";
import ReactMarkdown from "react-markdown";
import { Input } from "../ui/Input";
import CustomButton from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  newFetchStudentResult,
  updateQuestionScore,
  updateStudentScores,
  resetStudentResult,
} from "../../features/reducers/examSlice";
import { Loader } from "../ui/Loader";
import axios from "axios";
import { PETTY_SERVER_URL } from "../../utils/constants";
import Toast from "../modals/Toast";

const StudentResultPage = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentId, examId } = useParams();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [updating, setUpdating] = useState(false);

  // Get everything from Redux store
  const { studentResult, hasUnsavedChanges, loading, error } = useSelector(
    (state) => state.exams
  );
  // Only keep currentQuestionIndex as local state since it's just UI state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    dispatch(newFetchStudentResult({ examId, studentId }));

    // Cleanup when component unmounts
    return () => {
      dispatch(resetStudentResult());
    };
  }, [dispatch, examId, studentId]);

  // Early return if no student result
  if (loading) {
    return <Loader />;
  }

  if (!studentResult) {
    return <div>No student result found</div>;
  }

  const results = studentResult.results;
  console.log({ results });
  const exam = studentResult.exam;
  const userAnswers = studentResult.userAnswers;
  const submissionInfo = studentResult.submissionInfo;

  // Get questions array from exam data
  const questions = exam.questions || [];
  console.log({ questions });
  const totalQuestions = questions.length;

  // Calculate total score dynamically from current question scores
  const calculateTotalScore = () => {
    if (studentResult.submissionInfo.grading_status === "completed") {
      return Object.values(results.details).reduce((total, detail) => {
        return total + (detail[1]?.score || 0);
      }, 0);
    } else {
      const questionScores = results.details.question_scores;
      return Object.values(questionScores).reduce(
        (total, score) => total + score,
        0
      );
    }
  };

  const totalScore = calculateTotalScore();
  const maxPossibleScore = questions.reduce(
    (sum, q) => sum + (parseInt(q.score) || 0),
    0
  );
  const percentageScore =
    maxPossibleScore > 0
      ? Math.round((totalScore / maxPossibleScore) * 100)
      : 0;

  // Perfect score flag
  const isPerfectScore = totalScore === maxPossibleScore;

  // Function to update individual question score - now using Redux
  const handleQuestionScoreUpdate = (questionIndex, newScore) => {
    const maxQuestionScore = questions[questionIndex]?.score || 0;

    // Validate the score
    if (newScore < 0 || newScore > maxQuestionScore) {
      alert(`Score must be between 0 and ${maxQuestionScore}`);
      return;
    }

    // Dispatch Redux action
    dispatch(updateQuestionScore({ questionIndex, newScore }));
  };

  // Function to save the updated scores using Redux
  const handleUpdateScore = async () => {
    try {
      setUpdating(true);
      const newTotalScore = calculateTotalScore();
      const questionScores = Object.fromEntries(
        Object.entries(results.details).map(([index, detail]) => [
          index,
          detail[1]?.score || 0,
        ])
      );

      // const body = {
      //   examId,
      //   studentId,
      //   questionScores,
      //   totalScore: newTotalScore,
      // };

      // console.log({ body });

      // const response = await axios.put(
      //   `${PETTY_SERVER_URL}/api/exams/update-scores`,
      //   body
      // );

      const resultAction = await dispatch(
        updateStudentScores({
          examId,
          studentId,
          questionScores,
          totalScore: newTotalScore,
        })
      );

      if (updateStudentScores.fulfilled.match(resultAction)) {
        showToast("Student score has been updated successfully!", "success");
      } else {
        showToast("Failed to update score. Please try again!", "error");
      }

      // console.log("Updating scores:", {
      //   examId,
      //   studentId,
      //   questionScores,
      //   totalScore: newTotalScore,
      // });

      // Dispatch the async thunk to update scores
    } catch (error) {
      console.error("Error updating scores:", error);
      showToast("Failed to update score. Please try again!", "error");
    } finally {
      setUpdating(false);
    }
  };

  // Navigation functions
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  // Generate pagination array for display
  const generatePagination = () => {
    const visiblePageCount = 5;
    let startPage = Math.max(
      0,
      Math.min(
        currentQuestionIndex - Math.floor(visiblePageCount / 2),
        totalQuestions - visiblePageCount
      )
    );
    if (startPage < 0) startPage = 0;

    return Array.from(
      { length: Math.min(visiblePageCount, totalQuestions) },
      (_, i) => startPage + i
    );
  };

  const formatBoldText = (text) => {
    if (!text || typeof text !== "string") return text;
    return text.replace(/\*([^*]+)\*/g, "**$1**");
  };

  // Current question and its result
  const currentQuestion = questions[currentQuestionIndex] || {};
  const currentAnswerScore =
    studentResult.submissionInfo.grading_status === "completed"
      ? results.details[currentQuestionIndex]?.[1]?.score || 0
      : results.details.question_scores?.[currentQuestionIndex] || 0;
  const questionResult = results;
  const paginationPages = generatePagination();

  // Helper function to parse score breakdown from feedback string
  const parseScoreBreakdown = (feedbackStr) => {
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

  // Extract general feedback
  const extractGeneralFeedback = (feedbackStr) => {
    if (!feedbackStr || typeof feedbackStr !== "string") return "";
    const parts = feedbackStr.split(/Model Answer:[\s\S]*?(?=\n\n|$)/i);
    return parts[0].replace(/Score Breakdown:[\s\S]*/, "").trim();
  };

  // Helper function to render feedback
  const renderFeedback = (feedback) => {
    if (!feedback) return null;

    if (typeof feedback === "object" && feedback !== null) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Feedback</h3>
          <div className="p-4 border border-gray-300 rounded bg-gray-50">
            <table className="w-full">
              <tbody>
                {Object.entries(feedback).map(([key, value]) => (
                  <tr key={key} className="border-b last:border-b-0">
                    <td className="py-2 pr-4 font-medium">{key}:</td>
                    <td className="py-2">
                      <CardFormattedText text={value} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    const scoreBreakdown = parseScoreBreakdown(feedback);
    let generalFeedback = extractGeneralFeedback(feedback);
    generalFeedback = formatBoldText(generalFeedback);

    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Feedback</h3>
        <div className="p-4 border border-gray-300 rounded bg-gray-50">
          <ReactMarkdown>{generalFeedback}</ReactMarkdown>

          {scoreBreakdown && scoreBreakdown.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold mb-2">Score Breakdown:</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left border border-gray-300">
                        Criteria No
                      </th>
                      <th className="p-2 text-left border border-gray-300">
                        Criteria
                      </th>
                      <th className="p-2 text-center border border-gray-300">
                        Marks Obtained
                      </th>
                      <th className="p-2 text-center border border-gray-300">
                        Max Marks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreBreakdown.map((criterion, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-2 border border-gray-300">
                          {criterion.criterionNumber}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {criterion.criterionText}
                        </td>
                        <td className="p-2 text-center border border-gray-300">
                          {criterion.scoreObtained}
                        </td>
                        <td className="p-2 text-center border border-gray-300">
                          {criterion.maxScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to render the student's answer and feedback
  const renderAnswerAndFeedback = (question, result, index) => {
    if (!question || !result.details[index]) return null;

    const answerDetails = result.details[index][1];
    const userAnswer = userAnswers[question.id];

    switch (question.type) {
      case "multiple-choice": {
        const selectedOption = question.options.find(
          (opt) => opt.id === userAnswer
        );

        return (
          <div className="">
            <h3 className="text-lg font-bold mb-4">Options</h3>
            <div className="space-y-4">
              {question.options.map((option) => {
                const isCorrect = option.isCorrect;
                const isUserSelected = option.id === userAnswer;

                let bgColor = "bg-white";
                if (isUserSelected) {
                  bgColor =
                    answerDetails.score === question.score
                      ? "bg-green-100"
                      : "bg-red-100";
                } else if (isCorrect) {
                  bgColor = "bg-green-50";
                }

                return (
                  <div
                    key={option.id}
                    className={`flex items-center p-3 rounded ${bgColor}`}
                  >
                    {isCorrect ? (
                      <FaCheckCircle className="w-5 h-5 mr-4 text-green-600" />
                    ) : isUserSelected ? (
                      <MdCancel className="w-5 h-5 mr-4 text-red-600" />
                    ) : (
                      <div className="w-5 h-5 mr-4" />
                    )}

                    <span
                      className={
                        isUserSelected && !isCorrect ? "text-red-800" : ""
                      }
                    >
                      {option.text}
                    </span>

                    {!isUserSelected && isCorrect && (
                      <span className="ml-auto text-sm text-green-600">
                        (Correct Answer)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {renderFeedback(answerDetails.feedback)}
          </div>
        );
      }

      case "cloze": {
        return (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Student's Answer</h3>
            <div className="mb-4">
              <div
                className={`p-3 border rounded ${
                  currentAnswerScore === question.score
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <p className="font-medium">
                  Student Answer: {userAnswer || "(No answer provided)"}
                </p>
                <p className="mt-2 text-gray-700">
                  {currentAnswerScore === question.score
                    ? "Correct!"
                    : `Incorrect. Correct answer: ${question.modelAnswer}`}
                </p>
              </div>
              {renderFeedback(answerDetails.feedback)}
            </div>
          </div>
        );
      }

      case "theory": {
        return (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Student's Answer</h3>
            <div className="p-4 border border-gray-300 rounded bg-gray-50 min-h-32 mb-4">
              {userAnswer ? (
                <ReactMarkdown>{userAnswer}</ReactMarkdown>
              ) : (
                <em className="text-gray-500">No answer provided</em>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Model Answer</h3>
              <div className="p-4 border border-gray-300 rounded bg-blue-50 min-h-32 mb-4">
                <ReactMarkdown>
                  {question.modelAnswer || "No model answer provided"}
                </ReactMarkdown>
              </div>
            </div>
            {renderFeedback(answerDetails.feedback)}
          </div>
        );
      }

      default:
        return <div>Unsupported question type</div>;
    }
  };

  // Back to dashboard button handler
  const handleBackToDashboard = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="flex-1 overflow-auto flex flex-col h-full">
      <div className="px-6 py-4 flex-grow">
        {submissionInfo.is_approved == true && (
          <div
            className={`px-3 mb-4 py-1 rounded-full text-sm text-center font-medium bg-blue-100 text-blue-500`}
          >
            This Exam has been published, it cannot be edited again
          </div>
        )}
        <div className="flex justify-between items-start mb-6">
          <div className="">
            <h1 className="text-2xl font-semibold text-gray-900">
              {results.student.name}
              <br />{" "}
            </h1>
            <p className="text-gray-500">{results.student.matricnumber}</p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`px-4 py-2 rounded-md flex border items-center ${
                hasUnsavedChanges ? "border-orange-300 bg-orange-50" : ""
              }`}
            >
              <span className="text-gray-600 mr-2">Score:</span>
              <span
                className={
                  hasUnsavedChanges ? "text-orange-600 font-semibold" : ""
                }
              >
                {parseFloat(totalScore).toFixed(2)}/{parseFloat(maxPossibleScore).toFixed(2)}
              </span>
              {hasUnsavedChanges && (
                <span className="ml-2 text-xs text-orange-600">*</span>
              )}
            </div>
            <CustomButton
              className={`w-[150px] ${
                hasUnsavedChanges ? "bg-orange-500 hover:bg-orange-600" : ""
              }`}
              onClick={handleUpdateScore}
              disabled={!hasUnsavedChanges}
              loading={updating}
            >
              {hasUnsavedChanges ? "Save Changes" : "Update Score"}
            </CustomButton>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">
              Question {currentQuestionIndex + 1}
            </h2>
            <div className="flex items-center">
              <p className="text-xl font-bold mr-4">Mark(s)</p>
              <Input
                topClassName="!w-max"
                className="!w-[80px]"
                type="number"
                disabled={submissionInfo.is_approved == true}
                min="0"
                max={currentQuestion.score || 0}
                step="0.5"
                value={currentAnswerScore}
                onChange={(e) =>
                  handleQuestionScoreUpdate(
                    currentQuestionIndex,
                    Number.parseFloat(e.target.value) || 0
                  )
                }
              />
              <span className="ml-2 text-gray-500">
                / {currentQuestion.score || 0}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-4">{currentQuestion.text}</p>
          </div>

          {renderAnswerAndFeedback(
            currentQuestion,
            questionResult,
            currentQuestionIndex
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t p-4 flex justify-between items-center mt-auto">
        <button
          className={`flex items-center font-medium ${
            currentQuestionIndex > 0 ? "text-[#1836B2]" : "text-gray-400"
          }`}
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-1" />
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {paginationPages.map((page) => (
            <button
              key={page}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                page === currentQuestionIndex
                  ? "bg-[#1836B2] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => goToQuestion(page)}
            >
              {page + 1}
            </button>
          ))}
        </div>

        <button
          className={`flex items-center font-medium ${
            currentQuestionIndex < totalQuestions - 1
              ? "text-[#1836B2]"
              : "text-gray-400"
          }`}
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === totalQuestions - 1}
        >
          Next
          <ChevronRight className="ml-1" />
        </button>
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
};

export default StudentResultPage;
