import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowDeleteStudentGroupDialog,
  setShowEditStudentGroupDialog,
} from "../../features/reducers/uiSlice";
import CustomButton from "../ui/Button";
import { DropdownMenuSeparator } from "../ui/Dropdown";
import Toast from "../modals/Toast";
import {
  DialogContent,
  DialogHeader,
  OutsideDismissDialog,
} from "../ui/Dialog";
import { CardDescription } from "../ui/Card";
import {
  deleteExamRoom,
  updateExamRoom,
} from "../../features/reducers/examRoomSlice";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";

export const DeleteStudentGroupDialog = ({
  title = "Student Group 2",
  id = 0,
}) => {
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

export const EditStudentGroup = ({ group }) => {
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
        }, 1000);
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
