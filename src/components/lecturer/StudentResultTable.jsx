import { useState } from "react";
import { Card } from "../ui/Card";
import CustomButton from "../ui/Button";
import { PaginationItem } from "@mui/material";
import Pagination from "../ui/Pagination";
import { useNavigate } from "react-router";

export default function StudentResultsTable({ studentResults }) {
  console.log({ studentResults });
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Calculate the students to display on the current page
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = studentResults.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Calculate total pages
  const totalPages = Math.ceil(studentResults.length / studentsPerPage);

  //   const handlePageChange = (page) => {
  //     setCurrentPage(page);
  //   };

  // const handleClick = (studentResults) => {
  //   navigate(`/examinations/${exam.id}/review`, {
  //     state: { exam, results, userAnswers },
  //   });
  // };

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">S/no</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">
                  Matric Number
                </th>
                <th className="px-4 py-3 text-left font-medium">Score</th>
                <th className="px-4 py-3 text-left font-medium">Options</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="px-4 py-3 text-sm">{student.id}</td>
                  <td className="px-4 py-3 text-sm">
                    {student.student.last_name}, {student.student.other_names}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {student.student.matric_number}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        student.score < 50
                          ? "bg-red-100 text-red-800"
                          : student.score >= 90
                          ? "bg-green-100 text-green-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {student.score === null ? "Not Graded" : student.score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CustomButton
                      as="link"
                      to={`student/${student.student.student_id}`}
                      variant="link"
                      className="text-blue-600 !p-0 h-auto !justify-start"
                    >
                      Review
                    </CustomButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="pb-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
