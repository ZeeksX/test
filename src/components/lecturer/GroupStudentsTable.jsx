import { useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import Toast from "../modals/Toast";
import { useNavigate } from "react-router-dom";
import { TiDeleteOutline } from "react-icons/ti";
import { removeStudentFromExamRoom } from "../../features/reducers/examRoomSlice";
import { emptyFolderImg } from "../../utils/images";
import CustomButton from "../ui/Button";
import { setShowAddStudentToStudentGroupDialog } from "../../features/reducers/uiSlice";
import { FiPlus } from "react-icons/fi";

const GroupStudentsTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { studentGroup: group, removeStudentLoading: removing } = useSelector(
    (state) => state.examRooms
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [removeId, setRemoveId] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const columns = [
    { id: "serial-number", label: "S/N", minWidth: 50 },
    { id: "name", label: "Name", minWidth: 200 },
    { id: "matric-number", label: "Matric Number", minWidth: 200 },
    { id: "options", label: "Options", minWidth: 200 },
  ];

  const rows = group.students?.map((student, index) => {
    return {
      "serial-number": index + 1,
      name: student.last_name + ", " + student.other_names,
      "matric-number": student.matric_number ? student.matric_number : "N/A",
      options:
        removing == true && removeId == student.student_id ? (
          <span className="text-[#EA4335] flex flex-row gap-2 cursor-pointer">
            Removing
          </span>
        ) : (
          <span
            className="text-[#EA4335] flex flex-row gap-2 cursor-pointer"
            onClick={() => handleRemoveStudent(student.student_id)}
          >
            Remove
            <TiDeleteOutline className="text-[#EA4335] text-2xl" />
          </span>
        ),
    };
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRemoveStudent = (studentId) => {
    setRemoveId(studentId);
    dispatch(removeStudentFromExamRoom({ groupId: group.id, studentId }))
      .unwrap()
      .then(() => {
        showToast("Student has been removed successfully!", "success");
        setRemoveId(null);
        setTimeout(() => {
          navigate("/student-groups");
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to delete student group. Please try again!", "error");
      });
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <>
      {group.students?.length > 0 ? (
        <Paper sx={{ width: "100%", overflow: "hidden", fontFamily: "Inter" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table aria-label="table">
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
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
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
                    );
                  })}
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
      ) : (
        <div className="w-full h-full gap-1 flex flex-col items-center justify-center mt-20">
          <img src={emptyFolderImg} alt="" />
          <h3 className="font-medium text-2xl">
            There are no students in this student group
          </h3>
          <h5 className="text-text-ghost font-normal text-sm">
            Ensure to add students in order to grant them access to all your
            exams
          </h5>

          <CustomButton
            onClick={() =>
              dispatch(setShowAddStudentToStudentGroupDialog(true))
            }
            className="gap-2 mt-2"
          >
            Add New Student <FiPlus size={20} />
          </CustomButton>
        </div>
      )}

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </>
  );
};

export default GroupStudentsTable;
