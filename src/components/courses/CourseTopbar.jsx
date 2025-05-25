import { CustomButton } from "../ui/Button";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { LuFileDown } from "react-icons/lu";
import {
  DialogContent,
  DialogHeader,
  DialogTrigger,
  OutsideDismissDialog,
} from "../ui/Dialog";
import {
  setShowCreateNewExamination,
  setShowStudentGroupWarnDialog,
  setShowEditCourseDialog,
  setShowDeleteCourseDialog,
} from "../../features/reducers/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/Dropdown";
import { useEffect, useState } from "react";
import Toast from "../modals/Toast";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { useNavigate } from "react-router";
import {
  deleteCourse,
  updateCourse,
} from "../../features/reducers/courseSlice";
import { CardDescription } from "../ui/Card";

const CourseTopbar = () => {
  const { course } = useSelector((state) => state.courses);
  const dispatch = useDispatch();
  const { hasStudentGroups } = useSelector((state) => state.examRooms);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full px-5 py-2.5 flex max-md:flex-col items-center max-md:items-end justify-between border-b">
      <h2 className="text-xl font-medium">
        {course.course_title} ({course.course_code})
      </h2>
      <div className="flex items-center justify-center gap-4">
        {/* <CustomButton variant={"ghost"} className="text-xs gap-2">
          Export File <LuFileDown size={20} />
        </CustomButton> */}
        <DialogTrigger
          onClick={
            hasStudentGroups
              ? setShowCreateNewExamination
              : setShowStudentGroupWarnDialog
          }
        >
          <CustomButton className="text-xs gap-2">
            Create New Exam <FiPlus size={20} />
          </CustomButton>
        </DialogTrigger>
        <DropdownMenu>
          <button
            onClick={toggleDropdown}
            className="rounded-lg hover:bg-[#EAECF0] bg-transparent flex items-center justify-center !p-3"
          >
            <FiMoreVertical className="text-[#667085]" />
          </button>
          <DropdownMenuContent
            className="!w-[150px] !z-[1000]"
            open={isOpen}
            setOpen={setIsOpen}
            align="start"
          >
            <DropdownMenuItem>
              <button
                className="w-full h-full px-4 py-2 flex items-center justify-start"
                onClick={() => {
                  dispatch(setShowEditCourseDialog(true));
                }}
              >
                Update Course
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                className="w-full h-full px-4 py-2 flex items-center justify-start"
                onClick={() => {
                  dispatch(setShowDeleteCourseDialog(true));
                }}
              >
                Delete Course
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteCourseDialog title={course.course_title} id={course.id} />
      <EditCourse course={course} />
    </div>
  );
};

export default CourseTopbar;

const DeleteCourseDialog = ({ title = "Student Group 2", id = 0 }) => {
  const isOpen = useSelector((state) => state.ui.showDeleteCourseDialog);
  const { deleteLoading: isLoading } = useSelector((state) => state.courses);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleDeleteCourse = (courseId) => {
    dispatch(deleteCourse({ id: courseId }))
      .unwrap()
      .then(() => {
        showToast("Course deleted successfully!", "success");
        setTimeout(() => {
          dispatch(setShowDeleteCourseDialog(false));
          navigate("/dashboard");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to delete course. Please try again!", "error");
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
      // onOpenChange={setShowDeleteCourseDialog}
      maxWidth="400px"
    >
      <DialogHeader>Delete Course</DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent className="p-6 pt-2">
        <CardDescription>
          Are you sure you want to delete the course <strong>{title}</strong>.
          This action cannot be undone
        </CardDescription>
        <div className="w-1/2 flex gap-5 ml-auto">
          <CustomButton
            variant="clear"
            className="gap-2 mt-4 flex-1"
            disabled={isLoading}
            onClick={() => dispatch(setShowDeleteCourseDialog(false))}
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={() => handleDeleteCourse(id)}
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

const EditCourse = ({ course }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isOpen = useSelector((state) => state.ui.showEditCourseDialog);
  const { updateLoading: loading, updateError } = useSelector(
    (state) => state.courses
  );

  const [formData, setFormData] = useState({
    course_title: "",
    course_code: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    setFormData({
      course_title: course.course_title,
      course_code: course.course_code,
    });
  }, [course]);

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    dispatch(
      updateCourse({
        id: course.id,
        body: formData,
      })
    )
      .unwrap()
      .then(() => {
        showToast("Course updated successfully!", "success");
        setTimeout(() => {
          dispatch(setShowEditCourseDialog(false));
          // navigate("/student-groups");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to update course. Please try again!", "error");
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
      onOpenChange={setShowEditCourseDialog}
      maxWidth="400px"
    >
      <DialogHeader>
        <h2 className="!font-semibold text-xl">Update Course</h2>
        {/* <p className="opacity-80">
          Set up a student course to organize and manage your tests easily.
        </p> */}
      </DialogHeader>
      <DropdownMenuSeparator />
      <form action="" onSubmit={handleUpdateCourse}>
        <DialogContent className="p-6 py-2">
          <Label htmlFor="examRoomName">Course Name</Label>
          <Input
            value={formData.course_title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, course_title: e.target.value }))
            }
            required
            placeholder="E.g: Database Admin Workshop"
            className="mb-4"
            id="examRoomName"
          />
          <Label htmlFor="session">Course Code</Label>
          <Input
            value={formData.course_code}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, course_code: e.target.value }))
            }
            required
            placeholder="E.g: COSC 444"
            id="session"
          />
        </DialogContent>
        <DropdownMenuSeparator />
        <DialogContent className="p-6 pt-4 flex items-center justify-end gap-4">
          <CustomButton
            className="!text-sm"
            variant="clear"
            onClick={() => dispatch(setShowEditCourseDialog(false))}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            loading={loading}
            className="!text-sm w-[150px]"
            variant="primary"
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
