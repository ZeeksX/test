import { useRef, useState } from "react";
import {
  ButtonDismissDialog,
  DialogContent,
  DialogHeader,
  DialogSubTitle,
  DialogTitle,
  OutsideDismissDialog,
} from "../ui/Dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowCreateExaminationRoom,
  setShowCreateNewExamination,
  setShowCreateStudentGroup,
  setShowJoinStudentGroupDialog,
  setShowLeaveStudentGroupDialog,
  setShowShareStudentGroupLinkDialog,
  setShowStudentGroupWarnDialog,
} from "../../features/reducers/uiSlice";
import { DropdownMenuSeparator } from "../ui/Dropdown";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { CustomButton } from "../ui/Button";
import { dangerImg } from "../../utils/images";
import {
  FiChevronRight,
  FiCopy,
  FiMoreVertical,
  FiPlus,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { copyToClipboard } from "../../utils/minorUtilities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Badge } from "../ui/Badge";
import { toLocalISOString } from "../modals/UIUtilities";
import {
  ManualCreateExamQuestion,
  MaterialCreateExamAddMaterial,
  MaterialCreateExamUpdateMetaData,
} from "./CreateExamQuestion";
import { useParams } from "react-router";
import CourseExamPreview from "./CourseExamPreview";
import {
  createCourse,
  createLocalCourse,
} from "../../features/reducers/courseSlice";
import Toast from "../modals/Toast";

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
      // dispatch(setShowCreateExaminationRoom(false));
    } catch (err) {
      showToast("Failed to create course. Please try again.", "error");
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
            className="!text-sm w-[80px]"
            variant="accent"
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

export const CreateNewExam = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();

  const [selectedQuestionMethod, setSelectedQuestionMethod] = useState("");
  const [examPreview, setExamPreview] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [examData, setExamData] = useState({
    name: "",
    course: courseId,
    examType: "",
    description: "",
    scheduleTime: false,
    dueTime: false,
    addQuestion: [],
    questionMethod: selectedQuestionMethod,
    questions: [],
    uploadedFiles: [],
    gradingStyle: "strict",
    numberOfQuestions: 50,
    questionTypes: [],
    studentGroups: [],
  });

  const [showExamCreation, setShowExamCreation] = useState(false);
  const [examCreated, setExamCreated] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setExamCreated(true);
      setShowExamCreation(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamData({
      ...examData,
      [name]: value,
    });
  };

  // const handleSwitchChange = (name, checked) => {
  //   setExamData({
  //     ...examData,
  //     [name]: checked,
  //   });
  // };

  const handleSelectChange = (name, value) => {
    setExamData({
      ...examData,
      [name]: value,
    });
  };

  const addStudentGroup = (group) => {
    if (!selectedGroups.includes(group)) {
      const updatedGroups = [...selectedGroups, group];

      setSelectedGroups(updatedGroups);
      setExamData({
        ...examData,
        studentGroups: updatedGroups,
      });
    }
  };

  const removeStudentGroup = (group) => {
    const updatedGroups = selectedGroups.filter((g) => g !== group);

    setSelectedGroups(updatedGroups);
    setExamData({
      ...examData,
      studentGroups: updatedGroups,
    });
  };

  const handlePublish = () => {
    console.log(examData);
  };

  const [selectedExam, setSelectedExam] = useState("");

  const updateExamData = (newData) => {
    setExamData({ ...examData, ...newData });
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-4 overflow-auto">
        <div className="">
          <div className="mb-8">
            <div className="flex justify-center mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep === step
                          ? "bg-blue-600 text-white"
                          : step < currentStep
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    <div
                      className={`w-16 h-1 ${
                        step < 5
                          ? step < currentStep
                            ? "bg-green-500"
                            : "bg-gray-200"
                          : "hidden"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="flex justify-between w-full max-w-[456px] mx-auto">
                <div
                  className={`text-xs w-[80px] ${
                    currentStep === 1
                      ? "text-blue-600"
                      : 1 < currentStep
                      ? "text-green-500"
                      : "text-gray-200"
                  }`}
                >
                  Examination
                  <br />
                  Metadata
                </div>
                <div
                  className={`text-xs w-[80px]  ${
                    currentStep === 2
                      ? "text-blue-600"
                      : 2 < currentStep
                      ? "text-green-500"
                      : "text-gray-200"
                  }`}
                >
                  Create
                  <br />
                  Examination
                </div>
                <div
                  className={`text-xs w-[80px] ${
                    currentStep === 3
                      ? "text-blue-600"
                      : 3 < currentStep
                      ? "text-green-500"
                      : "text-gray-200"
                  }`}
                >
                  Grading
                  <br />
                  Style
                </div>
                <div
                  className={`text-xs w-[80px] ${
                    currentStep === 4
                      ? "text-blue-600"
                      : 4 < currentStep
                      ? "text-green-500"
                      : "text-gray-200"
                  }`}
                >
                  Time
                </div>
                <div
                  className={`text-xs w-[80px] ${
                    currentStep === 5
                      ? "text-blue-600"
                      : 5 < currentStep
                      ? "text-green-500"
                      : "text-gray-200"
                  }`}
                >
                  Student
                  <br />
                  Groups
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div>
              {examPreview ? (
                <>
                  <CourseExamPreview
                    examData={examData}
                    setPreview={() => setExamPreview(false)}
                  />
                </>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl mb-4">
                      {currentStep === 1 && "Examination metadata"}
                      {currentStep === 2 &&
                        selectedQuestionMethod == "" &&
                        "Add questions"}
                      {currentStep === 3 && "Grading style"}
                      {currentStep === 4 && "Time"}
                      {currentStep === 5 && "Student group"}
                    </h2>
                  </div>
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="examName">Examination Name</Label>
                        <Input
                          id="examName"
                          name="name"
                          placeholder="Examination 1"
                          value={examData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="examType">Examination Type</Label>
                        <Input
                          id="examType"
                          name="examType"
                          placeholder="E.g Assignment, Mid-Semester, Quiz"
                          value={examData.examType}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                          id="description"
                          name="description"
                          placeholder="Enter Description"
                          value={examData.description}
                          onChange={handleInputChange}
                          className="w-full p-3 border-[1.5px] rounded-md outline-none placeholder:text-text-placeholder focus:outline-none focus:border-primary-main resize-none min-h-[170px]"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <>
                      {selectedQuestionMethod === "manual" && (
                        <ManualCreateExamQuestion
                          examData={examData}
                          updateExamData={updateExamData}
                          setSelectedQuestionMethod={() =>
                            setSelectedQuestionMethod("")
                          }
                        />
                      )}

                      {selectedQuestionMethod === "upload" && (
                        <MaterialCreateExamUpdateMetaData
                          examData={examData}
                          updateExamData={updateExamData}
                          setSelectedQuestionMethod={() =>
                            setSelectedQuestionMethod("")
                          }
                        />
                      )}

                      {selectedQuestionMethod == "" && (
                        <div className="space-y-6">
                          <p className="text-sm text-gray-500 mb-4">
                            Select a method to upload your questions
                          </p>

                          <div className="space-y-4">
                            <div
                              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                              onClick={() =>
                                setSelectedQuestionMethod("manual")
                              }
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium">
                                    Add questions manually
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Add as many questions as your plan allows,
                                    specify question type, question, model
                                    answer, maximum score
                                  </p>
                                </div>
                                <FiChevronRight className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>

                            <MaterialCreateExamAddMaterial
                              examData={examData}
                              updateExamData={updateExamData}
                              setSelectedQuestionMethod={() =>
                                setSelectedQuestionMethod("upload")
                              }
                            />

                            <div
                              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                              // onClick={() => setSelectedQuestionMethod("copy")}
                            >
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <h3 className="font-medium">
                                    Create from an existing test
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Choose an already existing test to make a
                                    copy and edit
                                  </p>
                                </div>
                                <FiChevronRight className="h-5 w-5 text-gray-400" />
                              </div>

                              <Select
                                value={selectedExam}
                                onValueChange={setSelectedExam}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Examination 1" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="exam1">
                                    Examination 1
                                  </SelectItem>
                                  <SelectItem value="exam2">
                                    Examination 2
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <p className="text-sm text-gray-500 mb-4">
                        Select a grading style for your examination.
                      </p>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="gradingStyle">
                            Grading style (optional)
                          </Label>
                          <div className="flex space-x-2">
                            <CustomButton
                              className="!font-medium text-sm"
                              variant={
                                examData.gradingStyle === "strict"
                                  ? "default"
                                  : "clear"
                              }
                              size="sm"
                              onClick={() =>
                                handleSelectChange("gradingStyle", "strict")
                              }
                            >
                              Strict
                            </CustomButton>
                            <CustomButton
                              className="!font-medium text-sm"
                              variant={
                                examData.gradingStyle === "not-strict"
                                  ? "default"
                                  : "clear"
                              }
                              size="sm"
                              onClick={() =>
                                handleSelectChange("gradingStyle", "not-strict")
                              }
                            >
                              Not Strict
                            </CustomButton>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          className="text-blue-600 p-1 flex font font-medium gap-2 items-center justify-center hover:underline"
                          onClick={handleSkip}
                        >
                          Skip <FiChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="flex-1">
                        <Label htmlFor="startTIme" className={`mb-2`}>
                          Schedule Time
                        </Label>
                        <Input
                          type="datetime-local"
                          name="scheduleTime"
                          id="scheduleTime"
                          value={
                            examData.scheduleTime
                              ? toLocalISOString(
                                  new Date(examData.scheduleTime)
                                )
                              : ""
                          }
                          onChange={(e) =>
                            setExamData((prev) => ({
                              ...prev,
                              scheduleTime: new Date(e.target.value),
                            }))
                          }
                          placeholder="Select Date"
                          required
                        />
                      </div>

                      <div className="flex-1">
                        <Label htmlFor="startTIme" className={`mb-2`}>
                          Due Time
                        </Label>
                        <Input
                          type="datetime-local"
                          name="dueTime"
                          id="dueTime"
                          value={
                            examData.dueTime
                              ? toLocalISOString(new Date(examData.dueTime))
                              : ""
                          }
                          onChange={(e) =>
                            setExamData((prev) => ({
                              ...prev,
                              dueTime: new Date(e.target.value),
                            }))
                          }
                          placeholder="Select Date"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="studentGroup">
                          Choose student group
                        </Label>
                        <p className="text-sm text-gray-500">
                          Choose affected student group
                        </p>
                        <Select
                          onValueChange={(value) => addStudentGroup(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Student Group 1" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Student Group 1">
                              Student Group 1
                            </SelectItem>
                            <SelectItem value="Student Group 2">
                              Student Group 2
                            </SelectItem>
                            <SelectItem value="Student Group 3">
                              Student Group 3
                            </SelectItem>
                            <SelectItem value="Student Group 4">
                              Student Group 4
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedGroups.map((group) => (
                          <Badge
                            key={group}
                            className="bg-primary-main flex items-center gap-2 px-4 py-2"
                          >
                            {group}
                            <FiX
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeStudentGroup(group)}
                            />
                          </Badge>
                        ))}
                      </div>

                      {/* <CustomButton variant="clear" className="mt-4">
                    <FiPlus className="h-4 w-4 mr-2" />
                    Create New Student Group
                  </CustomButton> */}
                    </div>
                  )}
                  {selectedQuestionMethod == "" && (
                    <div className="flex justify-end gap-6 mt-8">
                      {currentStep === 1 ? (
                        <CustomButton
                          variant="clear"
                          onClick={() =>
                            dispatch(setShowCreateNewExamination(false))
                          }
                        >
                          Cancel
                        </CustomButton>
                      ) : (
                        <CustomButton variant="clear" onClick={handleBack}>
                          Cancel
                        </CustomButton>
                      )}

                      {currentStep === 5 ? (
                        <div className="flex gap-3 ml-auto">
                          <CustomButton
                            variant="ghost"
                            className=""
                            onClick={() => handlePublish()}
                          >
                            Save to Draft
                          </CustomButton>
                          <CustomButton
                            variant="ghost"
                            className=""
                            onClick={() => setExamPreview(true)}
                          >
                            Preview
                          </CustomButton>
                          <CustomButton
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handlePublish()}
                          >
                            Publish
                          </CustomButton>
                        </div>
                      ) : (
                        <CustomButton
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={handleNext}
                        >
                          Next
                        </CustomButton>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
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
  const isOpen = useSelector((state) => state.ui.showCreateStudentGroup);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleCreateStudentGroup = (e) => {
    e.preventDefault();

    console.log(formData);
    setFormData({ name: "", session: "" });
  };

  return (
    <OutsideDismissDialog
      open={isOpen}
      onOpenChange={setShowCreateStudentGroup}
      maxWidth="400px"
    >
      <DialogHeader>
        <DialogTitle>Create Student Group</DialogTitle>
        <DialogSubTitle>
          Set up a student group to organize and manage your tests easily.
        </DialogSubTitle>
      </DialogHeader>
      <DropdownMenuSeparator />
      <form action="" onSubmit={handleCreateStudentGroup}>
        <DialogContent className="p-6">
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
          <CustomButton className="gap-2 w-full" size="lg">
            Create Student Group <FiPlus size={20} />
          </CustomButton>
        </DialogContent>
      </form>
    </OutsideDismissDialog>
  );
};

export const ShareStudentGroupLinkDialog = ({ link = "wbfefebi" }) => {
  const isOpen = useSelector(
    (state) => state.ui.showShareStudentGroupLinkDialog
  );
  const dispatch = useDispatch();

  return (
    <ButtonDismissDialog
      open={isOpen}
      onOpenChange={setShowShareStudentGroupLinkDialog}
      maxWidth="400px"
    >
      <DialogHeader>
        <DialogTitle>
          Here’s your link to this Student <br /> group
        </DialogTitle>
      </DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent className="p-4">
        <div className="px-4 py-2 flex items-center justify-start w-full bg-[#F2F4F7] rounded-md">
          <p className="flex-1 text-[#155EEF]">{link}</p>
          <button onClick={() => copyToClipboard(link)}>
            <FiCopy color="#155EEF" />
          </button>
        </div>
      </DialogContent>
      <DropdownMenuSeparator />
      <DialogContent className="p-6 pt-4 flex items-center justify-center gap-4">
        <CustomButton
          className="!text-sm gap-3"
          onClick={() => copyToClipboard(link)}
          variant="clear"
        >
          <FiUpload />
          Share
        </CustomButton>
        <CustomButton
          type="submit"
          className="!text-sm"
          variant="primary"
          onClick={() => dispatch(setShowShareStudentGroupLinkDialog(false))}
        >
          Done
        </CustomButton>
      </DialogContent>
    </ButtonDismissDialog>
  );
};

export function ExaminationCard({
  title = "Examination name 6",
  description = "Description/Instruction lorem ipsum dolor sit amet dictietres consectetur. At aliquet pharetra non sociis. At aliquet phar...",
  studentGroups = 5,
  dueDate = "Mar 22nd",
  dueTime = "8:00 PM",
}) {
  return (
    <div className="bg-white border w-full max-w-md shadow-sm">
      <div className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CustomButton variant="ghost" size="icon" className="h-8 w-8 -ml-2">
          <FiMoreVertical className="h-5 w-5 text-gray-500" />
          <span className="sr-only">Menu</span>
        </CustomButton>
        <div className="w-full">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-600">
            {studentGroups} Student Groups
          </p>
          <p className="text-sm text-gray-500">
            Due Date & Time - {dueDate}, {dueTime}
          </p>
        </div>
      </div>
    </div>
  );
}

export const JoinStudentGroupDialog = () => {
  const isOpen = useSelector((state) => state.ui.showJoinStudentGroupDialog);
  const [type, setType] = useState("link");
  const [link, setLink] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Only allow empty string or a single digit (0-9)
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Automatically submit when all 6 digits are entered
    // if (newCode.every((digit) => /^\d$/.test(digit))) {
    //   handleSubmit(newCode.join(''));
    // }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <ButtonDismissDialog
      open={isOpen}
      onOpenChange={setShowJoinStudentGroupDialog}
    >
      {type == "link" ? (
        <>
          <DialogHeader>
            <DialogTitle>Join with a Link</DialogTitle>
          </DialogHeader>
          <DropdownMenuSeparator />
          <DialogContent className="p-4">
            <div className="w-full flex flex-col items-center justify-center">
              <h2 className="font-inter font-medium text-xl mb-4">
                Enter the link provided by the Teacher
              </h2>
              <div className="w-full px-4">
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                  placeholder="Enter link here"
                  className="mb-4"
                  id="examRoomName"
                />
              </div>
              <p
                className="cursor-pointer text-primary-main"
                onClick={() => setType("code")}
              >
                Use code instead
              </p>
              <CustomButton size="lg" className="gap-2 mt-4 w-full">
                Join Student Group
              </CustomButton>
            </div>
          </DialogContent>
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Join with a code</DialogTitle>
          </DialogHeader>
          <DropdownMenuSeparator />
          <DialogContent className="p-4">
            <div className="w-full flex flex-col items-center justify-center">
              <h2 className="font-inter font-medium text-xl mb-4">
                Enter the code provided by the Teacher
              </h2>
              <div className="flex space-x-2 mb-4">
                {code.map((digit, index) => (
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
              <p
                className="cursor-pointer text-primary-main"
                onClick={() => setType("link")}
              >
                Use link instead
              </p>
              <CustomButton size="lg" className="gap-2 mt-4 w-full">
                Join Student Group
              </CustomButton>
            </div>
          </DialogContent>
        </>
      )}
    </ButtonDismissDialog>
  );
};

export const LeaveStudentGroupDialog = ({ title = "Student Group 2" }) => {
  const isOpen = useSelector((state) => state.ui.showLeaveStudentGroupDialog);
  const dispatch = useDispatch();

  return (
    <ButtonDismissDialog
      open={isOpen}
      onOpenChange={setShowLeaveStudentGroupDialog}
    >
      <DialogHeader></DialogHeader>
      <DialogContent className="p-8 pt-4">
        <div className="w-full flex flex-col py-4 items-center justify-center">
          <h2 className="font-inter font-medium text-xl mb-4 text-center">
            Are we sure you want to leave <strong>{title}</strong>
          </h2>
          <div className="w-full flex gap-4">
            <CustomButton
              variant="clear"
              className="gap-2 mt-4 flex-1"
              onClick={() => dispatch(setShowLeaveStudentGroupDialog(false))}
            >
              Cancel
            </CustomButton>
            <CustomButton variant="danger" className="gap-2 mt-4 flex-1">
              Leave Group
            </CustomButton>
          </div>
        </div>
      </DialogContent>
    </ButtonDismissDialog>
  );
};
