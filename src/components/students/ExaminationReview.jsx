import React, { useState } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { CardFormattedText } from "../ui/Card";
import ReactMarkdown from "react-markdown";

const ExaminationReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || {};
  const exam = location.state?.exam || {};
  const userAnswers = location.state?.userAnswers || {};

  // State to manage current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Get questions array from exam data
  const questions = exam.questions || [];
  const totalQuestions = questions.length;

  // Calculate total score
  const totalScore = results.total_scores["1"] || 0;
  const maxPossibleScore =
    results.max_possible_score ||
    questions.reduce((sum, q) => sum + (q.score || 0), 0);
  const percentageScore =
    maxPossibleScore > 0
      ? Math.round((totalScore / maxPossibleScore) * 100)
      : 0;

  // Perfect score flag
  const isPerfectScore = totalScore === maxPossibleScore;

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
    if (!text || typeof text !== 'string') return text;
    // Replace *word* with markdown bold **word**
    return text.replace(/\*([^*]+)\*/g, '**$1**');
  };

  // Current question and its result
  const currentQuestion = questions[currentQuestionIndex] || {};
  const questionResult = results;
  const paginationPages = generatePagination();

  // Helper function to parse score breakdown from feedback string
  const parseScoreBreakdown = (feedbackStr) => {
    if (!feedbackStr || typeof feedbackStr !== 'string') return null;

    const scoreBreakdownMatch = feedbackStr.match(/Score Breakdown:([\s\S]*?)(?:$|(?=\n\n))/);
    if (!scoreBreakdownMatch) return null;

    const scoreBreakdownText = scoreBreakdownMatch[1].trim();
    const criteriaLines = scoreBreakdownText.split('\n').filter(line => line.trim().startsWith('Criterion'));

    if (criteriaLines.length === 0) return null;

    return criteriaLines.map((line, index) => {
      // Parse the criterion text and score
      const criterionMatch = line.match(/Criterion (\d+) - (.*?) - (\d+\.\d+)\/(\d+\.\d+)/);
      if (!criterionMatch) return null;

      return {
        criterionNumber: criterionMatch[1],
        criterionText: criterionMatch[2],
        scoreObtained: criterionMatch[3],
        maxScore: criterionMatch[4]
      };
    }).filter(Boolean);
  };

  // Extract general feedback (everything before Score Breakdown)
  const extractGeneralFeedback = (feedbackStr) => {
    if (!feedbackStr || typeof feedbackStr !== 'string') return "";

    // Split the feedback into parts and remove model answer section
    const parts = feedbackStr.split(/Model Answer:[\s\S]*?(?=\n\n|$)/i);
    return parts[0].replace(/Score Breakdown:[\s\S]*/, '').trim();
  };

  // Helper function to render feedback
  const renderFeedback = (feedback) => {
    if (!feedback) return null;

    if (typeof feedback === 'object' && feedback !== null) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Feedback</h3>
          <div className="p-4 border border-gray-300 rounded bg-gray-50">
            <table className="w-full">
              <tbody>
                {Object.entries(feedback).map(([key, value]) => (
                  <tr key={key} className="border-b last:border-b-0">
                    <td className="py-2 pr-4 font-medium">{key}:</td>
                    <td className="py-2"><CardFormattedText text={value} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Handle string feedback with potential score breakdown
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
                      <th className="p-2 text-left border border-gray-300">Criteria No</th>
                      <th className="p-2 text-left border border-gray-300">Criteria</th>
                      <th className="p-2 text-center border border-gray-300">Marks Obtained</th>
                      <th className="p-2 text-center border border-gray-300">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreBreakdown.map((criterion, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-2 border border-gray-300">{criterion.criterionNumber}</td>
                        <td className="p-2 border border-gray-300">{criterion.criterionText}</td>
                        <td className="p-2 text-center border border-gray-300">{criterion.scoreObtained}</td>
                        <td className="p-2 text-center border border-gray-300">{criterion.maxScore}</td>
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
        const selectedOption = question.options.find(opt => opt.id === userAnswer);

        return (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Your Answer</h3>
            <div className="space-y-4">
              {question.options.map((option) => {
                const isCorrect = option.isCorrect;
                const isUserSelected = option.id === userAnswer;

                let bgColor = "bg-white";
                if (isUserSelected) {
                  bgColor = answerDetails.score === question.score ? "bg-green-100" : "bg-red-100";
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

                    <span className={isUserSelected && !isCorrect ? "text-red-800" : ""}>
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
            <h3 className="text-lg font-bold mb-4">Your Answer</h3>
            <div className="mb-4">
              <div
                className={`p-3 border rounded ${answerDetails.score === question.score
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
                  }`}
              >
                <p className="font-medium">You entered: {userAnswer || "(No answer provided)"}</p>
                <p className="mt-2 text-gray-700">
                  {answerDetails.score === question.score
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
            <h3 className="text-lg font-bold mb-4">Your Answer</h3>
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
                <ReactMarkdown>{question.modelAnswer || "No model answer provided"}</ReactMarkdown>
              </div>
            </div>
            {renderFeedback(answerDetails.feedback)}
            <div className="mt-4 p-2 bg-gray-100 rounded">
              <p className="font-medium">Score: {answerDetails.score}/{question.score} points</p>
            </div>
          </div>
        );
      }

      default:
        return <div>Unsupported question type</div>;
    }
  };

  // Back to dashboard button handler
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex-1 overflow-auto flex flex-col h-full">
      <div className="px-6 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {exam.title} - Results
          </h1>
          <div className="flex items-center">
            <div className={`px-4 py-2 rounded-md flex items-center ${isPerfectScore ? "bg-green-100" : "bg-red-100"
              }`}>
              <span className="text-gray-600 mr-2">Score:</span>
              <span
                className={`text-2xl font-bold ${percentageScore >= 70
                  ? "text-green-600"
                  : percentageScore >= 50
                    ? "text-yellow-600"
                    : "text-red-600"
                  }`}
              >
                {totalScore}/{maxPossibleScore} ({percentageScore}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">Review your answers and feedback</p>
          <button
            className="bg-[#1836B2] text-white px-6 py-2 rounded-md font-medium"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              Question {currentQuestionIndex + 1}
            </h2>
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${(questionResult.details?.[currentQuestionIndex]?.[1]?.score || 0) ===
                  (currentQuestion.score || 0)
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                  }`}
              >
                {(questionResult.details?.[currentQuestionIndex]?.[1]?.score || 0) ===
                  (currentQuestion.score || 0)
                  ? "Correct"
                  : "Incorrect"}{" "}
                - {questionResult.details?.[currentQuestionIndex]?.[1]?.score ||
                  0}
                /{currentQuestion.score || 0} points
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
          className={`flex items-center font-medium ${currentQuestionIndex > 0 ? "text-[#1836B2]" : "text-gray-400"
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
              className={`w-8 h-8 flex items-center justify-center rounded-md ${page === currentQuestionIndex
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
          className={`flex items-center font-medium ${currentQuestionIndex < totalQuestions - 1
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
  );
};

export default ExaminationReview;