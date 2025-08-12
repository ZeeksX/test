import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  newFetchStudentResult,
  resetStudentResult,
} from "../../features/reducers/examSlice";
import ProgressBar from "../ui/ProgressBar";
import { Loader } from "../ui/Loader";
import { Card } from "../ui/Card";
import { DialogHeader, DialogTitle } from "../ui/Dialog";
import { DialogContent } from "@mui/material";
import { illustration2 } from "../../utils/images";
import CustomButton from "../ui/Button";
import {
  IoChevronBack,
  IoTrophy,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTime,
  IoCalendar,
} from "react-icons/io5";
import { convertDetailStructure, mapQuestions } from "../modals/UIUtilities";

const ExaminationResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { examId } = useParams();

  const { studentResult, loading } = useSelector((state) => state.exams);

  const [rightAnswers, setRightAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.studentId;

  useEffect(() => {
    if (examId && studentId) {
      dispatch(newFetchStudentResult({ examId, studentId }));
    }
    return () => {
      dispatch(resetStudentResult());
    };
  }, [dispatch, examId, studentId]);

  const { exam, results, userAnswers, submissionInfo } = studentResult || {};
  // const details = convertDetailStructure(results?.details);
  const details = results?.details;
  // const questions = exam?.questions ? mapQuestions(exam?.questions) : [];

  // console.log({ exam, results, details, userAnswers });
  // Calculate total points from exam questions
  useEffect(() => {
    if (!exam?.questions?.length) return;
    const total = exam.questions.reduce(
      (sum, q) => sum + (q.max_score || q.score || 0),
      0
    );
    setTotalPoints(total);
  }, [exam]);

  // Calculate right and wrong answers
  useEffect(() => {
    if (!results?.details || !exam?.questions) return;

    let right = 0;
    let wrong = 0;
    let unanswered = 0;

    exam.questions.forEach((question, index) => {
      const questionId = question.id;
      // console.log(questionId)
      const questionScore = details[questionId].score;
      const maxScore = question.max_score || question.score || 0;

      if (questionScore === undefined || questionScore === null) {
        unanswered++;
      } else if (questionScore === maxScore) {
        right++;
      } else {
        wrong++;
      }
    });

    setRightAnswers(right);
    setWrongAnswers(wrong);
  }, [results, exam?.questions]);

  // Calculate percentage score
  const convertedScore = useMemo(() => {
    const studentScore =
      results?.total_scores?.[1] || submissionInfo?.score || 0;
    return totalPoints ? (studentScore * 100) / totalPoints : 0;
  }, [results, submissionInfo, totalPoints]);

  // Get performance level
  const getPerformanceLevel = (score) => {
    if (score >= 90)
      return { level: "Excellent", color: "#10B981", bgColor: "#D1FAE5" };
    if (score >= 80)
      return { level: "Very Good", color: "#3B82F6", bgColor: "#DBEAFE" };
    if (score >= 70)
      return { level: "Good", color: "#8B5CF6", bgColor: "#EDE9FE" };
    if (score >= 60)
      return { level: "Satisfactory", color: "#F59E0B", bgColor: "#FEF3C7" };
    if (score >= 50)
      return { level: "Pass", color: "#EF4444", bgColor: "#FEE2E2" };
    return { level: "Fail", color: "#DC2626", bgColor: "#FECACA" };
  };

  const performance = getPerformanceLevel(convertedScore);

  const handleReviewClick = () => {
    navigate(`/examinations/${examId}/review`, {
      state: { studentResult },
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getQuestionBreakdown = () => {
    if (!exam?.questions || !results?.details?.question_scores) return [];

    return exam.questions.map((question, index) => {
      const score = results.details.question_scores[index];
      const maxScore = question.max_score || question.score || 0;
      const userAnswer = userAnswers?.[question.id];

      return {
        questionNumber: index + 1,
        question: question.question,
        userAnswer,
        correctAnswer: question.model_answer,
        score,
        maxScore,
        type: question.answer_type,
        isCorrect: score === maxScore,
        feedback: details?.[index]?.[1]?.feedback,
      };
    });
  };

  if (loading) return <Loader />;

  if (!exam || !results) {
    return (
      <div className="h-[calc(100dvh_-_64px)] flex flex-col justify-center items-center gap-4 col-span-full">
        <img className="w-32 h-32" src={illustration2} alt="Illustration" />
        <h1 className="text-[32px] max-md:text-2xl font-medium leading-8">
          No Submission available for this exam
        </h1>
        <p className="text-[#667085] text-lg text-center">
          You might not have submitted this exam or your submission has been
          deleted. <br /> Contact your lecturer.
        </p>
        <CustomButton as="link" to="/examinations">
          Back to Examinations
        </CustomButton>
      </div>
    );
  }

  if (submissionInfo?.is_approved === false) {
    return (
      <div className="h-[calc(100dvh_-_64px)] flex flex-col justify-center items-center gap-4 col-span-full">
        <img className="w-32 h-32" src={illustration2} alt="Illustration" />
        <h1 className="text-[32px] max-md:text-2xl font-medium leading-8">
          Result not Published
        </h1>
        <p className="text-[#667085] text-lg text-center">
          You will be able to view your result once the lecturer has published
          it.
        </p>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <IoTime />
            <span>
              Submitted: {formatDate(submissionInfo?.submission_time)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-orange-400 rounded-full"></span>
            <span>Status: {submissionInfo?.grading_status}</span>
          </div>
        </div>
        <CustomButton as="link" to="/examinations">
          Back to Examinations
        </CustomButton>
      </div>
    );
  }

  const totalScore = results.total_scores?.[1] || submissionInfo?.score || 0;
  const questionBreakdown = getQuestionBreakdown();

  return (
    <div className="min-h-[calc(100dvh_-_64px)] bg-gray-50">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex gap-2">
          <Link
            to="/examinations"
            className="rounded-full w-8 hover:bg-[#EAECF0] bg-transparent flex items-center justify-center hover:text-primary-main"
          >
            <IoChevronBack size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {exam?.title || "Exam"} - Results
          </h1>
        </div>
        {/* <h1 className="text-[32px] font-medium">{exam.title} - Results</h1> */}
        <p className="text-sm text-[#222]">See results for this exam</p>
      </div>

      <div className="w-full flex justify-center items-center p-4 pt-0">
        <div className="bg-white flex flex-col md:flex-row justify-between px-8 md:px-20 gap-8 md:gap-12 border border-[#D0D5DD] rounded-md w-full py-10">
          <div className="w-full md:w-[356px] flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-10">
              <ProgressBar score={Math.round(convertedScore)} />
              <h1 className="text-[#A1A1A1] text-[40px] font-semibold">
                <span className="text-[#1836B2] text-9xl font-semibold">
                  {parseInt(totalScore)}
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
            <Stat
              label="Total Number of Questions"
              value={exam.questions?.length || 0}
            />
            <Stat
              label="Number of right answers"
              value={rightAnswers}
              color="#34A853"
            />
            <Stat
              label="Number of wrong answers"
              value={wrongAnswers}
              color="#EA4335"
            />
            <button
              onClick={handleReviewClick}
              className="bg-[#1835B3] w-full md:w-[92px] h-11 text-white font-semibold text-base rounded-md px-4 hover:ring-2 hover:ring-blue-300 transition-all"
            >
              Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, color = "#A1A1A1" }) => (
  <div>
    <h1 className="text-base">{label}</h1>
    <span className="text-[40px]" style={{ color }}>
      {value}
    </span>
  </div>
);

export default ExaminationResult;
