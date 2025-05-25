import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiMoreVertical, FiPlus, FiUpload } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { TiDeleteOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowAddStudentToStudentGroupDialog,
  setShowDeleteStudentGroupDialog,
  setShowEditStudentGroupDialog,
  setShowShareStudentGroupLinkDialog,
} from "../../features/reducers/uiSlice";
import CustomButton from "../ui/Button";
import { emptyFolderImg } from "../../utils/images";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/Dropdown";
import Toast from "../modals/Toast";
import {
  DialogContent,
  DialogHeader,
  OutsideDismissDialog,
} from "../ui/Dialog";
import { CardDescription } from "../ui/Card";
import {
  deleteExamRoom,
  removeStudentFromExamRoom,
  updateExamRoom,
} from "../../features/reducers/examRoomSlice";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";

const EnrolledStudents = () => {
  const location = useLocation();
  const group = location.state?.group;
  const dispatch = useDispatch();

  const { removeStudentLoading: removing } = useSelector(
    (state) => state.examRooms
  );

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  if (!group) {
    return <div>No group data available</div>;
  }

  const columns = [
    { id: "serial-number", label: "S/N", minWidth: 50 },
    { id: "name", label: "Name", minWidth: 200 },
    { id: "matric-number", label: "Matric Number", minWidth: 200 },
    { id: "options", label: "Options", minWidth: 200 },
  ];

  const handleRemoveStudent = (studentId) => {
    setRemoveId(studentId);
    dispatch(removeStudentFromExamRoom({ groupId: group.id, studentId }))
      .unwrap()
      .then(() => {
        showToast("Student Group deleted successfully!", "success");
        // setTimeout(() => {
        //   dispatch(setShowDeleteStudentGroupDialog(false));
        //   navigate("/student-groups");
        // }, 2000);
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to delete student group. Please try again!", "error");
      });
    setRemoveId(null);
  };

  const rows = group.students?.map((student, index) => {
    return {
      "serial-number": index + 1,
      name: student.last_name + ", " + student.other_names,
      "matric-number": student.matric_number ? student.matric_number : "N/A",
      options:
        removing && removeId === student.student_id ? (
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <div className="p-4 bg-[#F9F9F9] min-h-[calc(100dvh_-_64px)]">
      <div className="flex flex-row max-md:flex-col justify-between items-start">
        <div className="flex flex-col gap-4">
          <h1 className="text-[32px] font-inter font-medium leading-8">
            Student Groups
          </h1>
          <p className="text-[#667085] max-w-xl font-inter text-sm">
            An examination room helps you organize different groups of students
            taking the subject(s) you teach
          </p>
        </div>
        <div className="flex flex-row gap-4 max-md:mr-2">
          <CustomButton
            variant="clear"
            onClick={() =>
              dispatch(
                setShowShareStudentGroupLinkDialog({
                  willShow: true,
                  link: "newLink",
                  code: "newCode",
                })
              )
            }
            className="bg-[#FFFFFF] gap-2 border shadow-[0_1px_2px_rgba(16,24,40,0.05)] text-[black] h-[44px] flex items-center justify-center font-inter font-medium text-sm rounded-lg px-4"
          >
            Share
            <FiUpload />
          </CustomButton>
          <button
            onClick={() =>
              dispatch(
                setShowAddStudentToStudentGroupDialog({
                  isOpen: true,
                  groupId: group.id,
                })
              )
            }
            className="bg-[#1835B3] gap-2 text-[white] h-[44px] flex items-center justify-center font-inter font-medium text-sm rounded-lg px-4"
          >
            Add New Student
            <FaPlus />
          </button>
        </div>
      </div>
      <hr className="text-[#0d0d0e] border-1 mt-4" />
      <div className="flex flex-row justify-between items-start my-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-inter font-normal leading-8">
            {group.name}
          </h1>
          <p className="text-base font-inter opacity-80 font-normal leading-8">
            {group.description}
          </p>
        </div>
        <div className="flex items-end justify-end gap-4 max-md:mr-2">
          {/* <button className="bg-[#EAECF0] text-[black] h-[44px] font-inter text-base rounded-lg w-[133px]">
            View Results
          </button> */}
          <DropdownMenu>
            <button
              onClick={toggleDropdown}
              className="rounded-lg hover:bg-[#EAECF0] bg-transparent flex items-center justify-center !p-3"
            >
              <FiMoreVertical className="text-[#667085]" />
            </button>
            <DropdownMenuContent
              className="!w-[200px]"
              open={isOpen}
              setOpen={setIsOpen}
              align="start"
            >
              <DropdownMenuItem>
                <button
                  className="w-full h-full px-4 py-2 flex items-center justify-start"
                  onClick={() => {
                    dispatch(setShowEditStudentGroupDialog(true));
                  }}
                >
                  Update Student Group
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  className="w-full h-full px-4 py-2 flex items-center justify-start"
                  onClick={() => {
                    dispatch(setShowDeleteStudentGroupDialog(true));
                  }}
                >
                  Delete Student Group
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/*Enrolled Students */}
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

          <Toast
            open={toast.open}
            message={toast.message}
            severity={toast.severity}
            onClose={closeToast}
          />
        </div>
      )}

      <DeleteStudentGroupDialog title={group.name} id={group.id} />
      <EditStudentGroup group={group} />
    </div>
  );
};

