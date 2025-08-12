import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/Dropdown";
import CustomButton from "../ui/Button";
import { FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router";
import Toast from "../modals/Toast";
import { CardDescription } from "../ui/Card";
import { CustomBlurBgDialog, DialogContent, DialogHeader } from "../ui/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { setShowDeleteSavedExamDialog } from "../../features/reducers/uiSlice";
import { deleteSavedExam } from "../../features/reducers/draftSlice";
import { formatScheduleTime } from "../modals/UIUtilities";

export const SavedExamsCard = ({ exams }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [idToShow, setIdToShow] = useState(0);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      // to={`${id}/detail`}
      className="bg-white border w-full max-w-md shadow-sm p-4 mb-4"
    >
      <div className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <DropdownMenu>
          <CustomButton
            onClick={toggleDropdown}
            variant="ghost"
            size="icon"
            className="h-8 w-8 "
          >
            <FiMoreVertical className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </CustomButton>
          <DropdownMenuContent
            className="!w-[200px]"
            open={isOpen}
            setOpen={setIsOpen}
            align="end"
          >
            <DropdownMenuItem>
              <Link
                to={`${exams.id}/edit`}
                className="w-full h-full px-4 py-2 flex items-center justify-start"
              >
                Continue Editing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                className="w-full h-full px-4 py-2 flex items-center justify-start"
                onClick={() => {
                  setIdToShow(exams.id);
                  dispatch(setShowDeleteSavedExamDialog(true));
                }}
              >
                Delete Examination
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-full">
          <h3 className="text-lg font-medium">
            {exams?.title || "No title set"}
          </h3>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-gray-500 line-clamp-2">
          {exams?.exam_type || "No exam type set"}
        </p>
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary-main">
            {exams?.exam_rooms.length || 0} Student Groups
          </p>
          <p className="text-sm text-gray-500">
            Due Date & Time -{" "}
            {exams.due_time ? formatScheduleTime(exams?.due_time) : "No due time set"}
          </p>
        </div>
      </div>
      <CustomButton
        as="link"
        to={`${exams.id}/edit`}
        className="mt-4 ml-auto w-[150px]"
      >
        Continue Editing
      </CustomButton>

      {idToShow != 0 && (
        <DeleteSavedExamDialog
          title={exams?.title || "No title set"}
          id={idToShow}
        />
      )}
    </div>
  );
};

const DeleteSavedExamDialog = ({ title = "Saved Exam", id = 0 }) => {
  const isOpen = useSelector((state) => state.ui.showDeleteSavedExamDialog);
  const { loading } = useSelector((state) => state.drafts);
  const dispatch = useDispatch();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleDeleteExam = (examId) => {
    dispatch(deleteSavedExam({ id: examId }))
      .unwrap()
      .then(() => {
        showToast("Exam deleted successfully!", "success");
        dispatch(setShowDeleteSavedExamDialog(false));
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to delete exam. Please try again!", "error");
      });
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <CustomBlurBgDialog
      open={isOpen}
      // onOpenChange={setShowDeleteSavedExamDialog}
      maxWidth="400px"
    >
      <DialogHeader>Delete Saved Examination</DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent className="p-6 pt-2">
        <CardDescription>
          Are you sure you want to delete the draft <strong>{title}</strong>.
          This action cannot be undone
        </CardDescription>
        <div className="w-1/2 flex gap-5 ml-auto">
          <CustomButton
            variant="clear"
            className="gap-2 mt-4 flex-1"
            disabled={loading.deleteSavedExam}
            onClick={() => dispatch(setShowDeleteSavedExamDialog(false))}
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={() => handleDeleteExam(id)}
            loading={loading.deleteSavedExam}
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
    </CustomBlurBgDialog>
  );
};
