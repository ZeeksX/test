import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import CustomButton from "../ui/Button";
import { FiMoreHorizontal, FiMoreVertical } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getExamById } from "../../features/reducers/examSlice";
import StudentResultsTable from "./StudentResultTable";

const ExamDetails = () => {
  const { examId } = useParams();
  const dispatch = useDispatch();
  const { exam, loading, error } = useSelector((state) => state.exams);
  const [activeStudentGroup, setActiveStudentGroup] = useState(exam?.studentGroups[0]?.id);

  useEffect(() => {
    dispatch(getExamById(Number(examId)));
  }, [dispatch, examId]);

  console.log("exam", exam);

  return (
    <div className="bg-[#F9F9F9]">
      <div className="flex flex-col md:flex-row justify-between p-4 items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">{exam.title}</h2>
        <div className="flex items-center gap-2">
          <CustomButton variant="ghost" className="gap-2">
            <FileExportIcon className="h-4 w-4" />
            Export Result
          </CustomButton>
          {/* <CustomButton className="bg-blue-600 hover:bg-blue-700">
            Publish
          </CustomButton> */}
          <CustomButton variant="outline" size="icon">
            <FiMoreHorizontal className="h-4 w-4" />
          </CustomButton>
        </div>
      </div>

      <div className="mb-6 bg-transparent">
        <div className="w-full overflow-x-auto pb-4 px-4 flex flex-wrap gap-4 items-center">
          {exam.studentGroups.map((group) => (
            <button
              key={group.id}
              className="rounded-md flex overflow-hidden"
              onClick={() => setActiveStudentGroup(group.id)}
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
              <div
                className={`p-2 flex items-center justify-center ${
                  activeStudentGroup === group.id
                    ? "text-primary-main bg-secondary-bg"
                    : " text-black bg-white"
                }`}
              >
                <FiMoreVertical />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4  pt-0">
        <StudentResultsTable />
      </div>
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
