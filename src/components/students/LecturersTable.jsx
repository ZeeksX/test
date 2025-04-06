import React, { useState, useEffect } from "react";
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
import CustomButton from "../ui/Button";
import { useSelector } from "react-redux";
import { useAuth } from "../Auth";
import { illustration3 } from "../../utils/images";

const LecturersTable = ({ lecturers }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Get student's enrolled groups from Redux store
  const { studentStudentGroups: studentEnrolledGroups } = useSelector(
    (state) => state.examRooms
  );

  if (!lecturers) {
    return <div>No lecturers data available</div>;
  }

  const handleViewClick = (lecturer) => {
    navigate(`/lecturers/${lecturer.id}/groups`, {
      state: { lecturer },
    });
  };

  const columns = [
    { id: "serial-number", label: "S/N", minWidth: 50 },
    { id: "lecturer-name", label: "Lecturer Name", minWidth: 250 },
    { id: "groups-joined", label: "Groups Joined", minWidth: 100 },
    { id: "option", label: "Option", minWidth: 150 },
  ];
  const filteredLecturers = lecturers.filter((lecturer) =>
    studentEnrolledGroups.some((group) => group.teacher.id === lecturer.id)
  );

  const rows = filteredLecturers
    .slice()
    .sort((a, b) => {
      const sortOrder = { "Prof.": 1, "Dr.": 2, "Mr.": 3, "Mrs.": 3 };
      const aPriority = sortOrder[a.title] || 4;
      const bPriority = sortOrder[b.title] || 4;

      if (aPriority !== bPriority) return aPriority - bPriority;

      return (a.last_name || "").localeCompare(b.last_name || "");
    })
    .map((lecturer, index) => ({
      "serial-number": index + 1,
      "lecturer-name": `${lecturer.title} ${lecturer.last_name} ${lecturer.other_names}`,
      "groups-joined": studentEnrolledGroups.filter(
        (group) => group.teacher.id === lecturer.id
      ).length,
      option: (
        <CustomButton
          onClick={() => handleViewClick(lecturer)}
          className="bg-[#1835B3] cursor-pointer w-[120px] h-11 gap-2 text-white flex items-center justify-center font-inter font-semibold text-base rounded-md px-4 hover:ring-2"
        >
          View
        </CustomButton>
      ),
    }));

  if (rows.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 col-span-full">
        <img className="w-32 h-32" src={illustration3} alt="Illustration" />
        <h1 className="text-[32px] font-medium leading-8">
          Oops, this page looks a little lonely. Let’s fill it up
        </h1>
        <p className="text-[#667085] text-lg">
          Join a student group and get necessary information here
        </p>
      </div>
    );
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <div className="w-full">
        <Paper sx={{ width: "100%", overflow: "hidden", fontFamily: "Inter" }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
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
                          <TableCell key={column.id} align={column.align}>
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
    </>
  );
};

export default LecturersTable;