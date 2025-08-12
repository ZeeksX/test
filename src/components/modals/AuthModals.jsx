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
  setShowSaveExamToDraftDialog,
} from "../../features/reducers/uiSlice";
import { Label } from "../ui/Label";
import { Input, Password } from "../ui/Input";
import CustomButton from "../ui/Button";
import { useRef, useState } from "react";
import { check_email, green_tick } from "../../utils/images";
import Toast from "./Toast";
import { DropdownMenuSeparator } from "../ui/Dropdown";
import apiCall from "../../utils/apiCall";
import { useNavigate, useParams } from "react-router";
import { deleteSavedExam } from "../../features/reducers/draftSlice";
import { countQuestionTypes } from "./UIUtilities";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import { FiHelpCircle } from "react-icons/fi";
import { fetchUserCredits } from "../../features/reducers/userSlice";

export const ForgotPasswordDialog = ({ type }) => {
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
    setLoading(true);

    const body = {
      email,
    };

    try {
      const response = await fetch(
        "https://backend-acad-ai.onrender.com/users/password-reset/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        console.log(await response.json());
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
        {type == "forgot" ? (
          <>
            <h1 className="text-center font-semibold text-2xl text-primary-main mb-2">
              Forgot Password
            </h1>
            <p className="text-center text-[14px] mb-4">
              Enter your email address and we’ll send you a link to reset your
              password
            </p>
          </>
        ) : (
          <>
            <h1 className="text-center font-semibold text-2xl text-primary-main mb-2">
              Change Password
            </h1>
            <p className="text-center text-[14px] mb-4">
              Enter your email address and we’ll send you a link to reset your
              password
            </p>
          </>
        )}

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
      const response = await fetch(
        "https://backend-acad-ai.onrender.com/users/password-reset/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        showToast("Your OTP has been sent.", "success");
      }
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
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Only allow empty string or a single digit (0-9)
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Automatically submit when all 6 digits are entered
    // if (newOtp.every((digit) => /^\d$/.test(digit))) {
    //   handleSubmit(newOtp.join(""));
    // }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

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
    setLoading(true);

    const body = {
      email: email,
      otp: otp.join(""),
      new_password: formData.newPassword,
    };

    try {
      const response = await apiCall.post(
        "/users/password-reset-confirm/",
        body
      );

      if (response.status === 200) {
        setOtp(["", "", "", "", "", ""]);
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
        dispatch(setShowResetPasswordDialog({ willShow: false, email: email }));
        dispatch(setShowPasswordUpdatedDialog(true));
      }
      // console.log(body);
    } catch (error) {
      showToast("Failed to update password. Please try again.", "error");
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
          <Label>Enter your OTP</Label>
          <div className="flex items-center justify-between mb-4 w-full">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength="1"
                className="w-12 h-12 max-md:w-10 max-md:h-10 max-[330px]:w-1/6 max-[330px]:h-auto text-xl text-center border-2 rounded-md focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-main"
              />
            ))}
          </div>
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
          {/* <div className="mb-8">
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
          </div> */}

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
  const navigate = useNavigate();

  return (
    <OutsideDismissDialog
      open={isOpen}
      // onOpenChange={setShowExamConcludedDialog}
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
          // as="link"
          // to="/dashboard"
          className="w-full min-w-0 h-10"
          onClick={() => {
            // navigate(-2);
            navigate("/dashboard", { replace: true });
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

  const count = countQuestionTypes(body);
  // console.log(count);

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

        await dispatch(fetchUserCredits()).unwrap();
        dispatch(setShowCreateNewExamination(false));
        dispatch(setShowPostExamWarningDialog({ willShow: false, exam: null }));
      }
    } catch (error) {
      if (error.status == 400) {
        showToast(
          error.response?.data?.error
            ? `${error.response?.data?.error} You can save your exam to draft and purchase more credits.`
            : "Failed to create exam. Please try again.",
          "error"
        );
      } else {
        showToast("Failed to create exam. Please try again.", "error");
      }
      // showToast("Failed to create exam. Please try again.", "error");
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
      // onOpenChange={setShowPostExamWarningDialog}
    >
      {/* <DialogHeader> */}
      <div className="px-6 pt-6 w-full flex justify-between items-start">
        <DialogTitle>Post Exam</DialogTitle>
        <TooltipProvider>
          <button
            disabled
            className="px-4 py-2 rounded flex items-center gap-2 border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <span className="font-medium text-sm">
              Total Cost:{" "}
              {(count.theory + count.cloze / 2) * body?.exam_rooms?.length}{" "}
              Credit(s)
            </span>
            <Tooltip>
              <TooltipTrigger>
                <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-gray-900 text-white text-left p-3 rounded-lg max-w-xs"
              >
                <p className="font-semibold mb-1 mr-auto">Credit Cost</p>
                <p className="text-sm mb-2">
                  This is the amount of credit that will be deducted to publish
                  this exam.
                </p>
                <p className="font-semibold mb-1 mr-auto">Note</p>
                <p className="text-sm">
                  One theory question for a student group is graded with one
                  credit. <br />
                  Two cloze questions for a student group are graded with one
                  credit.
                </p>
              </TooltipContent>
            </Tooltip>
          </button>
        </TooltipProvider>
      </div>
      {/* </DialogHeader> */}
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

export const SaveExamToDraftDialog = () => {
  const navigate = useNavigate();
  const isOpen = useSelector(
    (state) => state.ui.showSaveExamToDraftDialog.willShow
  );
  const body = useSelector((state) => state.ui.showSaveExamToDraftDialog.exam);
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
      const response = await apiCall.post("/exams/draft-exams/save/", body);

      if (response.status === 201) {
        showToast("Exam saved", "success");

        navigate(`/course/${body.course}/saved`);
        dispatch(setShowCreateNewExamination(false));
        dispatch(setShowSaveExamToDraftDialog({ willShow: false, exam: null }));
      }
    } catch (error) {
      showToast("Failed to save exam. Please try again.", "error");
      console.error("Error saving exam:", error);
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
      onOpenChange={setShowSaveExamToDraftDialog}
    >
      <DialogHeader>
        <DialogTitle>Save Exam to Draft</DialogTitle>
      </DialogHeader>
      <DropdownMenuSeparator />
      <div className="p-6 pt-0">
        <p className="my-3 text-sm text-gray-600 mb-5">
          You can access this exam in your <strong>Saved Drafts</strong> tab for
          this course.
        </p>
        <div className="w-full flex gap-4">
          <CustomButton
            className="flex-1 min-w-0 h-10"
            variant="clear"
            onClick={() =>
              dispatch(
                setShowSaveExamToDraftDialog({ willShow: false, exam: body })
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
            Save Exam
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

export const PublishDraftExamWarningDialog = ({ setExamData }) => {
  const navigate = useNavigate();
  const { draftId } = useParams();
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

  const count = countQuestionTypes(body);

  const handleDeleteExam = (examId) => {
    dispatch(deleteSavedExam({ id: examId }))
      .unwrap()
      .then(() => {
        handlePublish();
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to delete exam. Please try again!", "error");
      });
  };

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

        // handleDeleteExam(draftId);
        await dispatch(fetchUserCredits()).unwrap();

        navigate(`/course/${body.course}/published`);
        dispatch(setShowCreateNewExamination(false));
        dispatch(setShowPostExamWarningDialog({ willShow: false, exam: null }));
      }
    } catch (error) {
      if (error.status == 400) {
        showToast(
          error.response?.data?.error
            ? `${error.response?.data?.error} You can save your exam to draft and purchase more credits.`
            : "Failed to create exam. Please try again.",
          "error"
        );
      } else {
        showToast("Failed to create exam. Please try again.", "error");
      }
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
      <div className="px-6 pt-6 w-full flex justify-between items-start">
        <DialogTitle>Publish Exam</DialogTitle>
        <TooltipProvider>
          <button
            disabled
            className="px-4 py-2 rounded flex items-center gap-2 border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <span className="font-medium text-sm">
              Total Cost:{" "}
              {(count.theory + count.cloze / 2) * body?.exam_rooms?.length}{" "}
              Credit(s)
            </span>
            <Tooltip>
              <TooltipTrigger>
                <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-gray-900 text-white text-left p-3 rounded-lg max-w-xs"
              >
                <p className="font-semibold mb-1 mr-auto">Credit Cost</p>
                <p className="text-sm mb-2">
                  This is the amount of credit that will be deducted to publish
                  this exam.
                </p>
                <p className="font-semibold mb-1 mr-auto">Note</p>
                <p className="text-sm">
                  One theory question for a student group is graded with one
                  credit. <br />
                  Two cloze questions for a student group are graded with one
                  credit.
                </p>
              </TooltipContent>
            </Tooltip>
          </button>
        </TooltipProvider>
      </div>
      <DropdownMenuSeparator />
      <div className="p-6 pt-0">
        <p className="my-3 text-sm text-gray-600 mb-5">
          Are you sure you want to publish this saved exam? Note that you cannot
          modify the contents of an exam once they are posted and this exam will
          be removed from your drafts.
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
            onClick={() => handleDeleteExam(draftId)}
            loading={isSubmitting}
          >
            Publish Exam
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
