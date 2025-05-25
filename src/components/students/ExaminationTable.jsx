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

const ExaminationTable = ({ examinations }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courses, setCourses] = useState([]);
  const [examRooms, setExamRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, examRoomsRes] = await Promise.all([
          fetch(`${SERVER_URL}/exams/courses/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }),
          fetch(`${SERVER_URL}/exams/exam-rooms/my_exam_rooms/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }),
        ]);

        if (!coursesRes.ok || !examRoomsRes.ok)
          throw new Error("Error fetching data");

        const [coursesData, examRoomsData] = await Promise.all([
          coursesRes.json(),
          examRoomsRes.json(),
        ]);

        setCourses(coursesData);
        setExamRooms(examRoomsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const courseMap = useMemo(() => {
    return courses.reduce((acc, course) => {
      acc[course.id] = course.course_title;
      return acc;
    }, {});
  }, [courses]);

  const lecturerMap = useMemo(() => {
    return examRooms.reduce((acc, room) => {
      const teacher = room.teacher;
      if (teacher) {
        const title = teacher.title || "";
        const otherNames = teacher.user?.other_names || "";
        const lastName = teacher.user?.last_name || "";
        const fullName = `${title} ${otherNames} ${lastName}`.trim();
        acc[teacher.id] = fullName;
      }
      return acc;
    }, {});
  }, [examRooms]);

  const upcomingExams = useMemo(() => {
    if (!examinations) return [];
    return examinations
      .filter((exam) => new Date(exam.due_time) > new Date())
      .filter((exam) => lecturerMap[exam.teacher] && lecturerMap[exam.teacher] !== "Unknown Lecturer")
      .sort((a, b) => new Date(a.due_time) - new Date(b.due_time));
  }, [examinations, lecturerMap]);

  const rows = useMemo(() => {
    return upcomingExams.map((exam, index) => {
      const examDateTime = new Date(exam.schedule_time);
      const dueDateTime = new Date(exam.due_time);
      const now = new Date();

      const isNow = now >= examDateTime && now <= dueDateTime;
      const isToday = examDateTime.toDateString() === now.toDateString();

      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      const isTomorrow = examDateTime.toDateString() === tomorrow.toDateString();

      let timeString;
      let textColor = "inherit";

      if (isNow) {
        timeString = "Now";
        textColor = "green";
      } else if (isToday) {
        timeString = `Today by ${examDateTime.toLocaleTimeString()}`;
        textColor = "green";
      } else if (isTomorrow) {
        timeString = `Tomorrow by ${examDateTime.toLocaleTimeString()}`;
        textColor = "blue";
      } else if (now < examDateTime) {
        timeString = `Scheduled on ${examDateTime.toLocaleString()}`;
      } else {
        timeString = `Active until ${dueDateTime.toLocaleString()}`;
      }

      return {
        "serial-number": index + 1,
        "exam-name": exam.title,
        course: courseMap[exam.course] || "Unknown Course",
        lecturer: lecturerMap[exam.teacher],
        date: <span style={{ color: textColor }}>{timeString}</span>,
        option: (
          <button
            style={{
              opacity: isNow ? 1 : 0.4,
              cursor: isNow ? "pointer" : "not-allowed",
            }}
            className="text-primary-main underline-offset-4 hover:underline"
            disabled={!isNow}
            onClick={() => navigate(`/examinations/${exam.id}/instructions`, { state: { examination: exam } })}
          >
            Take Exam
          </button>
        ),
      };
    });
  }, [upcomingExams, courseMap, lecturerMap, navigate]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return upcomingExams.length === 0 ? (
    <div className="flex flex-col justify-center items-center gap-4 col-span-full ">
      <img className="w-32 h-32" src={illustration2} alt="Illustration" />
      <h1 className="text-[32px] max-md:text-2xl font-medium leading-8">
        Nothing to see here… yet!
      </h1>
      <p className="text-[#667085] text-lg">
        Join a student group and start taking examinations.
      </p>
    </div>
  ) : (
    <Paper sx={{ width: "100%", overflow: "hidden", fontFamily: "Inter" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="upcoming exams table">
          <TableHead>
            <TableRow>
              {["S/N", "Examination Name", "Course", "Lecturer", "Scheduled Time", "Option"].map((label, i) => (
                <TableCell key={i} style={{ color: "#C2C2C2" }}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
              <TableRow hover key={i}>
                {["serial-number", "exam-name", "course", "lecturer", "date", "option"].map((id) => (
                  <TableCell key={id}>{row[id]}</TableCell>
                ))}
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

export default React.memo(ExaminationTable);
