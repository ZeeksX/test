import React, { useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import apiCall from "../../utils/apiCall";
import Toast from "../modals/Toast";
import CustomButton from "../ui/Button";
import { Badge } from "../ui/Badge";
import { FiCalendar, FiClock, FiFileText, FiTarget } from "react-icons/fi";
import { formatScheduleTime, mapQuestions } from "../modals/UIUtilities";
import { LuTimer } from "react-icons/lu";

const ExaminationInstructions = () => {
  const { state } = useLocation();
  const { examination: exam } = state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  console.log(exam);

  if (!exam) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <p className="text-red-500">No examination details provided.</p>
      </div>
    );
  }

  const questions = mapQuestions(exam.questions);

  const totalScore = questions.reduce(
    (sum, question) => sum + question.score,
    0
  );

  const startDateTime = formatScheduleTime(exam.schedule_time);
  const endDateTime = formatScheduleTime(exam.due_time);

  const handleClick = async (exam) => {
    setLoading(true);
    try {
      const response = await apiCall.post(`/exams/exams/${exam.id}/start/`);
      if (response.status === 201 || response.status === 200) {
        navigate(`/examinations/${exam.id}/questions`, {
          state: { exam },
        });
      }
    } catch (error) {
      console.error("Error starting exam:", error);
      if (error.status == 400) {
        showToast("You have already started this exam.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const instructions = [
    "This exam is timed. The timer starts and ends at the exact time set by your teacher. It will submit automatically when time runs out.",
    "Do not switch tabs during the exam. If you leave this page or open a new tab, your exam will end automatically.",
    "Ensure your device is charged and your internet connection is stable before beginning.",
    "Take your time to read and understand each question before answering.",
    "For theory questions, feel free to explain in your own words. Our system looks for understanding, not memorised lines.",
    "If you’re stuck on a question, move on and return to it later. Your answers are autosaved.",
    "This exam is designed to help you grow and show what you’ve learned. Take your time, stay focused, and do your best.",
  ];

  return (
    <div
      className="flex-1 overflow-y-scroll bg-gray-100"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
        <p className="text-gray-500 mt-1 mb-6">{exam.description}</p>

        <div className="space-y-6 bg-white rounded-md mb-6 border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <FiFileText className="w-5 h-5 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Exam Type
                </span>
                <p className="text-gray-900 font-medium">{exam.exam_type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiFileText className="w-5 h-5 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Questions
                </span>
                <p className="text-gray-900 font-medium">
                  {questions.length} questions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiTarget className="w-5 h-5 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Total Score
                </span>
                <p className="text-gray-900 font-medium">{totalScore} marks</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <FiCalendar className="w-5 h-5 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Start Time
                </span>
                <p className="text-gray-900 font-medium">{startDateTime}</p>
                {/* <p className="text-gray-600 text-sm">{startDateTime.time}</p> */}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiClock className="w-5 h-5 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Due Time
                </span>
                <p className="text-gray-900 font-medium">{endDateTime}</p>
                {/* <p className="text-gray-600 text-sm">{endDateTime.time}</p> */}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LuTimer className="w-5 h-5 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Duration
                </span>
                <p className="text-gray-900 font-medium">
                  {exam.duration} minutes
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <span className="text-sm font-medium text-gray-500 mb-3 block">
              Question Types
            </span>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(questions.map((q) => q.type))).map((type) => {
                const count = questions.filter((q) => q.type === type).length;
                return (
                  <Badge key={type} variant="outline" className="capitalize">
                    {type.replace("-", " ")}: {count}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md border p-4">
          {/* Render Instructions */}
          <div className="space-y-4">
            <p className="">
              Hey scholar! Before you begin, here are a few things to know:
            </p>
            {instructions.map((text, index) => (
              <div className="flex" key={index}>
                <div className="flex-shrink-0 w-1">
                  <div className="w-full h-7 bg-[#1836B2] mt-1" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">{text}</p>
                </div>
              </div>
            ))}
            <p className="">
              We believe in you. <strong>Good luck!</strong>
            </p>
            <p className="">
              When you're ready, click the <strong>Start Examination</strong>{" "}
              button below.
            </p>
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-8">
          <CustomButton
            type="button"
            loading={loading}
            className="w-[170px] h-[40px] px-6 py-3 bg-[#1836B2] text-white font-medium rounded-md transition-colors"
            onClick={() => {
              handleClick(exam);
            }}
          >
            Start Examination
          </CustomButton>
        </div>
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

export default ExaminationInstructions;
