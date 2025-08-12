import { useEffect, useState, useMemo } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { MdCancel, MdEdit, MdSave, MdUndo } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import { Input } from "../ui/Input";
import CustomButton from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  newFetchStudentResult,
  resetStudentResult,
} from "../../features/reducers/examSlice";
import { Loader } from "../ui/Loader";
import Toast from "../modals/Toast";
import { IoChevronBack } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import { FiHelpCircle } from "react-icons/fi";
import { mapQuestions } from "../modals/UIUtilities";
import apiCall from "../../utils/apiCall";
import { RenderFeedback } from "../RenderComponents";
import ReactMarkdown from "react-markdown";

const StudentResultPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentId, examId } = useParams();

  // State management
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [updating, setUpdating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showStatistics, setShowStatistics] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [tempScore, setTempScore] = useState("");
  const [localScoreChanges, setLocalScoreChanges] = useState({});

  // Redux state
  const { studentResult, loading, error } = useSelector((state) => state.exams);

  const hasUnsavedChanges = Object.keys(localScoreChanges).length > 0;

  useEffect(() => {
    dispatch(newFetchStudentResult({ examId, studentId }));
    return () => {
      dispatch(resetStudentResult());
    };
  }, [dispatch, examId, studentId]);

  const calculatedData = useMemo(() => {
    if (!studentResult) return null;

    const results = studentResult.results;
    // const details = convertDetailStructure(results.details);
    const details = results.details;
    const exam = studentResult.exam;
    const userAnswers = studentResult.userAnswers;
    const submissionInfo = studentResult.submissionInfo;
    const questions = mapQuestions(exam.questions) || [];

    console.log({ exam, results, details, userAnswers });

    // Apply local changes to details
    const updatedDetails = Object.fromEntries(
      Object.entries(details).map(([key, value]) => [key, { ...value }])
    );

    Object.entries(localScoreChanges).forEach(([questionIndex, data]) => {
      if (updatedDetails[questionIndex]) {
        updatedDetails[questionIndex].score = data.score;
        updatedDetails[questionIndex].feedback = data.feedback;
      }
    });

    // Calculate statistics with updated scores
    const totalQuestions = questions.length;
    const answeredQuestions = Object.values(userAnswers).filter(
      (answer) => answer !== null && answer !== undefined && answer !== ""
    ).length;

    const correctAnswers = Object.entries(updatedDetails).filter(
      ([index, detail]) => {
        const question = questions[index];
        const score = detail[1]?.score || 0;
        return question && score === question.score;
      }
    ).length;

    const totalScore = Object.values(updatedDetails).reduce((sum, item) => {
      const score = Number(item?.score);
      return sum + (isNaN(score) ? 0 : score);
    }, 0);

    const maxPossibleScore = questions.reduce(
      (sum, q) => sum + (parseInt(q.score) || 0),
      0
    );

    const percentageScore =
      maxPossibleScore > 0
        ? Math.round((totalScore / maxPossibleScore) * 100)
        : 0;

    // Question difficulty analysis with local changes
    const questionAnalysis = questions.map((question, index) => {
      const detail = updatedDetails[index];
      const score = detail?.[1]?.score || 0;
      const maxScore = question.score || 0;
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

      return {
        index,
        score,
        maxScore,
        percentage,
        status:
          percentage === 100
            ? "correct"
            : percentage > 0
            ? "partial"
            : "incorrect",
      };
    });

    return {
      results,
      details: updatedDetails, // Use updated details
      exam,
      userAnswers,
      submissionInfo,
      questions,
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      totalScore,
      maxPossibleScore,
      percentageScore,
      questionAnalysis,
    };
  }, [studentResult, localScoreChanges]);

  if (loading) {
    return <Loader />;
  }

  if (!calculatedData) {
    return (
      <div className="flex items-center justify-center h-full my-auto">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Exam not submitted for this student
          </h3>
          <p className="text-gray-500">
            The student result could not be loaded. <br /> Please contact the
            student to ensure that they turned in their work.
          </p>
        </div>
      </div>
    );
  }

  const {
    results,
    details,
    userAnswers,
    submissionInfo,
    questions,
    totalQuestions,
    totalScore,
    maxPossibleScore,
  } = calculatedData;

  // console.log({ exam, results, details, userAnswers });

  // Score editing functions
  const startEditingScore = (questionIndex) => {
    const currentScore = details[questionIndex]?.[1]?.score || 0;
    setEditingScore(questionIndex);
    setTempScore(currentScore.toString());
  };

  const saveScoreEdit = (questionId) => {
    const newScore = parseFloat(tempScore);
    const maxScore = currentQuestion.score || 0;

    // Validate score
    if (isNaN(newScore) || newScore < 0 || newScore > maxScore) {
      showToast(`Score must be between 0 and ${maxScore}`, "error");
      return;
    }

    // Update local state immediately
    const updatedChanges = {
      ...localScoreChanges,
      [questionId]: {
        score: newScore,
        // feedback: details[currentQuestionIndex]?.[1]?.feedback || "",
        feedback: "This score has been updated by the lecturer.",
      },
    };

    setLocalScoreChanges(updatedChanges);
    setEditingScore(null);
    setTempScore("");

    // Mark as having unsaved changes (assuming you have this in Redux)
    // You might need to dispatch an action here to update hasUnsavedChanges
    showToast(
      "Score updated locally. Click 'Save Changes' to persist.",
      "success"
    );
  };

  const cancelScoreEdit = () => {
    setEditingScore(null);
    setTempScore("");
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

  // Update score handler
  const handleUpdateScore = async () => {
    if (Object.keys(localScoreChanges).length === 0) {
      showToast("No changes to save", "info");
      return;
    }

    setUpdating(true);

    try {
      const result = {};
      Object.entries(localScoreChanges).forEach(([questionIndex, data]) => {
        result[questionIndex] = {
          score: data.score,
          feedback: data.feedback,
        };
      });

      const response = await apiCall.patch(
        `/exams/results/edit-score/${submissionInfo.student_exam_id}`,
        { result }
      );

      if (response.status === 200) {
        setLocalScoreChanges({});

        dispatch(newFetchStudentResult({ examId, studentId }));

        showToast("Scores updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error updating scores:", error);
      showToast(
        error.response?.data?.message || "Failed to update scores",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  // Generate pagination
  const generatePagination = () => {
    const visiblePageCount = 7;
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

  const renderScoreEditor = (questionId) => {
    const currentQuestion = questions[currentQuestionIndex] || {};

    // Check if there's a local change for this question
    const localChange = localScoreChanges[questionId];
    const currentAnswerScore = localChange
      ? localChange.score
      : details[questionId]?.score || 0;

    const isEditing = editingScore === currentQuestionIndex;

    return (
      <div className="flex items-center">
        <span className="text-lg font-medium">Score:</span>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              className="!w-[80px]"
              type="number"
              min="0"
              max={currentQuestion.score || 0}
              step="0.5"
              value={tempScore}
              onChange={(e) => setTempScore(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  saveScoreEdit(currentQuestion.id);
                }
                if (e.key === "Escape") cancelScoreEdit();
              }}
              autoFocus
            />
            <span className="text-gray-500">
              / {currentQuestion.score || 0}
            </span>
            <button
              onClick={() => {
                saveScoreEdit(currentQuestion.id);
                // console.log(localScoreChanges)
              }}
              className="p-1 text-green-600 hover:bg-green-100 rounded"
            >
              <MdSave size={18} />
            </button>
            <button
              onClick={cancelScoreEdit}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
            >
              <MdUndo size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-bold ${
                currentAnswerScore === currentQuestion.score
                  ? "text-green-600"
                  : currentAnswerScore > 0
                  ? "text-orange-600"
                  : "text-red-600"
              } ${localChange ? "bg-yellow-100 px-2 py-1 rounded" : ""}`}
            >
              {currentAnswerScore}
            </span>
            <span className="text-gray-500">
              / {currentQuestion.score || 0}
            </span>
            {localChange && (
              <span className="text-xs text-yellow-600 ml-1">(Modified)</span>
            )}
            {!submissionInfo.is_approved && (
              <button
                onClick={() => startEditingScore(currentQuestionIndex)}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              >
                <MdEdit size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderAnswerAndFeedback = (question, result, index) => {
    if (!question || !details[index]) return null;
    const currentAnswerScore = details[index]?.score || 0;

    const answerDetails = details[index];
    const userAnswer = userAnswers[question.id];
    // console.log({ userAnswer });

    switch (question.type) {
      case "multiple-choice": {
        const selectedOption = question.options.find(
          (opt) => opt.id === userAnswer
        );

        return (
          <div className="">
            <h3 className="text-lg font-bold mb-4">Options</h3>
            <div className="space-y-4">
              {question.options.map((option, index) => {
                const isCorrect = option.isCorrect;
                const isUserSelected =
                  typeof userAnswer === "string"
                    ? option.text === userAnswer
                    : Array.isArray(userAnswer)
                    ? userAnswer.includes(option.text)
                    : false;

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
                    {/* {!isUserSelected && <p className="">User did not select any option</p>} */}
                  </div>
                );
              })}
            </div>
            {/* {RenderFeedback(answerDetails.feedback)} */}
            <RenderFeedback feedback={answerDetails.feedback} />
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
              {/* {RenderFeedback(answerDetails.feedback)} */}
              <RenderFeedback feedback={answerDetails.feedback} />
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
              <h3 className="text-lg font-bold mb-2">Correct Answer</h3>
              <div className="p-4 border border-gray-300 rounded bg-blue-50 min-h-32 mb-4">
                <ReactMarkdown>
                  {question.modelAnswer || "No correct answer provided"}
                </ReactMarkdown>
              </div>
            </div>
            {/* {RenderFeedback({feedback: answerDetails.feedback})} */}
            <RenderFeedback feedback={answerDetails.feedback} />
          </div>
        );
      }

      default:
        return <div>Unsupported question type</div>;
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || {};
  const paginationPages = generatePagination();

  return (
    <div className="flex-1 overflow-auto flex flex-col h-full">
      <div className="px-6 py-4 flex-grow">
        {submissionInfo.is_approved == true && (
          <div
            className={`px-3 mb-4 py-1 rounded-full md:text-sm text-xs text-center font-medium bg-blue-100 text-blue-500`}
          >
            This Exam has been published, it cannot be edited again
          </div>
        )}
        {/* Header with student info and controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-6">

          <div className="">
            <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full w-8 hover:bg-[#EAECF0] bg-transparent flex items-center justify-center hover:text-primary-main"
              >
                <IoChevronBack size={24} />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                {results.student.name}
                <br />{" "}
              </h1>
            </div>
            <p className="text-gray-500">{results.student.matricnumber}</p>
          </div>

          <TooltipProvider>
            <div className="mt-4 max-md:w-full">
              <div className="flex flex-col md:flex-row w-full items-start md:items-center gap-4">
                <div
                  className={`px-4 py-2 rounded-md w-full flex border items-center justify-between`}
                >
                  <span>
                    <span className="text-gray-600 mr-2">Tab Leave Count:</span>
                    <span className="mr-2">
                      {submissionInfo.tab_switch_count}
                    </span>
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-gray-900 text-white p-3 rounded-lg max-w-xs"
                    >
                      <p className="font-medium mb-1">Tab Leave Count</p>
                      <p className="text-sm">
                        This is the number of times a student left their exam
                        page during the examination. <br />
                        <strong>Note:</strong> The exams automatically submits
                        once the student leaves the tab three (3) times.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-3">
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
                      {parseFloat(totalScore).toFixed(1)}/
                      {parseFloat(maxPossibleScore).toFixed(1)}
                    </span>
                    {hasUnsavedChanges && (
                      <span className="ml-2 text-xs text-orange-600">*</span>
                    )}
                  </div>
                  <CustomButton
                    className={`w-[150px] ${
                      hasUnsavedChanges
                        ? "bg-orange-500 hover:bg-orange-600"
                        : ""
                    }`}
                    onClick={handleUpdateScore}
                    disabled={!hasUnsavedChanges}
                    loading={updating}
                  >
                    {hasUnsavedChanges ? "Save Changes" : "Update Score"}
                  </CustomButton>
                </div>
              </div>
            </div>
          </TooltipProvider>
        </div>

        {/* Performance overview */}
        {/* {renderPerformanceCard()} */}

        {/* Question content */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold mb-2">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </h2>
              <div className="text-sm text-gray-500 mb-4">
                {currentQuestion.type && (
                  <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-medium mr-2">
                    {currentQuestion.type.replace("-", " ").toUpperCase()}
                  </span>
                )}
                Max Score: {currentQuestion.score || 0} points
              </div>
            </div>

            {renderScoreEditor(currentQuestion.id)}
          </div>

          <div className="mb-8">
            <div className="mb-8">
              <div className="prose max-w-none">
                <ReactMarkdown>{currentQuestion.text}</ReactMarkdown>
              </div>
            </div>

            {renderAnswerAndFeedback(
              currentQuestion,
              results,
              currentQuestion.id
            )}
          </div>
        </div>

        {/* Enhanced Footer Navigation */}
        <div className="bg-white p-4 pt-0">
          {/* Question pagination with status indicators */}
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
        </div>
        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={closeToast}
        />
      </div>
    </div>
  );
};

export default StudentResultPage;
