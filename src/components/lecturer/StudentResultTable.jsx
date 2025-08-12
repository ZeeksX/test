import { useState } from "react";
import { Card } from "../ui/Card";
import CustomButton from "../ui/Button";
import { PaginationItem } from "@mui/material";
import Pagination from "../ui/Pagination";
import { Link, useNavigate } from "react-router";
import { mapQuestions } from "../modals/UIUtilities";

export default function StudentResultsTable({ studentResults, exam }) {
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

  const calculateExamTotalScore = (examObject) => {
    if (
      !examObject ||
      !examObject.questions ||
      !Array.isArray(examObject.questions)
    ) {
      return 0;
    }

    const totalScore = mapQuestions(examObject.questions).reduce(
      (total, question) => {
        // Ensure the question has a valid score property
        const questionScore =
          typeof question.score === "number" ? question.score : 0;
        return total + questionScore;
      },
      0
    );

    return totalScore;
  };

  const getScoreColorClasses = (score, totalScore) => {
    if (score === null || totalScore === 0) {
      return "text-gray-600 bg-gray-50";
    }

    const percentage = (score / totalScore) * 100;

    if (percentage < 50) {
      return "text-red-600 bg-red-50 border border-red-200";
    } else if (percentage >= 50 && percentage < 80) {
      return "text-amber-600 bg-amber-50 border border-amber-200";
    } else {
      return "text-green-600 bg-green-50 border border-green-200";
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(studentResults.length / studentsPerPage);
  const totalScore = calculateExamTotalScore(exam);

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
                <th className="px-4 py-3 text-left font-medium">
                  Score [{totalScore} marks]
                </th>
                <th className="px-4 py-3 text-left font-medium">Options</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => {
                const actualIndex = indexOfFirstStudent + index + 1;
                const scoreColorClasses = getScoreColorClasses(
                  student.score,
                  totalScore
                );

                return (
                  <tr
                    key={student.id}
                    className="border-b hover:bg-text-placeholder/25"
                  >
                    <td className="px-4 py-3 text-sm">{actualIndex}</td>
                    <td className="px-4 py-3 text-sm">
                      {student.student.last_name}, {student.student.other_names}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {student.student.matric_number}
                    </td>
                    {/* <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded`}>
                        {student.score === null
                          ? "Not Graded"
                          : parseFloat(student.score).toFixed(2)}
                      </span>
                    </td> */}
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-medium ${scoreColorClasses}`}
                      >
                        {student.score === null
                          ? "Not Graded"
                          : Number.parseFloat(student.score).toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {student.score === null ? (
                        <button
                          disabled
                          className="text-primary-main/50 underline-offset-4 hover:underline !p-0 !h-[25px] !justify-start"
                        >
                          Review
                        </button>
                      ) : (
                        <Link
                          // as="link"
                          to={`student/${student.student.student_id}`}
                          // variant="link"
                          className="text-primary-main underline-offset-4 hover:underline !p-0 !h-[25px] !justify-start"
                        >
                          Review
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
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
