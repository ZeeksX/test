import { useState, useEffect, useRef } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Visibility from "@mui/icons-material/Visibility";
import { useLocation, useNavigate } from "react-router-dom";
import apiCall from "../../utils/apiCall";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowExamConcludedDialog,
  setShowSubmitExamWarningDialog,
} from "../../features/reducers/uiSlice";
import { ExamConcludedDialog } from "../modals/AuthModals";
import { mapQuestions } from "../modals/UIUtilities";
import { DialogTitle, OutsideDismissDialog } from "../ui/Dialog";
import { DropdownMenuSeparator } from "../ui/Dropdown";
import CustomButton from "../ui/Button";
import Toast from "../modals/Toast";
import { Badge } from "../ui/Badge";
import { FiCalendar, FiClock, FiFileText, FiTarget } from "react-icons/fi";
import { formatScheduleTime } from "../modals/UIUtilities";
import { LuTimer } from "react-icons/lu";

const ExaminationQuestions = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const exam = location.state?.exam || {};

  // Generate unique keys for localStorage based on exam ID
  const localStorageKey = `exam_answers_${exam.id}`;
  const tabLeaveCountKey = `tab_leave_count_${exam.id}`;

  // State to manage current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // State to hold all user answers - initialize from localStorage
  const [userAnswers, setUserAnswers] = useState(() => {
    try {
      const savedAnswers = localStorage.getItem(localStorageKey);
      return savedAnswers ? JSON.parse(savedAnswers) : {};
    } catch (error) {
      console.error("Error loading saved answers:", error);
      return {};
    }
  });

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState("00:00:00");
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Initialize tab leave count from localStorage
  const [tabLeaveCount, setTabLeaveCount] = useState(() => {
    try {
      const savedCount = localStorage.getItem(tabLeaveCountKey);
      return savedCount ? parseInt(savedCount, 10) : 0;
    } catch (error) {
      console.error("Error loading tab leave count:", error);
      return 0;
    }
  });

  // Submission status state
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerIntervalRef = useRef(null);

  // Get questions array from exam data
  const questions = mapQuestions(exam.questions) || [];
  const totalQuestions = questions.length;

  // console.log(exam.questions)
  useEffect(() => {
    dispatch(setShowSubmitExamWarningDialog({ willShow: false, result: null }));
  }, [dispatch]);

  // Save answers to localStorage whenever userAnswers changes
  useEffect(() => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(userAnswers));
    } catch (error) {
      console.error("Error saving answers to localStorage:", error);
    }
  }, [userAnswers, localStorageKey]);

  // Save tab leave count to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(tabLeaveCountKey, tabLeaveCount.toString());
    } catch (error) {
      console.error("Error saving tab leave count to localStorage:", error);
    }
  }, [tabLeaveCount, tabLeaveCountKey]);

  // Clear localStorage when exam is successfully submitted
  const clearSavedAnswers = () => {
    try {
      localStorage.removeItem(localStorageKey);
      localStorage.removeItem(tabLeaveCountKey);
    } catch (error) {
      console.error("Error clearing saved data:", error);
    }
  };

  // Function to handle answer selection for single-choice questions
  const handleAnswerSelection = (value) => {
    setUserAnswers({
      ...userAnswers,
      [questions[currentQuestionIndex].id]: value,
    });
  };

  // Function to handle multiple answer selection for multi-choice questions
  const handleMultipleAnswerSelection = (optionId) => {
    const questionId = questions[currentQuestionIndex].id;
    const currentAnswers = userAnswers[questionId] || [];

    let newAnswers;
    if (currentAnswers.includes(optionId)) {
      // Remove option if already selected
      newAnswers = currentAnswers.filter((id) => id !== optionId);
    } else {
      // Add option if not selected
      newAnswers = [...currentAnswers, optionId];
    }

    setUserAnswers({
      ...userAnswers,
      [questionId]: newAnswers,
    });
  };

  // Function to navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Function to navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Function to navigate to specific question by index
  const goToQuestion = (index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!exam.due_time) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const dueDate = new Date(exam.due_time);

      const diffMs = dueDate - now;

      if (diffMs <= 0) {
        setTimeRemaining("00:00:00");
        setIsTimeUp(true);
        return false;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      setTimeRemaining(
        `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
      );
      return true;
    };

    const hasTimeRemaining = calculateTimeRemaining();

    if (hasTimeRemaining) {
      timerIntervalRef.current = setInterval(() => {
        const hasTime = calculateTimeRemaining();
        if (!hasTime) {
          clearInterval(timerIntervalRef.current);
          handleTimeUp();
        }
      }, 1000);
    } else {
      handleTimeUp();
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [exam.due_time]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        setTabLeaveCount((prev) => prev + 1);
      } else if (tabLeaveCount > 0) {
        const message = `Please do not leave the tab during the exam! Times left: ${tabLeaveCount}.`;
        alert(message);
        if (tabLeaveCount >= 2) {
          setIsSubmitting(true);
          try {
            setSubmissionStatus("Submitting your answers...");
            const body = {
              answers: userAnswers,
              tab_switch_count: tabLeaveCount,
            };
            console.log(body);
            const response = await apiCall.post(
              `/exams/exams/${exam.id}/submit/`,
              body
            );
            if (response.status === 200) {
              setSubmissionStatus("Your exam was submitted for you as you switched tabs more that the max times allowed.");
              clearSavedAnswers();
              dispatch(setShowExamConcludedDialog(true));
            }
          } catch (error) {
            console.error("Error submitting exam:", error);
            setSubmissionStatus("Failed to submit answers. Please try again.");
          } finally {
            setIsSubmitting(false);
          }
          handleSubmit();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [clearSavedAnswers, dispatch, exam.id, tabLeaveCount, userAnswers]);

  // Function to handle when time is up
  const handleTimeUp = async () => {
    if (isTimeUp || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // handleSubmit();
      setSubmissionStatus("Submitting your answers...");

      const body = {
        answers: userAnswers,
        tab_switch_count: tabLeaveCount,
      };

      console.log(body);

      const response = await apiCall.post(
        `/exams/exams/${exam.id}/submit/`,
        body
      );

      if (response.status === 200) {
        setSubmissionStatus("Submitted successfully!");
        clearSavedAnswers();
        dispatch(setShowExamConcludedDialog(true));
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      setSubmissionStatus("Failed to submit answers. Please try again.");
    } finally {
      setIsTimeUp(true);
      setIsSubmitting(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  // Function to handle manual exam submission
  const handleSubmit = async () => {
    if (isTimeUp || isSubmitting) return;
    dispatch(
      setShowSubmitExamWarningDialog({
        willShow: true,
        result: [userAnswers, tabLeaveCount],
      })
    );
  };

  const totalScore = questions.reduce(
    (sum, question) => sum + question.score,
    0
  );

  const startDateTime = formatScheduleTime(exam.schedule_time);
  const endDateTime = formatScheduleTime(exam.due_time);

  // Helper function to render question based on type
  const renderQuestion = (question) => {
    if (!question) return null;

    switch (question.type) {
      case "multiple-choice":
        // const currentAnswers = userAnswers[question.id] || [];

        return (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Options</h3>
            <div className="space-y-4">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`answer-${question.id}`}
                    value={option.text}
                    className="w-5 h-5 mr-4 accent-[#1836B2]"
                    checked={userAnswers[question.id] === option.text}
                    onChange={() => handleAnswerSelection(option.text)}
                    disabled={isTimeUp || isSubmitting}
                  />
                  <span
                    className={`${
                      isTimeUp || isSubmitting
                        ? "text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {option.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "cloze":
        return (
          <div className="mb-8">
            <div className="mb-4">
              <input
                onPaste={(e) => e.preventDefault()}
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your answer"
                value={userAnswers[question.id] || ""}
                onChange={(e) => handleAnswerSelection(e.target.value)}
                disabled={isTimeUp || isSubmitting}
              />
            </div>
          </div>
        );

      case "theory":
        return (
          <div className="mb-8">
            <textarea
              onPaste={(e) => e.preventDefault()}
              className="w-full p-2 border border-gray-300 rounded min-h-32"
              placeholder="Enter your answer"
              value={userAnswers[question.id] || ""}
              onChange={(e) => handleAnswerSelection(e.target.value)}
              disabled={isTimeUp || isSubmitting}
            />
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
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

  // Current question
  const currentQuestion = questions[currentQuestionIndex] || {};
  const paginationPages = generatePagination();

  return (
    <div className="flex-1 overflow-auto flex flex-col h-full">
      <div className="px-6 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{exam.title}</h1>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Visibility
                className="text-[#1836B2] mr-2"
                sx={{ color: "#1836B2" }}
              />
              <span
                className={`text-2xl font-bold ${
                  timeRemaining === "00:00:00" ? "text-red-600" : ""
                }`}
              >
                {timeRemaining}
              </span>
            </div>
            <button
              className={`${
                isTimeUp || isSubmitting ? "bg-gray-400" : "bg-[#1836B2]"
              } text-white px-6 py-2 rounded-md font-medium`}
              onClick={handleSubmit}
              disabled={isTimeUp || isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : isTimeUp
                ? "Submitted"
                : "Submit"}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">
            {`Please answer all ${totalQuestions} questions - ` +
              exam.description}
          </p>
        </div>

        {/* Auto-save indicator */}
        <div className="mb-4 text-sm text-green-600 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Your answers are automatically saved
        </div>

        {/* Tab leave count warning */}
        {tabLeaveCount > 0 && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <strong>Warning:</strong> You have switched tabs {tabLeaveCount}{" "}
            time
            {tabLeaveCount !== 1 ? "s" : ""}. The exam will be auto-submitted if
            you switch tabs {2 - tabLeaveCount} more time
            {2 - tabLeaveCount !== 1 ? "s" : ""}.
          </div>
        )}

        {submissionStatus && (
          <div
            className={`${
              submissionStatus.includes("Failed")
                ? "bg-red-100 border-red-400 text-red-700"
                : submissionStatus.includes("Submitting")
                ? "bg-blue-100 border-blue-400 text-blue-700"
                : "bg-green-100 border-green-400 text-green-700"
            } border px-4 py-3 rounded mb-6`}
            role="alert"
          >
            <strong className="font-bold">{submissionStatus}</strong>
          </div>
        )}

        <div className="border-t pt-8">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-xl font-bold mb-4">
              Question {currentQuestionIndex + 1}
            </h2>

            <p className="text-gray-500 text-sm">
              Score: {currentQuestion.score || 0} point
              {(currentQuestion.score || 0) !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="mb-8">
            <p
              className="mb-4 select-none"
              style={{ userSelect: "none" }}
              onCopy={(e) => e.preventDefault()}
            >
              {currentQuestion.text}
            </p>
          </div>

          {renderQuestion(currentQuestion)}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t p-4 flex justify-between items-center mt-auto">
        <button
          className={`flex items-center font-medium ${
            currentQuestionIndex > 0 && !isTimeUp && !isSubmitting
              ? "text-[#1836B2]"
              : "text-gray-400"
          }`}
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0 || isTimeUp || isSubmitting}
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
            currentQuestionIndex < totalQuestions - 1 &&
            !isTimeUp &&
            !isSubmitting
              ? "text-[#1836B2]"
              : "text-gray-400"
          }`}
          onClick={goToNextQuestion}
          disabled={
            currentQuestionIndex === totalQuestions - 1 ||
            isTimeUp ||
            isSubmitting
          }
        >
          Next
          <ChevronRight className="ml-1" />
        </button>
      </div>

      <SubmitExamWarningDialog
        isTimeUp={isTimeUp}
        setSubmissionStatus={setSubmissionStatus}
        examId={exam.id}
        onSubmitSuccess={clearSavedAnswers}
      />
      <ExamConcludedDialog />
    </div>
  );
};

export default ExaminationQuestions;

const SubmitExamWarningDialog = ({
  isTimeUp,
  setSubmissionStatus,
  examId,
  onSubmitSuccess,
}) => {
  const isOpen = useSelector(
    (state) => state.ui.showSubmitExamWarningDialog.willShow
  );
  const result = useSelector(
    (state) => state.ui.showSubmitExamWarningDialog.result
  );
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSubmit = async () => {
    if (isTimeUp || isSubmitting) return;

    setIsSubmitting(true);
    try {
      setSubmissionStatus("Submitting your answers...");

      const body = {
        answers: result[0],
        tab_switch_count: result[1],
      };

      console.log(body);

      const response = await apiCall.post(
        `/exams/exams/${examId}/submit/`,
        body
      );

      if (response.status === 200) {
        setSubmissionStatus("Submitted successfully!");
        // Clear saved answers from localStorage after successful submission
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      }

      dispatch(
        setShowSubmitExamWarningDialog({ willShow: false, result: null })
      );
      dispatch(setShowExamConcludedDialog(true));
    } catch (error) {
      console.error("Error submitting exam:", error);
      setSubmissionStatus("Failed to submit answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <OutsideDismissDialog open={isOpen}>
      <div className="px-6 pt-6 w-full flex justify-between items-start">
        <DialogTitle>Submit Exam</DialogTitle>
      </div>
      <DropdownMenuSeparator />
      <div className="p-6 pt-0">
        <p className="my-3 text-sm text-gray-600 mb-5">
          Are you sure you want to submit this exam. Note that once you click
          submit, the exam will be registered for grading and you will be
          carried to the dashboard.
        </p>
        <div className="w-full flex gap-4">
          <CustomButton
            className="flex-1 min-w-0 h-10"
            variant="clear"
            onClick={() =>
              dispatch(
                setShowSubmitExamWarningDialog({
                  willShow: false,
                  result: null,
                })
              )
            }
          >
            Cancel
          </CustomButton>
          <CustomButton
            className="flex-1 min-w-0 h-10"
            onClick={() => handleSubmit()}
            loading={isSubmitting}
          >
            Submit Exam
          </CustomButton>
        </div>
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </OutsideDismissDialog>
  );
};
