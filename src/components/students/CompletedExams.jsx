import React, { useState, useEffect, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CardHeader,
} from "@mui/material";
import { useNavigate } from "react-router";
import { SERVER_URL } from "../../utils/constants";
import { illustration2 } from "../../utils/images";
import CustomButton from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import {
  FiBookOpen,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";
import { formatDate } from "../modals/UIUtilities";

const CompletedExams = ({ examinations }) => {
  const [examRooms, setExamRooms] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamRooms = async () => {
      try {
        const response = await fetch(
          `${SERVER_URL}/exams/exam-rooms/my_exam_rooms/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setExamRooms(data);
      } catch (error) {
        console.error("Error fetching exam rooms:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/exams/courses/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchExamRooms();
    fetchCourses();
  }, []);

  // Create a mapping for courses (course ID → course name)
  const courseMap = useMemo(() => {
    return courses.reduce((acc, course) => {
      acc[course.id] = course.course_title; // Ensure we use the correct property for course name
      return acc;
    }, {});
  }, [courses]);

  // Get lecturer name from exam rooms data
  const getLecturerName = (teacherId) => {
    const teacherRoom = examRooms.find(
      (room) => room.teacher?.id === teacherId
    );

    if (!teacherRoom || !teacherRoom.teacher || !teacherRoom.teacher.user) {
      return "Unknown Lecturer";
    }

    const { title, user } = teacherRoom.teacher;
    const otherNames = user.other_names || ""; // Prevents reading `null`
    const lastName = user.last_name || ""; // Prevents reading `null`

    return `${title} ${otherNames} ${lastName}`.trim();
  };

  const completedExams = useMemo(() => {
    if (!examinations) return [];
    return examinations
      .filter(
        (exam) =>
          new Date(exam.due_time) <= new Date() &&
          getLecturerName(exam.teacher) !== "Unknown Lecturer"
      )
      .sort((a, b) => new Date(a.due_time) - new Date(b.due_time));
  }, [examinations, examRooms]);

  const handleClick = (exam) => {
    navigate(`/examinations/${exam.id}/result`, {
      state: { exam },
    });
  };

  const columns = [
    { id: "serial-number", label: "S/N", minWidth: 50 },
    { id: "exam-name", label: "Examination Name", minWidth: 200 },
    { id: "course", label: "Course", minWidth: 200 },
    { id: "date", label: "Date and Time", minWidth: 200 },
    { id: "option", label: "Option", minWidth: 150 },
  ];

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user.studentId;

  const rows = examinations.map((exam, index) => {
    const examDateTime = new Date(exam.due_time);
    const now = new Date();
    const isToday = examDateTime.toDateString() === now.toDateString();

    let timeString = isToday
      ? `Today ${examDateTime.toLocaleTimeString()}`
      : examDateTime.toLocaleString();

    return {
      "serial-number": index + 1,
      "exam-name": exam.title,
      // lecturer: getLecturerName(exam.teacher),
      course: courseMap[exam.course] || "Unknown Course", // Use the courseMap
      date: <span>{formatDate(new Date(exam.due_time))}</span>,
      option: (
        <CustomButton
          variant="link"
          onClick={() => handleClick(exam)}
          className="!p-0 !justify-start"
        >
          View Result
        </CustomButton>
      ),
    };
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const totalPages = Math.ceil(completedExams.length / rowsPerPage);
  const paginatedExams = completedExams
    .sort((a, b) => new Date(b.due_time) - new Date(a.due_time))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (examinations.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 col-span-full ">
        <img className="w-32 h-32" src={illustration2} alt="Illustration" />
        <h1 className="text-[32px] font-medium leading-8">
          Nothing to see here… yet!
        </h1>
        <p className="text-[#667085] text-lg">
          Join a student group and start taking examinations.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="hidden md:block">
        <Paper sx={{ width: "100%", overflow: "hidden", fontFamily: "Inter" }}>
          <TableContainer>
            <Table stickyHeader aria-label="completed exams table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth, color: "#C2C2C2" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row["serial-number"]}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} className="!py-2.5">
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {paginatedExams.map((exam, index) => (
          <Card key={exam.id} className="w-full">
            <div className="p-6 pb-0 flex items-center justify-between">
              <h1 className="text-lg">{exam.title}</h1>
            </div>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiBookOpen className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Course:</span>
                <span>{courseMap[exam.course] || "Unknown Course"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiUser className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Lecturer:</span>
                <span>{getLecturerName(exam.teacher)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiCalendar className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Date:</span>
                <span>{formatDate(new Date(exam.due_time))}</span>
              </div>

              <CustomButton
                onClick={() => handleClick(exam)}
                className="w-full !mt-4"
                // variant="default"
              >
                View Result
              </CustomButton>
            </CardContent>
          </Card>
        ))}

        {/* Empty state for mobile when no exams on current page */}
        {paginatedExams.length === 0 && completedExams.length > 0 && (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FiBookOpen className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">No exams on this page</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination Controls */}
      {/* {totalPages > 1 && ( */}
      <div className="flex md:hidden flex-col gap-4 px-4 py-3 bg-white border-t">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            Showing {page * rowsPerPage + 1} to{" "}
            {Math.min((page + 1) * rowsPerPage, completedExams.length)} of{" "}
            {completedExams.length} results
          </span>
        </div>

        <div className="flex items-center gap-2 w-full">
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 text-sm border rounded"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
          </select>

          <CustomButton
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={page === 0}
          >
            <FiChevronLeft className="w-4 h-4" />
          </CustomButton>

          <span className="px-3 py-1 text-sm">
            {page + 1} of {totalPages}
          </span>

          <CustomButton
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
          >
            <FiChevronRight className="w-4 h-4" />
          </CustomButton>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default CompletedExams;
