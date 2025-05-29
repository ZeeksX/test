import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const ExaminationResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { examId } = useParams();

  const { studentResult, loading } = useSelector((state) => state.exams);
  console.log({ studentResult });

  const [rightAnswers, setRightAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.studentId;

  useEffect(() => {
    if (examId && studentId) {
      dispatch(newFetchStudentResult({ examId, studentId }));
      console.log("Fetching student result for:", { examId, studentId });
    }
    // Cleanup when component unmounts
    return () => {
      dispatch(resetStudentResult());
    };
  }, [dispatch, examId, studentId]);

  const { exam, results, userAnswers, submissionInfo } = studentResult || {};

  useEffect(() => {
    if (!exam?.questions?.length) return;

    const total = exam.questions.reduce((sum, q) => sum + (q.score || 0), 0);
    setTotalPoints(total);
  }, [exam]);

  useEffect(() => {
    if (!results?.details || !exam?.questions) return;

    let right = 0;
    let wrong = 0;

    Object.entries(results.details).forEach(([index, scores]) => {
      const question = exam.questions[parseInt(index)];
      const studentScore = scores?.[1];

      if (!question || !studentScore) return;

      if (studentScore.score === question.score) {
        right++;
      } else {
        wrong++;
      }
    });

    setRightAnswers(right);
    setWrongAnswers(wrong);
  }, [results, exam?.questions, studentId]);

  
  // useEffect(() => {
  //   if (!results?.details || !exam?.questions || !studentId) return;

  //   let right = 0;
  //   let wrong = 0;

  //   const questionScores = results.details.question_scores;

  //   if (!questionScores) return;

  //   exam.questions.forEach((_, index) => {
  //     const studentScore = questionScores[index];

  //     if (typeof studentScore === "number") {
  //       const maxScore = exam.questions[index].score;
  //       if (studentScore === maxScore) {
  //         right++;
  //       } else {
  //         wrong++;
  //       }
  //     }
  //   });

  //   setRightAnswers(right);
  //   setWrongAnswers(wrong);
  // }, [results, exam?.questions, studentId]);

  const convertedScore = useMemo(() => {
    const studentScore = results?.total_scores?.[1] || 0;
    return totalPoints ? (studentScore * 100) / totalPoints : 0;
  }, [results, totalPoints]);

  const handleReviewClick = () => {
    navigate(`/examinations/${examId}/review`, {
      state: { studentResult },
    });
  };

  if (loading) return <Loader />;

  if (!exam || !results) {
    return (
      <div className=" h-[calc(100dvh_-_64px)] flex flex-col justify-center items-center gap-4 col-span-full ">
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

  if (submissionInfo.is_approved == false) {
    return (
      <div className=" h-[calc(100dvh_-_64px)] flex flex-col justify-center items-center gap-4 col-span-full ">
        <img className="w-32 h-32" src={illustration2} alt="Illustration" />
        <h1 className="text-[32px] max-md:text-2xl font-medium leading-8">
          Result not Published
        </h1>
        <p className="text-[#667085] text-lg">
          You will be able to view your result once the lecturer has published
          it.
        </p>
        <CustomButton as="link" to="/examinations">
          Back to Examinations
        </CustomButton>
      </div>
    );
  }

  const totalScore = results.total_scores?.[1] || 0;

  return (
    <div className="min-h-[calc(100dvh_-_64px)] bg-gray-50">
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-[32px] font-medium">{exam.title} - Results</h1>
        <p className="text-sm text-[#222]">See results for this exam</p>
      </div>

      <div className="w-full flex justify-center items-center p-4">
        <div className="bg-white flex flex-col md:flex-row justify-between px-8 md:px-20 gap-8 md:gap-12 border border-[#D0D5DD] rounded-md w-full py-10">
          <div className="w-full md:w-[356px] flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-10">
              <ProgressBar score={Math.round(convertedScore)} />
              <h1 className="text-[#A1A1A1] text-[40px] font-semibold">
                <span className="text-[#1836B2] text-9xl font-semibold">
                  {totalScore}
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
