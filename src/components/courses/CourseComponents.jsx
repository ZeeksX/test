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
  setShowCreateNewExamination,
  setShowCreateStudentGroup,
  setShowDeleteExamDialog,
  setShowJoinStudentGroupDialog,
  setShowLeaveStudentGroupDialog,
  setShowPostExamWarningDialog,
  setShowShareStudentGroupLinkDialog,
  setShowStudentGroupWarnDialog,
} from "../../features/reducers/uiSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/Dropdown";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { CustomButton } from "../ui/Button";
import { dangerImg } from "../../utils/images";
import {
  FiChevronRight,
  FiCopy,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { copyToClipboard, sleep } from "../../utils/minorUtilities";
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
import { Link, useNavigate, useParams } from "react-router";
import CourseExamPreview from "./CourseExamPreview";
import {
  createCourse,
  createLocalCourse,
} from "../../features/reducers/courseSlice";
import Toast from "../modals/Toast";
import apiCall from "../../utils/apiCall";
import {
  fetchAllStudents,
  fetchStudentGroups,
} from "../../features/reducers/examRoomSlice";
import { Spinner } from "../ui/Loader";
import { deleteExam, fetchExams } from "../../features/reducers/examSlice";
import { SERVER_URL } from "../../utils/constants";
import DateTimeSelector from "../DateTimeSelector";
import { PostExamWarningDialog } from "../modals/AuthModals";
import ConfirmationModal from "../modals/ConfirmationModal";
import { CardDescription } from "../ui/Card";

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
      }, 2000);
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

