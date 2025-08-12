import { useEffect, useRef, useState } from "react";
import {
  ButtonDismissDialog,
  CustomBlurBgDialog,
  DialogContent,
  DialogHeader,
  DialogSubTitle,
  DialogTitle,
  OutsideDismissDialog,
} from "../ui/Dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowAddStudentToStudentGroupDialog,
  setShowCreateExaminationRoom,
  setShowCreateStudentGroup,
  setShowDeleteExamDialog,
  setShowJoinStudentGroupDialog,
  setShowLeaveStudentGroupDialog,
  setShowShareStudentGroupLinkDialog,
  setShowStudentGroupWarnDialog,
} from "../../features/reducers/uiSlice";
import { DropdownMenuSeparator } from "../ui/Dropdown";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { dangerImg } from "../../utils/images";
import { FiCopy, FiPlus, FiSearch } from "react-icons/fi";
import { copyToClipboard, sleep } from "../../utils/minorUtilities";
import { useNavigate } from "react-router";
import {
  createCourse,
  createLocalCourse,
} from "../../features/reducers/courseSlice";
import Toast from "../modals/Toast";
import apiCall from "../../utils/apiCall";
import {
  createLocalStudentGroup,
  fetchAllStudents,
  leaveExamRoom,
} from "../../features/reducers/examRoomSlice";
import { Spinner } from "../ui/Loader";
import { deleteExam } from "../../features/reducers/examSlice";
import { CardDescription } from "../ui/Card";
import CustomButton from "../ui/Button";

export const CreateExaminationRoom = () => {
  const isOpen = useSelector((state) => state.ui.showCreateExaminationRoom);
  const { createLoading: loading } = useSelector((state) => state.courses);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCreateExamRoom = async (e) => {
    e.preventDefault();

    const body = {
      course_title: formData.name,
      course_code: formData.code,
    };

    try {
      const response = await dispatch(createCourse({ body })).unwrap();

      setFormData({ name: "", code: "" });
      showToast("Course Created", "success");
      dispatch(createLocalCourse(response));
      setTimeout(() => {
        dispatch(setShowCreateExaminationRoom(false));
        closeToast();
      }, 1000);
    } catch (err) {
      const message = err.course_code[0];
      showToast(
        message || "Failed to create course. Please try again.",
        "error"
      );
      console.error("Error creating course:", err);
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
      onOpenChange={setShowCreateExaminationRoom}
    >
      <DialogHeader>
        <DialogTitle>Create Course</DialogTitle>
        <DialogSubTitle>
          Create a course and link your students together
        </DialogSubTitle>
      </DialogHeader>
      <DropdownMenuSeparator />
      <form action="" onSubmit={handleCreateExamRoom}>
        <DialogContent className="p-6">
          <Label htmlFor="examRoomName">Course Name</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            placeholder="E.g: Database Admin Workshop"
            className="mb-4"
            id="examRoomName"
          />
          <Label htmlFor="session">Course Code</Label>
          <Input
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, code: e.target.value }))
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
            onClick={() => dispatch(setShowCreateExaminationRoom(false))}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            loading={loading}
            className="!text-sm w-[100px]"
            variant="primary"
          >
            Create
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

export const StudentGroupWarnDialog = () => {
  const isOpen = useSelector((state) => state.ui.showStudentGroupWarnDialog);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setShowStudentGroupWarnDialog(false));
    dispatch(setShowCreateStudentGroup(true));
  };

  return (
    <OutsideDismissDialog
      open={isOpen}
      onOpenChange={setShowStudentGroupWarnDialog}
    >
      <DialogContent className="p-4">
        <div className="w-full flex flex-col py-4 items-center justify-center">
          <img src={dangerImg} alt="" />
          <h2 className="font-inter font-medium text-3xl mb-4">Oops!</h2>
          <p className="text-text-ghost font-normal text-base text-center">
            You need to have at least one student group to create an examination
          </p>
          <CustomButton className="gap-2 mt-4" onClick={() => handleClick()}>
            Create Student Group <FiPlus size={20} />
          </CustomButton>
        </div>
      </DialogContent>
    </OutsideDismissDialog>
  );
};