export default EnrolledStudents;

const DeleteStudentGroupDialog = ({ title = "Student Group 2", id = 0 }) => {
  const isOpen = useSelector((state) => state.ui.showDeleteStudentGroupDialog);
  const { deleteStudentGroupLoading: isLoading } = useSelector(
    (state) => state.examRooms
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleDeleteStudentGroup = (groupId) => {
    dispatch(deleteExamRoom({ id: groupId }))
      .unwrap()
      .then(() => {
        showToast("Student Group deleted successfully!", "success");
        setTimeout(() => {
          dispatch(setShowDeleteStudentGroupDialog(false));
          navigate("/student-groups");
        }, 2000);
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
    <OutsideDismissDialog
      open={isOpen}
      // onOpenChange={setShowDeleteStudentGroupDialog}
      maxWidth="400px"
    >
      <DialogHeader>Delete StudentGroup</DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent className="p-6 pt-2">
        <CardDescription>
          Are you sure you want to delete the student group{" "}
          <strong>{title}</strong>. This action cannot be undone
        </CardDescription>
        <div className="w-1/2 flex gap-5 ml-auto">
          <CustomButton
            variant="clear"
            className="gap-2 mt-4 flex-1"
            disabled={isLoading}
            onClick={() => dispatch(setShowDeleteStudentGroupDialog(false))}
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={() => handleDeleteStudentGroup(id)}
            loading={isLoading}
            variant="danger"
            className="gap-2 mt-4 flex-1"
          >
            Delete
          </CustomButton>
        </div>
      </DialogContent>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </OutsideDismissDialog>
  );
};

const EditStudentGroup = ({ group }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isOpen = useSelector((state) => state.ui.showEditStudentGroupDialog);
  const { updateStudentGroupLoading: loading, updateStudentGroupError } =
    useSelector((state) => state.examRooms);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    course: null,
    teacher: null,
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    setFormData({
      name: group.name,
      description: group.description,
      course: group.course,
      teacher: group.teacher,
    });
  }, [group]);

  const handleUpdateStudentGroup = async (e) => {
    e.preventDefault();

    dispatch(
      updateExamRoom({
        id: group.id,
        examRoomData: formData,
      })
    )
      .unwrap()
      .then(() => {
        showToast("Student Group updated successfully!", "success");
        setTimeout(() => {
          dispatch(setShowEditStudentGroupDialog(false));
          navigate("/student-groups");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to update student group. Please try again!", "error");
      });
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <OutsideDismissDialog
      open={isOpen}
      onOpenChange={setShowEditStudentGroupDialog}
      maxWidth="400px"
    >
      <DialogHeader>
        <h2 className="!font-semibold text-xl">Update Student Group</h2>
        {/* <p className="opacity-80">
          Set up a student group to organize and manage your tests easily.
        </p> */}
      </DialogHeader>
      <DropdownMenuSeparator />
      <form action="" onSubmit={handleUpdateStudentGroup}>
        <DialogContent className="p-6 py-2">
          <Label htmlFor="examRoomName">Student Group Name</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            placeholder="E.g: CS Group A"
            className="mb-4"
            id="examRoomName"
          />
          <Label htmlFor="session">Description</Label>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
            placeholder="Tell us what the group is about"
            id="session"
          />
        </DialogContent>
        <DropdownMenuSeparator />
        <DialogContent className="p-6 pt-4 flex items-center justify-end gap-4">
          <CustomButton
            type="submit"
            loading={loading}
            className="gap-2 w-full !h-10"
          >
            Post Changes
          </CustomButton>
        </DialogContent>
      </form>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </OutsideDismissDialog>
  );
};