export const CreateNewExam = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();

  const { teacherStudentGroups } = useSelector((state) => state.examRooms);
  const { teacherExams } = useSelector((state) => state.exams);

  useEffect(() => {
    dispatch(fetchStudentGroups());
    dispatch(fetchExams());
  }, [dispatch]);

  const [selectedQuestionMethod, setSelectedQuestionMethod] = useState("");
  const [examPreview, setExamPreview] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [examData, setExamData] = useState({
    name: "",
    course: courseId,
    examType: "",
    description: "",
    scheduleTime: "",
    dueTime: "",
    addQuestion: [],
    questionMethod: selectedQuestionMethod,
    questions: [],
    uploadedFiles: [],
    gradingStyle: "strict",
    numberOfQuestions: 15,
    questionTypes: [],
    studentGroups: [],
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [showExamCreation, setShowExamCreation] = useState(false);
  const [examCreated, setExamCreated] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (
        currentStep === 1 &&
        (!examData.name.trim() ||
          !examData.examType.trim() ||
          !examData.description.trim())
      ) {
        showToast(
          "Please fill in an Exam name, type and description to move to the next step",
          "error"
        );
        return;
      }
      if (currentStep === 2 && examData.questions.length == 0) {
        showToast(
          "Please create a question using one of the methods to move to the next step",
          "error"
        );
        return;
      }
      if (
        currentStep === 4 &&
        (!examData.dueTime.toString().trim() ||
          !examData.scheduleTime.toString().trim())
      ) {
        showToast(
          "Please select a schedule date and due date to move to the next step",
          "error"
        );
        return;
      }
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

  const [selectedExam, setSelectedExam] = useState("");

  const setSelectedExamQuestions = (exam) => {
    setExamData({
      ...examData,
      questions: exam.questions,
    });
    setSelectedExam(exam);
  };

  const updateExamData = (newData) => {
    setExamData({ ...examData, ...newData });
  };

  const [submitting, setSubmitting] = useState(false);
  const handlePublish = async () => {
    if (currentStep === 5 && examData.studentGroups.length == 0) {
      showToast(
        "Please select at least one student group to publish an exam",
        "error"
      );
      return;
    }

    const body = {
      title: examData.name,
      exam_type: examData.examType,
      description: examData.description,
      schedule_time: new Date(examData.scheduleTime).toISOString(),
      status: "Scheduled",
      due_time: new Date(examData.dueTime).toISOString(),
      questions: examData.questions,
      source_file: "",
      strict: examData.gradingStyle === "strict",
      course: courseId,
      exam_rooms: examData.studentGroups.map((group) => group.id),
    };

    dispatch(setShowPostExamWarningDialog({ willShow: true, exam: body }));

    // setSubmitting(true);

    // try {
    //   const response = await apiCall.post("/exams/exams/", body);

    //   if (response.status === 201) {
    //     showToast("Exam created", "success");
    //     setExamData({
    //       name: "",
    //       course: courseId,
    //       examType: "",
    //       description: "",
    //       scheduleTime: false,
    //       dueTime: false,
    //       addQuestion: [],
    //       questionMethod: selectedQuestionMethod,
    //       questions: [],
    //       uploadedFiles: [],
    //       gradingStyle: "strict",
    //       numberOfQuestions: 50,
    //       questionTypes: [],
    //       studentGroups: [],
    //       exam_rooms: [],
    //     });

    //     dispatch(setShowCreateNewExamination(false));
    //   }
    // } catch (error) {
    //   showToast("Failed to create exam. Please try again.", "error");
    //   console.error("Error creating exam:", error);
    // } finally {
    //   setSubmitting(false);
    // }
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-4 min-h-full overflow-auto">
        <div className="h-full">
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
                      className={`w-16 max-md:w-10 h-1 ${
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

          <div className="max-w-2xl h-full mx-auto">
            <div>
              {examPreview ? (
                <>
                  <CourseExamPreview
                    examData={examData}
                    setPreview={() => setExamPreview(false)}
                    updateExamData={updateExamData}
                  />
                </>
              ) : (
                <div className="h-full">
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
                          currentStep={currentStep}
                          setCurrentStep={() => setCurrentStep(currentStep + 1)}
                          setPreviousStep={() =>
                            setCurrentStep(currentStep - 1)
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
                          currentStep={currentStep}
                          setCurrentStep={() => setCurrentStep(currentStep + 1)}
                          setPreviousStep={() =>
                            setCurrentStep(currentStep - 1)
                          }
                        />
                      )}

                      {selectedQuestionMethod === "copy" && (
                        <ManualCreateExamQuestion
                          examData={examData}
                          updateExamData={updateExamData}
                          setSelectedQuestionMethod={() =>
                            setSelectedQuestionMethod("")
                          }
                          currentStep={currentStep}
                          style="copied exam"
                          setCurrentStep={() => setCurrentStep(currentStep + 1)}
                          setPreviousStep={() =>
                            setCurrentStep(currentStep - 1)
                          }
                        />
                      )}

                      {selectedQuestionMethod == "" && (
                        <div className="space-y-6">
                          <p className="text-sm text-gray-500 mb-4">
                            Select a method to upload your questions
                          </p>

                          <div className="space-y-4">
                            {/* Create exam manuLLy */}
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

                            {/* Create exam with material */}
                            <MaterialCreateExamAddMaterial
                              examData={examData}
                              updateExamData={updateExamData}
                              setSelectedQuestionMethod={() =>
                                setSelectedQuestionMethod("upload")
                              }
                            />

                            {/* Create Exam by copying another exam */}
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
                                value={selectedExam.title}
                                onValueChange={(value) =>
                                  setSelectedExamQuestions(value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Examination 1" />
                                </SelectTrigger>
                                <SelectContent>
                                  {teacherExams?.map((exam) => (
                                    <SelectItem key={exam.id} value={exam}>
                                      <p
                                        className=""
                                        onClick={() =>
                                          setSelectedQuestionMethod("copy")
                                        }
                                      >
                                        {exam.title}
                                      </p>
                                    </SelectItem>
                                  ))}
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
                      {/* <div className="flex-1">
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
                      </div> */}
                      <DateTimeSelector
                        examData={examData}
                        updateExamData={updateExamData}
                      />
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-6 h-full">
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
                            {teacherStudentGroups?.map((studentGroup) => (
                              <SelectItem
                                key={studentGroup.id}
                                value={studentGroup}
                              >
                                {studentGroup.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedGroups.map((group) => (
                          <Badge
                            key={group.id}
                            className="bg-primary-main flex items-center gap-2 px-4 py-2"
                          >
                            {group.name}
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

                  {(currentStep === 2 && selectedQuestionMethod) == "" && (
                    <div className="flex justify-end gap-6 mt-8">
                      {currentStep === 1 ? (
                        <CustomButton
                          variant="clear"
                          className="w-1/5"
                          onClick={() =>
                            dispatch(setShowCreateNewExamination(false))
                          }
                        >
                          Cancel
                        </CustomButton>
                      ) : (
                        <CustomButton
                          variant="clear"
                          className="w-1/5"
                          onClick={handleBack}
                        >
                          Cancel
                        </CustomButton>
                      )}

                      {currentStep === 5 ? (
                        <div className="flex gap-3 ml-auto">
                          <CustomButton
                            variant="ghost"
                            className="w-1/3"
                            // onClick={() => handlePublish()}
                          >
                            Draft
                          </CustomButton>
                          <CustomButton
                            variant="ghost"
                            className="w-1/3"
                            onClick={() => setExamPreview(true)}
                          >
                            Preview
                          </CustomButton>
                          <CustomButton
                            loading={submitting}
                            variant="ghost"
                            className="w-1/3"
                            onClick={() => handlePublish()}
                            // onClick={() => dispatch(setShowPostExamWarningDialog({willShow: true, exam: }))}
                          >
                            Publish
                          </CustomButton>
                        </div>
                      ) : (
                        <CustomButton
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={handleNext}
                          variant="primary"
                        >
                          Next
                        </CustomButton>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />

      <PostExamWarningDialog setExamData={setExamData} />
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
      course: 1,
      teacher: teacher,
    };

    try {
      const response = await apiCall.post("/exams/exam-rooms/", body);

      if (response.status === 201) {
        showToast("Student group created", "success");
        setFormData({ name: "", description: "" });
      }
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
  const isOpen = useSelector(
    (state) => state.ui.showShareStudentGroupLinkDialog.willShow
  );

  const { link, code } = useSelector(
    (state) => state.ui.showShareStudentGroupLinkDialog
  );
  const dispatch = useDispatch();

  return (
    <OutsideDismissDialog
      open={isOpen}
      onOpenChange={setShowShareStudentGroupLinkDialog}
      maxWidth="400px"
    >
      <DialogHeader>
        <DialogTitle className="whitespace-pre-line text-center">
          Here’s your link and code to this Student Group
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
      <div className="flex w-full items-center">
        <div className="flex-1 h-[1px] bg-[#D0D5DD]"></div>
        <p className="mx-2 text-[#D0D5DD]">OR</p>
        <div className="flex-1 h-[1px] bg-[#D0D5DD]"></div>
      </div>
      <DialogContent className="p-4">
        <div className="px-4 py-2 flex items-center justify-start w-full bg-[#F2F4F7] rounded-md">
          <p className="flex-1 text-[#155EEF]">{code}</p>
          <button onClick={() => copyToClipboard(code)}>
            <FiCopy color="#155EEF" />
          </button>
        </div>
      </DialogContent>
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
    </OutsideDismissDialog>
  );
};

export function ExaminationCard({
  id = 0,
  title = "Examination name 6",
  description = "Description/Instruction lorem ipsum dolor sit amet dictietres consectetur. At aliquet pharetra non sociis. At aliquet phar...",
  studentGroups = 5,
  dueTime = "Mar 22nd, 8:00 PM",
}) {
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
                to={`${id}/detail`}
                className="w-full h-full px-4 py-2 flex items-center justify-start"
              >
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                className="w-full h-full px-4 py-2 flex items-center justify-start"
                onClick={() => {
                  setIdToShow(id);
                  dispatch(setShowDeleteExamDialog(true));
                }}
              >
                Delete Examination
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          <p className="text-sm text-gray-500">Due Date & Time - {dueTime}</p>
        </div>
      </div>

      {idToShow != 0 && <DeleteExamDialog title={title} id={idToShow} />}
    </div>
  );
}

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

  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [loader, setLoader] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (otpValue) => {
    const invite_code = otpValue || otp.join("");

    if (invite_code.length !== 8) {
      showToast("Please fill all the fields with valid digits", "error");
      return;
    }

    setLoader(true);

    try {
      const response = await apiCall.post(`/exams/groups/join/${invite_code}/`);

      if (response.status === 201 || response.status === 200) {
        showToast(`You have joined the student group`, "success");
        await sleep(2000);
        dispatch(setShowJoinStudentGroupDialog(false));
        navigate("/dashboard");
      }
    } catch (error) {
      showToast("Failed to join group. Please try again.", "error");
      console.error("Error sending code:", error);
    } finally {
      setLoader(false);
    }
  };

  // useEffect(() => {
  //   dispatch(fetchStudentGroups());
  // }, [dispatch]);

  // const [search, setSearch] = useState("");
  // const [isJoining, setIsJoining] = useState("");

  // const filteredStudentGroups = allStudentGroups.filter((studentGroup) =>
  //   studentGroup.name.toLowerCase().includes(search.toLowerCase())
  // );

  // const joinGroup = async (studentGroupId) => {
  //   setIsJoining(studentGroupId);

  //   try {
  //     const response = await fetch(
  //       `${SERVER_URL}/exams/exam-rooms/${studentGroupId}/join/`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       showToast("Student group joined successfully", "success");
  //     } else {
  //       const errorData = await response.json();
  //       if (errorData.message) {
  //         showToast(errorData.message, "error");
  //       } else {
  //         showToast("Failed to join student group. Please try again.", "error");
  //         console.error("Error joining student group:", errorData);
  //       }
  //     }
  //   } catch (error) {
  //     showToast("Failed to join student group. Please try again.", "error");
  //     console.error("Error joining student group:", error);
  //   } finally {
  //     setIsJoining("");
  //   }
  // };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    // <ButtonDismissDialog
    //   open={isOpen}
    //   onOpenChange={(open) => dispatch(setShowJoinStudentGroupDialog(open))}
    // >
    //   <DialogHeader>
    //     <DialogTitle>Join a Student Group</DialogTitle>
    //   </DialogHeader>
    //   <DropdownMenuSeparator />
    //   <DialogContent className="p-4">
    //     <div className="w-full flex flex-col items-start justify-start">
    //       <h2 className="font-inter font-medium text-xl mb-4">
    //         Search for a student group to join
    //       </h2>
    //       <Input
    //         value={search}
    //         onChange={(e) => setSearch(e.target.value)}
    //         required
    //         placeholder="Enter query here"
    //         className="mb-4"
    //         id="examRoomName"
    //       />
    //       <p className="">Student Groups</p>
    //       <div className="max-h-[50dvh] overflow-y-auto w-full">
    //         {filteredStudentGroups.length === 0 ? (
    //           <p className="text-center text-neutral-mediumGray py-4">
    //             No Student Group found
    //           </p>
    //         ) : (
    //           <div className="space-y-3">
    //             {filteredStudentGroups.map((studentGroup) => (
    //               <div
    //                 className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary-bg"
    //                 key={studentGroup.id}
    //               >
    //                 <div className="flex items-center gap-3">
    //                   <div>
    //                     <h4 className="font-medium">{studentGroup.name}</h4>
    //                     <p className="text-xs text-neutral-mediumGray truncate">
    //                       {studentGroup.description}
    //                     </p>
    //                   </div>
    //                 </div>
    //                 <CustomButton
    //                   type="button"
    //                   onClick={() => joinGroup(studentGroup.id)}
    //                   disabled={isJoining !== ""}
    //                   className="w-[78px]"
    //                 >
    //                   {isJoining === studentGroup.id ? <Spinner /> : "Join"}
    //                 </CustomButton>
    //               </div>
    //             ))}
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </DialogContent>
    //   <Toast
    //     open={toast.open}
    //     message={toast.message}
    //     severity={toast.severity}
    //     onClose={closeToast}
    //   />
    // </ButtonDismissDialog>
    <OutsideDismissDialog
      open={isOpen}
      onOpenChange={setShowJoinStudentGroupDialog}
      maxWidth="600px"
    >
      <DialogHeader>
        <h2 className="text-xl whitespace-pre-line !text-center">
          Enter the code provided by the Teacher
        </h2>
      </DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent className="p-6">
        <div className="flex space-x-2 mx-auto items-center justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength="1"
              className="w-14 h-12 max-md:w-10 max-md:h-10 max-[330px]:w-1/6 max-[330px]:h-auto text-xl text-center border-2 rounded-md focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-main"
            />
          ))}
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

export const LeaveStudentGroupDialog = ({ title = "Student Group 2" }) => {
  const isOpen = useSelector((state) => state.ui.showLeaveStudentGroupDialog);
  const dispatch = useDispatch();

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
            <CustomButton variant="danger" className="gap-2 mt-4 flex-1">
              Leave Group
            </CustomButton>
          </div>
        </div>
      </DialogContent>
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
        <DialogTitle>Add Student to Student Group</DialogTitle>
      </DialogHeader>
      <DropdownMenuSeparator />
      <DialogContent className="p-4">
        <div className="w-full flex flex-col items-start justify-start">
          <h2 className="font-inter font-medium text-xl mb-4">
            Search for a student email and send the code
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
              className="mb-4"
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