export const CreateStudentGroup = () => {
  const dispatch = useDispatch();
  // const { courseId } = useParams();
  const isOpen = useSelector((state) => state.ui.showCreateStudentGroup);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [loading, setLoading] = useState();
  const user = JSON.parse(localStorage.getItem("user"));
  const teacher = user.teacherId;

  const handleCreateStudentGroup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      name: formData.name,
      description: formData.description,
      course: 3,
      teacher: teacher,
    };

    try {
      const response = await apiCall.post("/exams/exam-rooms/", body);

      if (response.status === 201) {
        showToast("Student group created", "success");
        setFormData({ name: "", description: "" });
      }

      dispatch(createLocalStudentGroup(response.data));
      dispatch(setShowCreateStudentGroup(false));
      dispatch(
        setShowShareStudentGroupLinkDialog({
          willShow: true,
          link: `${window.location.hostname}/exams/groups/join/${response.data.invite_code}`,
          code: response.data.invite_code,
        })
      );
    } catch (error) {
      showToast("Failed to create student group. Please try again.", "error");
      console.error("Error creating student group:", error);
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
      onOpenChange={setShowCreateStudentGroup}
      maxWidth="400px"
    >
      <DialogHeader>
        <h2 className="!font-semibold text-xl">Create Student Group</h2>
        <p className="opacity-80">
          Set up a student group to organize and manage your tests easily.
        </p>
      </DialogHeader>
      <DropdownMenuSeparator />
      <form action="" onSubmit={handleCreateStudentGroup}>
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
          <Label htmlFor="session">Session</Label>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
            placeholder="Session i.e. '24/25'"
            id="session"
          />
        </DialogContent>
        <DropdownMenuSeparator />
        <DialogContent className="p-6 pt-4 flex items-center justify-end gap-4">
          <CustomButton
            type="submit"
            loading={loading}
            className="gap-2 w-full"
            size="lg"
          >
            Create Student Group <FiPlus size={20} />
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

export const ShareStudentGroupLinkDialog = () => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const isOpen = useSelector(
    (state) => state.ui.showShareStudentGroupLinkDialog.willShow
  );

  const { link, code } = useSelector(
    (state) => state.ui.showShareStudentGroupLinkDialog
  );

  const dispatch = useDispatch();

  const copyItem = async (text) => {
    try {
      const success = await copyToClipboard(text);
      if (success) {
        showToast("Copied to clipboard", "success");
      } else {
        showToast("Failed to copy to clipboard. Please try again.", "error");
      }
    } catch (error) {
      console.log(error);
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
      onOpenChange={setShowShareStudentGroupLinkDialog}
      maxWidth="450px"
    >
      <DialogHeader>
        <DialogTitle className="whitespace-pre-line text-center">
          Here’s your link and code to this Student Group
        </DialogTitle>
      </DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent className="p-4">
        <div className="px-4 py-2 flex items-center justify-between w-full bg-[#F2F4F7] rounded-md">
          <p className="flex-1 text-[#155EEF] max-w-[200px] truncate">{link}</p>
          <button onClick={() => copyItem(link)}>
            <FiCopy color="#155EEF" />
          </button>
        </div>
      </DialogContent>
      <div className="flex w-full items-center">
        <div className="flex-1 h-[1px] bg-[#D0D5DD]"></div>
        <p className="mx-2 text-[#D0D5DD]">OR</p>
        <div className="flex-1 h-[1px] bg-[#D0D5DD]"></div>
      </div>
      <DialogContent className="p-4">
        <div className="px-4 py-2 flex items-center justify-start w-full bg-[#F2F4F7] rounded-md">
          <p className="flex-1 text-[#155EEF]">{code}</p>
          <button onClick={() => copyItem(code)}>
            <FiCopy color="#155EEF" />
          </button>
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

export const JoinStudentGroupDialog = () => {
  const isOpen = useSelector((state) => state.ui.showJoinStudentGroupDialog);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { allStudentGroups } = useSelector((state) => state.examRooms);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const inputRefs = useRef([]);

  const handleSubmit = async (otpValue) => {
    // const invite_code = otpValue || otp.join("");
    const invite_code = otpValue || otp;

    if (invite_code.length !== 8) {
      showToast("Please fill the field with valid digits", "error");
      return;
    }

    setLoader(true);

    try {
      const response = await apiCall.post(`/exams/groups/join/${invite_code}/`);

      if (response.status === 201 || response.status === 200) {
        showToast(`You have joined the student group`, "success");
        await sleep(1000);
        dispatch(setShowJoinStudentGroupDialog(false));
        navigate("/dashboard");
        setOtp("");
      }
    } catch (error) {
      if (error.response.status == 400) {
        showToast(
          error.response.data.message ||
            "Failed to join group. Please try again.",
          "error"
        );
      } else if (error.response.status == 404) {
        showToast("There is no student group with this invite code.", "error");
      } else {
        showToast("Failed to join group. Please try again.", "error");
      }
      console.error("Error sending code:", error);
    } finally {
      setLoader(false);
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
      onOpenChange={setShowJoinStudentGroupDialog}
      maxWidth="400px"
    >
      <DialogHeader>
        <h2 className="text-xl whitespace-pre-line !text-center">
          Enter the code provided by the Teacher
        </h2>
      </DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent className="p-6">
        <div className="space-y-3 mx-auto items-center justify-center">
          <Label>Enter Code here: </Label>
          <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
        </div>
        <CustomButton
          type="button"
          loading={loader}
          onClick={() => handleSubmit()}
          className="w-[200px] h-10 py-2 bg-gray-400 text-white rounded-md mt-6 !mx-auto"
        >
          Join Student Group
        </CustomButton>
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

export const LeaveStudentGroupDialog = () => {
  const {
    isOpen,
    groupName: title,
    groupId: room_id,
  } = useSelector((state) => state.ui.showLeaveStudentGroupDialog);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const user = JSON.parse(localStorage.getItem("user"));
  // const studentId = user.studentId;

  const { removeStudentLoading: removing } = useSelector(
    (state) => state.examRooms
  );

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleLeave = async () => {
    dispatch(leaveExamRoom({ room_id }))
      .unwrap()
      .then(() => {
        showToast("You have left the student group!", "success");
        setTimeout(() => {
          dispatch(
            setShowLeaveStudentGroupDialog({
              isOpen: false,
              groupName: "",
              groupId: "",
            })
          );
          navigate("/dashboard");
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to leave student group. Please try again!", "error");
      });
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <ButtonDismissDialog
      open={isOpen}
      onOpenChange={setShowLeaveStudentGroupDialog}
      maxWidth="400px"
    >
      <DialogHeader></DialogHeader>
      <DialogContent className="p-8 pt-4">
        <div className="w-full flex flex-col py-4 items-center justify-center">
          <h2 className="font-inter font-medium text-xl mb-4 text-center">
            Are you sure you want to leave <strong>{title}</strong>
          </h2>
          <div className="w-full flex gap-4 px-5">
            <CustomButton
              variant="clear"
              className="gap-2 mt-4 flex-1"
              onClick={() => dispatch(setShowLeaveStudentGroupDialog(false))}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="danger"
              onClick={handleLeave}
              loading={removing}
              className="gap-2 mt-4 flex-1"
            >
              Leave Group
            </CustomButton>
          </div>
        </div>
      </DialogContent>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </ButtonDismissDialog>
  );
};

export const AddNewStudentToStudentGroupDialog = () => {
  const { isOpen, groupId } = useSelector(
    (state) => state.ui.showAddStudentToStudentGroupDialog
  );
  const dispatch = useDispatch();
  const { allStudents: students } = useSelector((state) => state.examRooms);
  const [isSending, setIsSending] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch]);

  const [search, setSearch] = useState("");
  const [willShow, setWillShow] = useState(false);

  const filteredStudents = students.filter((studentGroups) =>
    studentGroups.email.toLowerCase().includes(search.toLowerCase())
  );

  const sendCode = async (id, email) => {
    setIsSending(id);

    try {
      const body = { student_email: email };
      const response = await apiCall.post(
        `/exams/groups/${groupId}/send-code/`,
        body
      );

      if (response.status === 200) {
        showToast(`Email sent to ${email}`, "success");
        setWillShow(false);
        setSearch("");
      }
    } catch (error) {
      showToast("Failed to send code. Please try again.", "error");
      console.error("Error sending code:", error);
    } finally {
      setIsSending("");
    }
  };

  const toggleShow = () => {
    if (search.length > 2) {
      setWillShow(true);
    } else {
      showToast("Enter at least three characters", "error");
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
      onOpenChange={setShowAddStudentToStudentGroupDialog}
    >
      <DialogHeader>
        <DialogTitle>Add Student</DialogTitle>
      </DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent className="p-4">
        <div className="w-full flex flex-col items-start justify-start">
          <h2 className="font-inter font-medium text-xl mb-4">
            Search for a student by their email
          </h2>
          {/* <div className="w-full px-4"> */}
          <div className="flex w-full gap-2">
            <Input
              value={search}
              onChange={(e) => {
                setWillShow(false);
                setSearch(e.target.value);
              }}
              required
              placeholder="Enter email here"
              className="mb-2"
              id="examRoomName"
            />
            <CustomButton
              size="icon"
              className="w-[42px] h-[42px]"
              onClick={() => toggleShow()}
            >
              <FiSearch size={20} />
            </CustomButton>
          </div>
          <p className="text-sm mb-4 opacity-60">
            Only students with an Acad AI account can be added.
          </p>
          <p className="font-bold">Student Groups</p>
          <div className="max-h-[50dvh] overflow-y-auto w-full">
            {willShow ? (
              <>
                {filteredStudents.length === 0 ? (
                  <p className="text-center text-neutral-mediumGray py-4">
                    No Students found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredStudents.map((student) => (
                      <div
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary-bg"
                        key={student.id}
                      >
                        <div className="flex items-center gap-3">
                          <div className="">
                            <h4 className="font-medium">
                              {student.last_name}, {student.other_names}
                            </h4>
                            <p className="text-xs text-neutral-mediumGray truncate">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <CustomButton
                          type="button"
                          onClick={() => sendCode(student.id, student.email)}
                          disabled={isSending != ""}
                          className="w-[108px]"
                        >
                          {isSending == student.id ? <Spinner /> : `Send Code`}
                        </CustomButton>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-neutral-mediumGray py-4">
                Enter a student email and click search to display student
              </p>
            )}
          </div>
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

export const DeleteExamDialog = ({ title = "Student Group 2", id = 0 }) => {
  const isOpen = useSelector((state) => state.ui.showDeleteExamDialog);
  const { deleteExamLoading: isLoading } = useSelector((state) => state.exams);
  const dispatch = useDispatch();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleDeleteExam = (examId) => {
    dispatch(deleteExam({ id: examId }))
      .unwrap()
      .then(() => {
        showToast("Exam deleted successfully!", "success");
        dispatch(setShowDeleteExamDialog(false));
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
      // onOpenChange={setShowDeleteExamDialog}
      maxWidth="400px"
    >
      <DialogHeader>Delete Examination</DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent className="p-6 pt-2">
        <CardDescription>
          Are you sure you want to delete the examination{" "}
          <strong>{title}</strong>. This action cannot be undone
        </CardDescription>
        <div className="w-1/2 flex gap-5 ml-auto">
          <CustomButton
            variant="clear"
            className="gap-2 mt-4 flex-1"
            disabled={isLoading}
            onClick={() => dispatch(setShowDeleteExamDialog(false))}
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={() => handleDeleteExam(id)}
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
    </CustomBlurBgDialog>
  );
};
