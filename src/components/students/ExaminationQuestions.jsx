import React, { useState, useEffect, useRef } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Visibility from "@mui/icons-material/Visibility";
import { useLocation, useNavigate } from "react-router-dom";
import { submitExamForGrading } from "./ExamComponents";
import apiCall from "../../utils/apiCall";
import { useDispatch } from "react-redux";
import { setShowExamConcludedDialog } from "../../features/reducers/uiSlice";
import { ExamConcludedDialog } from "../modals/AuthModals";
import axios from "axios";
import { PETTY_SERVER_URL } from "../../utils/constants";

const ExaminationQuestions = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const exam = location.state?.exam || {};
  // State to manage current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // State to hold all user answers
  const [userAnswers, setUserAnswers] = useState({});

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState("00:00:00");
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [tabLeaveCount, setTabLeaveCount] = useState(0);

  // Submission status state
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerIntervalRef = useRef(null);

  // Get questions array from exam data
  const questions = exam.questions || [];
  const totalQuestions = questions.length;

  // Function to handle answer selection
  const handleAnswerSelection = (value) => {
    setUserAnswers({
      ...userAnswers,
      [questions[currentQuestionIndex].id]: value,
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
      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          setTabLeaveCount((prev) => prev + 1);
        } else if (tabLeaveCount > 0) {
          alert("Please do not leave the tab during the exam!");
          if (tabLeaveCount >= 3) {
            handleSubmit();
          }
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [tabLeaveCount]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      alert(
        "All exam data will be lost if you refresh the page. Are you sure?"
      );
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Function to handle when time is up
  const handleTimeUp = async () => {
    if (isTimeUp || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const gradingResults = await submitExamForGrading(
        exam.id,
        userAnswers,
        exam
      );

      setSubmissionStatus("Time's up! Your answers have been submitted.");

      setTimeout(() => {
        navigate(`/examinations/${exam.id}/result`, {
          state: { results: gradingResults, exam, userAnswers },
        });
      }, 2000);
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

    setIsSubmitting(true);
    try {
      setSubmissionStatus("Submitting your answers...");

      const userData = JSON.parse(localStorage.getItem("userData"));
      const user = JSON.parse(localStorage.getItem("user"));
      const studentNumber = userData.studentNumber;
      const studentId = user.studentId;

      // const gradingResults = await submitExamForGrading(
      //   exam.id,
      //   userAnswers,
      //   exam
      // );

      // const body = {
      //   student: {
      //     matric_number: studentNumber,
      //   },
      //   exam: exam.id,
      //   answers: userAnswers,
      //   gradingStatus: "Not Graded",
      //   is_approved: false,
      // };

      const body = {
        examId: exam.id,
        studentId: studentId,
        userAnswers,
        token: localStorage.getItem("access_token"),
      };

      const response = await axios.post(
        `${PETTY_SERVER_URL}/api/exams/submit`,
        body
      );

      // const response = await apiCall.post(
      //   `/exams/student-exams/submit_exam/`,
      //   body
      // );
      if (response.status === 200) {
        setSubmissionStatus("Submitted successfully!");
      }

      dispatch(setShowExamConcludedDialog(true));
      // console.log({
      //   examId: exam.id,
      //   gradingResults,
      //   userAnswers,
      //   token: localStorage.getItem("access_token"),
      // });

      // setTimeout(() => {
      //   navigate(`/examinations/${exam.id}/result`, {
      //     state: { results: gradingResults, exam, userAnswers },
      //   });
      // }, 2000);
    } catch (error) {
      console.error("Error submitting exam:", error);
      setSubmissionStatus("Failed to submit answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to render question based on type
  const renderQuestion = (question) => {
    if (!question) return null;

    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Options</h3>
            <div className="space-y-4">
              {question.options.map((option) => (
                <label key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    name={`answer-${question.id}`}
                    value={option.id}
                    className="w-5 h-5 mr-4"
                    checked={userAnswers[question.id] === option.id}
                    onChange={() => handleAnswerSelection(option.id)}
                    disabled={isTimeUp || isSubmitting}
                  />
                  <span>{option.text}</span>
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
          <p className="text-gray-500 text-sm">
            Score: {currentQuestion.score || 0} point
            {(currentQuestion.score || 0) !== 1 ? "s" : ""}
          </p>
        </div>

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
          <h2 className="text-xl font-bold mb-6">
            Question {currentQuestionIndex + 1}
          </h2>

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

      <ExamConcludedDialog />
    </div>
  );
};

export default ExaminationQuestions;
