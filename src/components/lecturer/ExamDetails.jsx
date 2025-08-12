import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import CustomButton from "../ui/Button";
import { FiCalendar, FiClock, FiFileText, FiTarget } from "react-icons/fi";
import { LuTimer } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExamDetails,
  fetchExamSubmissions,
} from "../../features/reducers/examSlice";
import StudentResultsTable from "./StudentResultTable";
import { fetchStudentGroups } from "../../features/reducers/examRoomSlice";
import { Loader } from "../ui/Loader";
import { emptyFolderImg } from "../../utils/images";
import Toast from "../modals/Toast";
import { areAllSubmissionsScored } from "../../utils/minorUtilities";
import { Badge } from "../ui/Badge";
import { formatScheduleTime, mapQuestions } from "../modals/UIUtilities";
import { Card } from "../ui/Card";
import { IoChevronBack } from "react-icons/io5";
import apiCall from "../../utils/apiCall";

const ExamDetails = () => {
  const { examId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [publishing, setPublishing] = useState(false);
  const { exam, examSubmissions, loading, error } = useSelector(
    (state) => state.exams
  );

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // console.log({ exam, examSubmissions });
  const [activeStudentGroup, setActiveStudentGroup] = useState("");
  const [studentGroupResults, setStudentGroupResults] = useState([]);

  useEffect(() => {
    dispatch(fetchExamDetails({ id: examId }));
    dispatch(fetchExamSubmissions({ examid: examId }));
  }, [dispatch, examId]);

  const questions = mapQuestions(exam.questions);

  const totalScore = questions.reduce(
    (sum, question) => sum + question.score,
    0
  );

  const startDateTime = formatScheduleTime(exam.schedule_time);
  const endDateTime = formatScheduleTime(exam.due_time);

  function isPastDue(dueTime) {
    const now = new Date();
    const due = new Date(dueTime);

    return now > due;
  }

  const handlePublish = async (submissions) => {
    if (!isPastDue(exam.due_time)) {
      showToast(
        `You can only publish the results of an exam after the due time`,
        "error"
      );
      return;
    }

    // if (areAllSubmissionsScored(submissions)) {
      setPublishing(true);

      try {
        const response = await apiCall.patch(
          `/exams/results/approve/${examId}/`
        );

        if (response.status === 201 || response.status === 200) {
          showToast("Exam approved successfully", "success");
        }
      } catch (error) {
        showToast("Failed to publish exam. Please try again.", "error");
        console.error("Error creating student group:", error);
      } finally {
        setPublishing(false);
      }
    // } else {
    //   showToast(
    //     "You will be able to publish the results once they all have been graded",
    //     "error"
    //   );
    // }
  };

  if (loading) {
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
    const headers = ["Name", "Matric Number", `${exam.exam_type}_Score`];

    // Create CSV rows
    const csvData = examSubmissions.results.map((student) => [
      `${student.student.last_name}, ${student.student.other_names}`,
      student.student.matric_number,
      student.score === null ? "Not Graded" : student.score,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${exam.title}_student_results_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#F9F9F9] h-max p-4">
      <Card className="w-full bg-white rounded-xl">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full w-8 hover:bg-[#EAECF0] bg-transparent flex items-center justify-center hover:text-primary-main"
              >
                <IoChevronBack size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <CustomButton
                className="gap-2 !bg-secondary-bg !text-black"
                onClick={exportToCSV}
              >
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
            </div>
          </div>
        </div>

        <div className="space-y-6 p-4 border-t">
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
      </Card>

      <div className="mb-6 bg-transparent">
        <div className="w-full overflow-x-auto pt-4 flex flex-wrap gap-4 items-center">
          {examSubmissions?.exam_rooms?.map((group) => (
            <button
              key={group.id}
              className="rounded-md flex overflow-hidden"
              onClick={() => {
                setActiveStudentGroup(group.id);
                setStudentGroupResults(
                  examSubmissions.results.filter(
                    (result) => result.student.exam_room.id === group.id
                  )
                );
              }}
            >
              <div
                className={`p-2 px-3 text-sm ${
                  activeStudentGroup === group.id
                    ? " text-white bg-primary-main"
                    : "text-black bg-white hover:bg-secondary-bg"
                }`}
              >
                {group.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-[calc(100%_-_168px)]">
        {activeStudentGroup != "" ? (
          <>
            {studentGroupResults.length > 0 ? (
              <StudentResultsTable
                studentResults={studentGroupResults}
                exam={exam}
              />
            ) : (
              <div className="w-full h-full gap-1 flex flex-col items-center justify-center">
                <img src={emptyFolderImg} alt="" />
                <h3 className="font-medium text-2xl">
                  There are no submissions for this student group
                </h3>
                <h5 className="text-text-ghost font-normal text-sm">
                  You will see the submissions once the students turns it in
                </h5>
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
        )}
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
