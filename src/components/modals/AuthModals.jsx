import { useDispatch, useSelector } from "react-redux";
import {
  ButtonDismissDialog,
  DialogHeader,
  DialogTitle,
  OutsideDismissDialog,
} from "../ui/Dialog";
import {
  setShowCheckEmailDialog,
  setShowCreateNewExamination,
  setShowExamConcludedDialog,
  setShowForgotPasswordDialog,
  setShowPasswordUpdatedDialog,
  setShowPostExamWarningDialog,
  setShowResetPasswordDialog,
} from "../../features/reducers/uiSlice";
import { Label } from "../ui/Label";
import { Input, Password } from "../ui/Input";
import CustomButton from "../ui/Button";
import { useState } from "react";
import { check_email, green_tick } from "../../utils/images";
import Toast from "./Toast";
import { DialogContent } from "@mui/material";
import { DropdownMenuSeparator } from "../ui/Dropdown";
import apiCall from "../../utils/apiCall";
import { useNavigate } from "react-router";

export const ForgotPasswordDialog = () => {
  const isOpen = useSelector((state) => state.ui.showForgotPasswordDialog);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState();
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    const body = {
      email,
    };

    try {
      const response = await fetch("https://backend-acad-ai.onrender.com/users/password-reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      if (response.ok) {
        console.log(await response.json())
        dispatch(setShowForgotPasswordDialog(false));
        dispatch(setShowCheckEmailDialog({ willShow: true, email: email }));
      }
    } catch (error) {
      showToast("Failed to submit email. Please try again.", "error");
      console.error("Error submitting email:", error);
    } finally {
      setLoading(false);
    }
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
      onOpenChange={setShowForgotPasswordDialog}
    >
      <div className="p-10">
        <h1 className="text-center font-semibold text-2xl text-primary-main mb-2">
          Forgot Password
        </h1>
        <p className="text-center text-[14px] mb-4">
          Enter your email address and we’ll send you a link to reset your
          password
        </p>

        <form action="" className="" onSubmit={handleSubmitEmail}>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            className="mb-4"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <CustomButton type="submit" loading={loading} className="w-full h-10">
            Send
          </CustomButton>
        </form>
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </OutsideDismissDialog>
  );
};

export const CheckEmailDialog = () => {
  const isOpen = useSelector((state) => state.ui.showCheckEmailDialog.willShow);
  const email = useSelector((state) => state.ui.showCheckEmailDialog.email);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleResendEmail = async () => {
    const body = {
      email,
    };

    try {
      //   const response = await apiCall.post("/exams/exam-rooms/", body);

      //   if (response.status === 201) {
      //     showToast("Student group created", "success");
      //   }
      console.log(body);
    } catch (error) {
      showToast("Failed to submit email. Please try again.", "error");
      console.error("Error submitting email:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    dispatch(setShowCheckEmailDialog({ willShow: false, email: email }));
    dispatch(setShowResetPasswordDialog({ willShow: true, email: email }));
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <OutsideDismissDialog open={isOpen} onOpenChange={setShowCheckEmailDialog}>
      <div className="p-10 w-full flex flex-col items-center">
        <img src={check_email} alt="" className="my-4" />
        <h1 className="text-center font-semibold text-2xl text-primary-main mb-2">
          Check your email
        </h1>
        <p className="text-center text-[14px] mb-4">
          We’ve sent a password reset link to your email. Please check your
          inbox and click the link to continue.
        </p>

        <div action="" className="flex w-full items-end justify-between">
          <p
            onClick={() => handleResendEmail()}
            className="text-primary-main font-semibold hover:underline cursor-pointer"
          >
            {!loading ? "Resend email" : "Please wait..."}
          </p>
          <CustomButton
            className="w-max min-w-0 h-10"
            onClick={() => handleContinue()}
          >
            Continue
          </CustomButton>
        </div>
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </OutsideDismissDialog>
  );
};

export const ResetPasswordDialog = () => {
  const isOpen = useSelector(
    (state) => state.ui.showResetPasswordDialog.willShow
  );
  const email = useSelector((state) => state.ui.showResetPasswordDialog.email);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      formData,
    };

    try {
      //   const response = await apiCall.post("/exams/exam-rooms/", body);

      //   if (response.status === 201) {
      //     showToast("Student group created", "success");
      //   }
      console.log(body);
      dispatch(setShowResetPasswordDialog({ willShow: false, email: email }));
      dispatch(setShowPasswordUpdatedDialog(true));
    } catch (error) {
      showToast("Failed to submit email. Please try again.", "error");
      console.error("Error submitting email:", error);
    } finally {
      setLoading(false);
    }
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
      onOpenChange={setShowResetPasswordDialog}
    >
      <div className="p-10">
        <h1 className="text-center mb-4 font-semibold text-2xl text-primary-main">
          Reset Your Password
        </h1>
        <form action="" className="" onSubmit={handleSubmit}>
          <div className="mb-5">
            <Label>New Password</Label>
            <Password
              className=""
              placeholder="********"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              required
            />
            <p className="text-xs text-[#7C7C7C] mt-1">
              Make sure it’s something secure and easy for you to remember.
              You’ll use this to log in going forward.
            </p>
          </div>
          <div className="mb-8">
            <Label>Confirm New Password</Label>
            <Password
              placeholder="********"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
            />
          </div>
          <CustomButton type="submit" loading={loading} className="w-full h-10">
            Reset Password
          </CustomButton>
        </form>
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </OutsideDismissDialog>
  );
};

