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
import { Card, CardContent } from "../ui/Card";
import {
  FiBookOpen,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";

const ExaminationTable = ({ examinations }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
      .filter(
        (exam) =>
          lecturerMap[exam.teacher] &&
          lecturerMap[exam.teacher] !== "Unknown Lecturer"
      )
      .sort((a, b) => new Date(a.due_time) - new Date(b.due_time));
  }, [examinations, lecturerMap]);

  const rows = useMemo(() => {
    return examinations.map((exam, index) => {
      const examDateTime = new Date(exam.schedule_time);
      const dueDateTime = new Date(exam.due_time);
      const now = new Date();

      const isNow = now >= examDateTime && now <= dueDateTime;
      const isToday = examDateTime.toDateString() === now.toDateString();

      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      const isTomorrow =
        examDateTime.toDateString() === tomorrow.toDateString();

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
        lecturer: lecturerMap[exam.teacher] || "Unknown Lecturer",
        date: <span style={{ color: textColor }}>{timeString}</span>,
        option: (
          <button
            style={{
              opacity: isNow ? 1 : 0.4,
              cursor: isNow ? "pointer" : "not-allowed",
            }}
            className="text-sm font-medium rounded-md flex items-center justify-center relative bg-primary-main text-white hover:bg-primary-main/80 px-4 py-2 min-h-9"
            disabled={!isNow}
            onClick={() =>
              navigate(`/examinations/${exam.id}/instructions`, {
                state: { examination: exam },
              })
            }
          >
            Take Exam
          </button>
        ),
      };
    });
  }, [examinations, courseMap, lecturerMap, navigate]);

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

  const totalPages = Math.ceil(upcomingExams.length / rowsPerPage);
  const paginatedExams = upcomingExams
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
                  {[
                    "S/N",
                    "Examination Name",
                    "Course",
                    "Lecturer",
                    "Scheduled Time",
                    "Option",
                  ].map((label, i) => (
                    <TableCell key={i} style={{ color: "#C2C2C2" }}>
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => (
                    <TableRow hover key={i}>
                      {[
                        "serial-number",
                        "exam-name",
                        "course",
                        "lecturer",
                        "date",
                        "option",
                      ].map((id) => (
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
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {paginatedExams.map((exam, index) => {
          const examDateTime = new Date(exam.schedule_time);
          const dueDateTime = new Date(exam.due_time);
          const now = new Date();

          const isNow = now >= examDateTime && now <= dueDateTime;
          const isToday = examDateTime.toDateString() === now.toDateString();

          const tomorrow = new Date();
          tomorrow.setDate(now.getDate() + 1);
          const isTomorrow =
            examDateTime.toDateString() === tomorrow.toDateString();

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

          return (
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
                  <FiCalendar className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">Date:</span>
                  <span>{timeString}</span>
                </div>

                <button
                  style={{
                    opacity: isNow ? 1 : 0.4,
                    cursor: isNow ? "pointer" : "not-allowed",
                  }}
                  className="text-primary-main !mt-6 underline-offset-4 hover:underline"
                  disabled={!isNow}
                  onClick={() =>
                    navigate(`/examinations/${exam.id}/instructions`, {
                      state: { examination: exam },
                    })
                  }
                >
                  Take Exam
                </button>
              </CardContent>
            </Card>
          );
        })}

        {paginatedExams.length === 0 && upcomingExams.length > 0 && (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FiBookOpen className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">No exams on this page</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex md:hidden flex-col gap-4 px-4 py-3 bg-white border-t">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            Showing {page * rowsPerPage + 1} to{" "}
            {Math.min((page + 1) * rowsPerPage, upcomingExams.length)} of{" "}
            {upcomingExams.length} results
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
    </div>
  );
};

export default React.memo(ExaminationTable);
