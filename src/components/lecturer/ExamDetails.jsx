import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import CustomButton from "../ui/Button";
import { FiMoreHorizontal, FiMoreVertical } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExamDetails,
  fetchExamSubmissions,
} from "../../features/reducers/examSlice";
import StudentResultsTable from "./StudentResultTable";
import { fetchStudentGroups } from "../../features/reducers/examRoomSlice";
import { Loader } from "../ui/Loader";
import { emptyFolderImg } from "../../utils/images";

const ExamDetails = () => {
  const { examId } = useParams();
  const dispatch = useDispatch();
  const { allStudentGroups, loading: studentGroupLoading } = useSelector(
    (state) => state.examRooms
  );
  const { exam, examSubmissions, loading, error } = useSelector(
    (state) => state.exams
  );
  const [activeStudentGroup, setActiveStudentGroup] = useState("");
  const [studentGroupResults, setStudentGroupResults] = useState([]);

  useEffect(() => {
    dispatch(fetchExamDetails({ id: examId }));
    dispatch(fetchStudentGroups());
    dispatch(fetchExamSubmissions({ examid: examId }));
  }, [dispatch, examId]);

  if (loading || studentGroupLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-[#F9F9F9] h-full">
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
                    activeStudentGroup === studentGroupDetail.id
                      ? " text-white bg-primary-main"
                      : "text-black bg-white hover:bg-secondary-bg"
                  }`}
                >
                  {studentGroupDetail.name}
                </div>
                <div
                  className={`p-2 flex items-center justify-center ${
                    activeStudentGroup === studentGroupDetail.id
                      ? "text-primary-main bg-secondary-bg"
                      : " text-black bg-white"
                  }`}
                >
                  <FiMoreVertical />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 pt-0 h-[calc(100%_-_168px)]">
        {activeStudentGroup != "" ? (
          <>
            {studentGroupResults.length > 0 ? (
              <StudentResultsTable studentResults={studentGroupResults} />
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
        )}
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

// Expanded sample data with 20 students
// const studentData = [
//   { id: 1, name: "Coleman Trevor", matricNumber: "20251019954", score: 92 },
//   { id: 2, name: "Femi James", matricNumber: "20251019345", score: 88 },
//   { id: 3, name: "Joy Agatha", matricNumber: "20251019429", score: 43 },
//   { id: 4, name: "Natalie Spencer", matricNumber: "20251019113", score: 95 },
//   { id: 5, name: "Obafemi Chinedu", matricNumber: "20251019028", score: 84 },
//   { id: 6, name: "Jerome Opara", matricNumber: "20251019635", score: 99 },
//   { id: 7, name: "Duru Christopher", matricNumber: "20251019625", score: 70 },
//   { id: 8, name: "Anjolaoluwa Ajayi", matricNumber: "20251019615", score: 90 },
//   { id: 9, name: "Obasi Michael", matricNumber: "20251019424", score: 63 },
//   { id: 10, name: "Adebayo Tunde", matricNumber: "20251019111", score: 78 },
//   { id: 11, name: "Chioma Eze", matricNumber: "20251019222", score: 82 },
//   { id: 12, name: "David Okonkwo", matricNumber: "20251019333", score: 45 },
//   { id: 13, name: "Elizabeth Bello", matricNumber: "20251019444", score: 91 },
//   { id: 14, name: "Francis Adeyemi", matricNumber: "20251019555", score: 87 },
//   { id: 15, name: "Grace Nwachukwu", matricNumber: "20251019666", score: 76 },
//   { id: 16, name: "Henry Okafor", matricNumber: "20251019777", score: 68 },
//   { id: 17, name: "Ifeoma Onyeka", matricNumber: "20251019888", score: 93 },
//   { id: 18, name: "John Olawale", matricNumber: "20251019999", score: 59 },
//   { id: 19, name: "Kemi Adeleke", matricNumber: "20251020000", score: 81 },
//   { id: 20, name: "Lanre Ogunleye", matricNumber: "20251020111", score: 74 },
// ];

export default ExamDetails;
