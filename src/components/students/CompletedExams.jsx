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
} from "@mui/material";
import { useNavigate } from "react-router";
import { SERVER_URL } from "../../utils/constants";
import { illustration2 } from "../../utils/images";
import CustomButton from "../ui/Button";

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
    // const formattedCourseCode =
    //   exam.course.replace(/\s+/g, "-").toLowerCase() || "unknown-course";
    navigate(`/examinations/${exam.id}/result`, {
      state: { exam },
    });
  };

  const columns = [
    { id: "serial-number", label: "S/N", minWidth: 50 },
    { id: "exam-name", label: "Examination Name", minWidth: 200 },
    // { id: "lecturer", label: "Teacher", minWidth: 200 },
    { id: "course", label: "Course", minWidth: 200 },
    { id: "date", label: "Date and Time", minWidth: 200 },
    { id: "option", label: "Option", minWidth: 150 },
  ];

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user.studentId;

  const rows = completedExams.map((exam, index) => {
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
      date: <span>{timeString}</span>,
      option: (
        <CustomButton
          // as="link"
          // to={`/examinations/${exam.id}/result/${studentId}`}
          //   style={{ opacity: 1, cursor: "pointer" }}
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

  return completedExams.length === 0 ? (
    <div className="flex flex-col justify-center items-center gap-4 col-span-full ">
      <img className="w-32 h-32" src={illustration2} alt="Illustration" />
      <h1 className="text-[32px] font-medium leading-8">
        Nothing to see here… yet!
      </h1>
      <p className="text-[#667085] text-lg">
        Join a student group and start taking examinations.
      </p>
    </div>
  ) : (
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
  );
};

export default CompletedExams;
