import { useState } from "react";
import { Card } from "../ui/Card";
import CustomButton from "../ui/Button";
import { PaginationItem } from "@mui/material";
import Pagination from "../ui/Pagination";

export default function StudentResultsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Calculate the students to display on the current page
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = studentData.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Calculate total pages
  const totalPages = Math.ceil(studentData.length / studentsPerPage);

  //   const handlePageChange = (page) => {
  //     setCurrentPage(page);
  //   };

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
                <th className="px-4 py-3 text-left font-medium">Score/100</th>
                <th className="px-4 py-3 text-left font-medium">Options</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="px-4 py-3 text-sm">{student.id}</td>
                  <td className="px-4 py-3 text-sm">{student.name}</td>
                  <td className="px-4 py-3 text-sm">{student.matricNumber}</td>
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
                      {student.score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CustomButton
                      as="link"
                      to={`student/${student.id}`}
                      variant="link"
                      className="text-blue-600 p-0 h-auto"
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

// Expanded sample data with 20 students
const studentData = [
  { id: 1, name: "Coleman Trevor", matricNumber: "20251019954", score: 92 },
  { id: 2, name: "Femi James", matricNumber: "20251019345", score: 88 },
  { id: 3, name: "Joy Agatha", matricNumber: "20251019429", score: 43 },
  { id: 4, name: "Natalie Spencer", matricNumber: "20251019113", score: 95 },
  { id: 5, name: "Obafemi Chinedu", matricNumber: "20251019028", score: 84 },
  { id: 6, name: "Jerome Opara", matricNumber: "20251019635", score: 99 },
  { id: 7, name: "Duru Christopher", matricNumber: "20251019625", score: 70 },
  { id: 8, name: "Anjolaoluwa Ajayi", matricNumber: "20251019615", score: 90 },
  { id: 9, name: "Obasi Michael", matricNumber: "20251019424", score: 63 },
  { id: 10, name: "Adebayo Tunde", matricNumber: "20251019111", score: 78 },
  { id: 11, name: "Chioma Eze", matricNumber: "20251019222", score: 82 },
  { id: 12, name: "David Okonkwo", matricNumber: "20251019333", score: 45 },
  { id: 13, name: "Elizabeth Bello", matricNumber: "20251019444", score: 91 },
  { id: 14, name: "Francis Adeyemi", matricNumber: "20251019555", score: 87 },
  { id: 15, name: "Grace Nwachukwu", matricNumber: "20251019666", score: 76 },
  { id: 16, name: "Henry Okafor", matricNumber: "20251019777", score: 68 },
  { id: 17, name: "Ifeoma Onyeka", matricNumber: "20251019888", score: 93 },
  { id: 18, name: "John Olawale", matricNumber: "20251019999", score: 59 },
  { id: 19, name: "Kemi Adeleke", matricNumber: "20251020000", score: 81 },
  { id: 20, name: "Lanre Ogunleye", matricNumber: "20251020111", score: 74 },
];