export const PasswordUpdatedDialog = () => {
  const isOpen = useSelector((state) => state.ui.showPasswordUpdatedDialog);
  const dispatch = useDispatch();

  return (
    <OutsideDismissDialog
      open={isOpen}
      onOpenChange={setShowPasswordUpdatedDialog}
    >
      <div className="p-10 w-full flex flex-col items-center">
        <img src={green_tick} alt="" className="my-4" />
        <h1 className="text-center font-semibold text-2xl text-primary-main mb-2">
          Password successfully updated!
        </h1>
        <p className="text-center text-[14px] mb-8">
          You can now log in with your new password
        </p>

        <CustomButton
          className="w-full min-w-0 h-10"
          onClick={() => dispatch(setShowPasswordUpdatedDialog(false))}
        >
          Done
        </CustomButton>
      </div>
    </OutsideDismissDialog>
  );
};

export const ExamConcludedDialog = () => {
  const isOpen = useSelector((state) => state.ui.showExamConcludedDialog);
  const dispatch = useDispatch();

  return (
    <OutsideDismissDialog
      open={isOpen}
      onOpenChange={setShowExamConcludedDialog}
    >
      <div className="p-10 w-full flex flex-col items-center">
        <img src={green_tick} alt="" className="my-4" />
        <h1 className="text-center font-semibold text-2xl mb-2">
          Your examination has been submitted successfully
        </h1>
        <p className="text-center text-[14px] mb-8">
          You will be notified when the results are ready
        </p>

        <CustomButton
          as="link"
          to="/dashboard"
          className="w-full min-w-0 h-10"
          onClick={() => {
            dispatch(setShowExamConcludedDialog(false));
          }}
        >
          Back to Dashboard
        </CustomButton>
      </div>
    </OutsideDismissDialog>
  );
};

export const PostExamWarningDialog = ({ setExamData }) => {
  const isOpen = useSelector(
    (state) => state.ui.showPostExamWarningDialog.willShow
  );
  const body = useSelector((state) => state.ui.showPostExamWarningDialog.exam);
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handlePublish = async () => {
    setIsSubmitting(true);

    try {
      const response = await apiCall.post("/exams/exams/", body);

      if (response.status === 201) {
        showToast("Exam created", "success");
        setExamData({
          name: "",
          course: "",
          examType: "",
          description: "",
          scheduleTime: false,
          dueTime: false,
          addQuestion: [],
          questionMethod: "",
          questions: [],
          uploadedFiles: [],
          gradingStyle: "strict",
          numberOfQuestions: 50,
          questionTypes: [],
          studentGroups: [],
          exam_rooms: [],
        });

        dispatch(setShowCreateNewExamination(false));
        dispatch(setShowPostExamWarningDialog({ willShow: false, exam: null }));
      }
    } catch (error) {
      showToast("Failed to create exam. Please try again.", "error");
      console.error("Error creating exam:", error);
    } finally {
      setIsSubmitting(false);
    }
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
      onOpenChange={setShowPostExamWarningDialog}
    >
      <DialogHeader>
        <DialogTitle>Post Exam</DialogTitle>
      </DialogHeader>
      <DropdownMenuSeparator />
      <div className="p-6 pt-0">
        <p className="my-3 text-sm text-gray-600 mb-5">
          Are you sure you want to post this exam? Note that you cannot modify
          the contents of an exam once they are posted.
        </p>
        <div className="w-full flex gap-4">
          <CustomButton
            className="flex-1 min-w-0 h-10"
            variant="clear"
            onClick={() =>
              dispatch(
                setShowPostExamWarningDialog({ willShow: false, exam: body })
              )
            }
          >
            Cancel
          </CustomButton>
          <CustomButton
            className="flex-1 min-w-0 h-10"
            onClick={() => handlePublish()}
            loading={isSubmitting}
          >
            Post Exam
          </CustomButton>
        </div>
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </OutsideDismissDialog>
  );
};
