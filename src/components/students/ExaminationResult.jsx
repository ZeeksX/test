import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import ProgressBar from "../ui/ProgressBar";

const ExaminationResult = () => {
  const location = useLocation();
  const { exam, results, userAnswers } = location.state || {};
  const [totalPoints, setTotalPoints] = useState(0);
  const [rightAnswers, setRightAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const navigate = useNavigate();
  // Calculate total points once when component mounts
  useEffect(() => {
    if (exam?.questions) {
      const points = exam.questions.reduce((total, question) => {
        return total + (question.score || 0);
      }, 0);
      setTotalPoints(points);
    }
  }, [exam]);
  // Calculate right and wrong answers count
  useEffect(() => {
    if (!results?.details || !exam?.questions) return;

    let right = 0;
    let wrong = 0;

    // Convert details object to array of question indices
    const questionIndices = Object.keys(results.details);

    questionIndices.forEach((index) => {
      // Get question from exam.questions array using index
      const question = exam.questions[parseInt(index)];

      // Get student result for this question
      const studentResult = results.details[index]["1"]; // Assuming student ID "1"

      if (question && studentResult) {
        // Compare student score with question's max score
        if (studentResult.score === question.score) {
          right++;
        } else {
          wrong++;
        }
      }
    });

    setRightAnswers(right);
    setWrongAnswers(wrong);
  }, [results, exam?.questions]);

  // Calculate converted score with memoization
  const convertedScore = useMemo(() => {
    if (!results?.total_scores?.[1] || totalPoints === 0) return 0;
    return (results.total_scores[1] * 100) / totalPoints;
  }, [results, totalPoints]);

  if (!exam || !results) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">No exam results available</p>
      </div>
    );
  }

  const handleClick = (exam, results, userAnswers) => {
    navigate(`/examinations/${exam.id}/review`, {
      state: { exam, results, userAnswers },
    });
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6 px-11 flex flex-col gap-4">
        <h1 className="text-[32px] leading-8 font-medium">
          {exam.title} - Results
        </h1>
        <p className="text-sm text-[#222222] font-normal">
         See results for this exam
        </p>
      </div>
      <hr className="text-[#D0D5DD] mb-4" />

      <div className="w-full flex justify-center items-center">
        <div className="bg-white flex flex-col md:flex-row justify-between px-4 md:px-32 gap-8 md:gap-12 border my-8 border-[#D0D5DD] rounded-md w-full md:w-4/5 py-10">
          <div className="w-full md:w-[356px] flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-10">
              <div>
                <ProgressBar score={parseInt(convertedScore)} />
              </div>
              <h1 className="text-[#A1A1A1] text-[40px] font-semibold">
                <span className="text-[#1836B2] text-9xl font-semibold">
                  {results.total_scores?.[1] || 0}
                </span>
                /{totalPoints}
              </h1>
            </div>
            <p className="text-[#1836B2] text-base font-semibold">
              {convertedScore >= 75
                ? "Congratulations! You passed the examination!"
                : "Keep practicing! You can do better next time!"}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-base">Total Number of Questions</h1>
              <span className="text-[#A1A1A1] text-[40px]">
                {exam.questions?.length || 0}
              </span>
            </div>
            <div>
              <h1 className="text-base">Number of right answers</h1>
              <span className="text-[#34A853] text-[40px]">{rightAnswers}</span>
            </div>
            <div>
              <h1 className="text-base">Number of wrong answers</h1>
              <span className="text-[#EA4335] text-[40px]">{wrongAnswers}</span>
            </div>
            <button
              onClick={() => {
                handleClick(exam, results, userAnswers);
              }}
              className="bg-[#1835B3] w-full md:w-[92px] h-11 gap-2 text-white flex items-center justify-center font-semibold text-base rounded-md px-4 hover:ring-2 hover:ring-blue-300 transition-all"
            >
              Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationResult;
