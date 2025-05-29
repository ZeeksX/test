import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import CustomButton from "../ui/Button";
import { FiMoreHorizontal, FiMoreVertical } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExamDetails,
  fetchExamSubmissions,
  newFetchExamSubmissions,
} from "../../features/reducers/examSlice";
import StudentResultsTable from "./StudentResultTable";
import { fetchStudentGroups } from "../../features/reducers/examRoomSlice";
import { Loader } from "../ui/Loader";
import { emptyFolderImg } from "../../utils/images";
import Toast from "../modals/Toast";
import { areAllSubmissionsScored } from "../../utils/minorUtilities";
import apiCall from "../../utils/apiCall";
import { PETTY_SERVER_URL } from "../../utils/constants";
import axios from "axios";

const ExamDetails = () => {
  const { examId } = useParams();
  const dispatch = useDispatch();
  const [publishing, setPublishing] = useState(false);
  const { allStudentGroups, loading: studentGroupLoading } = useSelector(
    (state) => state.examRooms
  );
  const { exam, examSubmissions, loading, error } = useSelector(
    (state) => state.exams
  );

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  console.log({ exam, examSubmissions, allStudentGroups });
  const [activeStudentGroup, setActiveStudentGroup] = useState(true);
  const [studentGroupResults, setStudentGroupResults] = useState([]);

  useEffect(() => {
    dispatch(fetchExamDetails({ id: examId }));
    dispatch(fetchStudentGroups());
    dispatch(fetchExamSubmissions({ examid: examId }));
  }, [dispatch, examId]);

  const handlePublish = async (submissions) => {
    if (areAllSubmissionsScored(submissions)) {
      setPublishing(true);

      try {
        const response = await axios.put(
          `${PETTY_SERVER_URL}/api/exams/${examId}/approve-all`
        );
        // const response = await apiCall.post(
        //   `/exams/results/approve/${examId}/`
        // );

        if (response.status === 201 || response.status === 200) {
          showToast("Exam approved successfully", "success");
        }
      } catch (error) {
        showToast("Failed to publish exam. Please try again.", "error");
        console.error("Error creating student group:", error);
      } finally {
        setPublishing(false);
      }
    } else {
      showToast(
        "You will be able to publish the results once they all have been graded",
        "error"
      );
    }
  };

  if (loading || studentGroupLoading) {
    return <Loader />;
  }

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  const exportToCSV = () => {
    // Create CSV headers
    const headers = ["Name", "Matric Number", "Score"];

    // Create CSV rows
    const csvData = examSubmissions.map((student) => [
      `${student.student.last_name}, ${student.student.other_names}`,
      student.student.matric_number,
      student.score === null ? "Not Graded" : student.score,
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `student_results_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#F9F9F9] h-full">
      <div className="flex flex-col md:flex-row justify-between p-4 items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">{exam.title}</h2>
        <div className="flex items-center gap-2">
          <CustomButton variant="ghost" className="gap-2" onClick={exportToCSV}>
            <FileExportIcon className="h-4 w-4" />
            Export Result
          </CustomButton>
          <CustomButton
            onClick={() => handlePublish(examSubmissions)}
            loading={publishing}
            className="w-[100px] bg-blue-600 hover:bg-blue-700"
          >
            Publish
          </CustomButton>
          {/* <CustomButton variant="outline" size="icon">
            <FiMoreHorizontal className="h-4 w-4" />
          </CustomButton> */}
        </div>
      </div>

      <div className="mb-6 bg-transparent">
        <div className="w-full overflow-x-auto pb-4 px-4 flex flex-wrap gap-4 items-center">
          {exam.exam_rooms.map((id) => {
            const studentGroupDetail = allStudentGroups.find(
              (g) => g.id === id
            );

            if (!studentGroupDetail) return null;

            return (
              <button
                key={studentGroupDetail.id}
                className="rounded-md flex overflow-hidden"
                onClick={() => {
                  setActiveStudentGroup(studentGroupDetail.id);
                  setStudentGroupResults(examSubmissions);
                }}
              >
                <div
                  className={`p-2 px-3 text-sm ${
                    activeStudentGroup
                      ? //  === studentGroupDetail.id
                        " text-white bg-primary-main"
                      : "text-black bg-white hover:bg-secondary-bg"
                  }`}
                >
                  {studentGroupDetail.name}
                </div>
                {/* <div
                  className={`p-2 flex items-center justify-center ${
                    activeStudentGroup === studentGroupDetail.id
                      ? "text-primary-main bg-secondary-bg"
                      : " text-black bg-white"
                  }`}
                >
                  <FiMoreVertical />
                </div> */}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 pt-0 h-[calc(100%_-_168px)]">
        {examSubmissions.length > 0 ? (
          <StudentResultsTable studentResults={examSubmissions} />
        ) : (
          <div className="w-full h-full gap-1 flex flex-col items-center justify-center">
            <img src={emptyFolderImg} alt="" />
            <h3 className="font-medium text-2xl">
              There are no submissions for this exam
            </h3>
            <h5 className="text-text-ghost font-normal text-sm">
              You will see the submissions once the students turns it in
            </h5>
          </div>
        )}
        {/* {activeStudentGroup != "" ? (
          <>
            {studentGroupResults.length > 0 ? (
            ) : (
              <div className="">
                There are no results for this student group
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full gap-1 flex flex-col items-center justify-center">
            <img src={emptyFolderImg} alt="" />
            <h3 className="font-medium text-2xl">
              You have not selected any student groups
            </h3>
            <h5 className="text-text-ghost font-normal text-sm">
              Select a student group to view the results for that student group
            </h5>
          </div>
        )} */}
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

function FileExportIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M11 13v-1h2v1" />
      <path d="M11 16v1h2v-1" />
      <path d="M9 14h6" />
    </svg>
  );
}

export default ExamDetails;
