import React, { useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import apiCall from "../../utils/apiCall";
import Toast from "../modals/Toast";

const ExaminationInstructions = () => {
  const { state } = useLocation();
  const { examination: exam } = state || {};
  const navigate = useNavigate();

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

  if (!exam) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <p className="text-red-500">No examination details provided.</p>
      </div>
    );
  }

  const handleClick = async (exam) => {
    try {
      const response = await apiCall.post(`/exams/start/${exam.id}/`);
      if (response.status === 201) {
        navigate(`/examinations/${exam.id}/questions`, {
          state: { exam },
        });
      }
    } catch (error) {
      console.error("Error starting exam:", error);
      if (error.status == 400) {
        showToast("You have already started this exam.", "error");
      }
    }
  };

  const instructions = [
    "Please answer all questions within the specified time",
  ];

  return (
    <div
      className="flex-1 overflow-y-scroll bg-gray-100"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
        <p className="text-gray-500 mt-1 mb-7">{exam.description}</p>

        <div className="bg-white rounded-md w-[760px] border p-4">
          {/* Render Instructions */}
          <div className="space-y-8">
            {instructions.map((text, index) => (
              <div className="flex" key={index}>
                {/* Blue divider container with fixed width */}
                <div className="flex-shrink-0 w-1">
                  <div className="w-full h-7 bg-[#1836B2]" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-8">
          <button
            type="button"
            className="px-6 py-3 bg-[#1836B2] text-white font-medium rounded-md hover:ring-2 transition-colors"
            onClick={() => {
              handleClick(exam);
            }}
          >
            Start Examination
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
  );
};

export default ExaminationInstructions;
