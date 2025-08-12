import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowCreateNewExamination,
  setShowPostExamWarningDialog,
} from "../../features/reducers/uiSlice";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { CustomButton } from "../ui/Button";
import { FiChevronDown, FiX } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Badge } from "../ui/Badge";
import {
  ManualCreateExamQuestion,
  MaterialCreateExamAddMaterial,
  MaterialCreateExamUpdateMetaData,
} from "../courses/CreateExamQuestion";
import { useParams } from "react-router";
import CourseExamPreview from "../courses/CourseExamPreview";
import Toast from "../modals/Toast";
import { fetchStudentGroups } from "../../features/reducers/examRoomSlice";
import { fetchExams } from "../../features/reducers/examSlice";
import DateTimeSelector from "../DateTimeSelector";
import {
  PostExamWarningDialog,
  PublishDraftExamWarningDialog,
} from "../modals/AuthModals";
import { CRITERIA_DATA } from "../../utils/constants";
import { fetchSavedExam } from "../../features/reducers/draftSlice";
import { Loader } from "../ui/Loader";
import { getStudentGroupsByIds, unMapQuestion } from "../modals/UIUtilities";
import { Switch } from "../ui/Switch";

const PublishDraftExams = () => {
  const { courseId, draftId } = useParams();
  const dispatch = useDispatch();

  const { teacherStudentGroups } = useSelector((state) => state.examRooms);
  const { teacherExams } = useSelector((state) => state.exams);
  const { savedExam, loading, error } = useSelector((state) => state.drafts);

  //   console.log(teacherStudentGroups, savedExam.exam_rooms)

  const [selectedQuestionMethod, setSelectedQuestionMethod] = useState("");
  const [examPreview, setExamPreview] = useState(false);

  const [isOpen, setIsOpen] = useState();
  const [currentStep, setCurrentStep] = useState(1);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [selectedGroups, setSelectedGroups] = useState([]);

  const [examData, setExamData] = useState({
    name: savedExam?.title || "",
    course: courseId,
    examType: "",
    description: "",
    scheduleTime: new Date(),
    dueTime: new Date(new Date().setHours(23, 59, 0, 0)),
    duration: 60,
    addQuestion: [],
    questionMethod: selectedQuestionMethod,
    questions: [],
    uploadedFiles: [],
    gradingStyle: "strict",
    numberOfQuestions: 45,
    questionTypes: [],
    studentGroups: [],
  });

  useEffect(() => {
    dispatch(fetchStudentGroups());
    dispatch(fetchExams());
    dispatch(fetchSavedExam({ id: draftId }));
  }, [dispatch, draftId]);

  useEffect(() => {
    if (savedExam?.questions.length > 0) {
      setSelectedQuestionMethod("manual");
    }

    if (savedExam?.exam_rooms.length > 0) {
      setSelectedGroups(
        getStudentGroupsByIds(teacherStudentGroups, savedExam?.exam_rooms)
      );
    }

    setExamData({
      //   ...examData,
      name: savedExam?.title || "",
      course: savedExam?.course || courseId,
      examType: savedExam?.exam_type || "",
      description: savedExam?.description || "",
      scheduleTime: savedExam?.schedule_time
        ? new Date(savedExam?.schedule_time)
        : new Date(),
      dueTime: savedExam?.due_time
        ? new Date(savedExam?.due_time)
        : new Date(new Date().setHours(23, 59, 0, 0)),
      duration: savedExam?.duration || 60,
      addQuestion: [],
      questionMethod: savedExam?.questions.length > 0 ? "manual" : "",
      questions: savedExam?.questions,
      uploadedFiles: [],
      gradingStyle: savedExam?.strict ? "strict" : "not-strict",
      numberOfQuestions: 45,
      questionTypes: [],
      studentGroups:
        savedExam?.exam_rooms.length > 0
          ? getStudentGroupsByIds(teacherStudentGroups, savedExam?.exam_rooms)
          : [],
    });
  }, [savedExam]);

  const handleNext = () => {
    if (
      currentStep === 1 &&
      (!examData.name.trim() || !examData.examType.trim())
    ) {
      showToast(
        "Please fill in an Exam name and type to move to the next step",
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
    const currentTime = new Date();
    const scheduleTime = new Date(examData.scheduleTime);
    const dueTime = new Date(examData.dueTime);

    if (currentStep === 4 && scheduleTime <= currentTime) {
      showToast("Schedule time must be in the future", "error");
      return;
    }

    if (currentStep === 4 && dueTime <= scheduleTime) {
      showToast("Due time must be after the schedule time", "error");
      return;
    }

    // console.log(examData);
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // const handleSkip = () => {
  //   handleNext();
  // };

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

  const toggleChange = () => {
    if (examData.gradingStyle === "strict") {
      setExamData({
        ...examData,
        gradingStyle: "not-strict",
      });
    } else {
      setExamData({
        ...examData,
        gradingStyle: "strict",
      });
    }
  };

  const addStudentGroup = (group) => {
    if (selectedGroups.length >= 3) {
      showToast("You can select a maximum of 3 student groups.", "error");
      return;
    }
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
      questions: JSON.parse(JSON.stringify(exam.questions)), // Deep clone
    });
    setSelectedExam(exam);
  };

  const updateExamData = (newData) => {
    setExamData({ ...examData, ...newData });
  };

  // const [submitting, setSubmitting] = useState(false);
  const handlePublish = async () => {
    if (currentStep === 5 && examData.studentGroups.length == 0) {
      showToast(
        "Please select at least one student group to publish an exam",
        "error"
      );
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const teacherId = user.teacherId;

    const body = {
      title: examData.name,
      exam_type: examData.examType,
      description: examData.description,
      schedule_time: new Date(examData.scheduleTime).toISOString(),
      status: "Scheduled",
      due_time: new Date(examData.dueTime).toISOString(),
      duration: examData.duration,
      questions: unMapQuestion(examData.questions),
      source_file: "",
      strict: examData.gradingStyle === "strict",
      course: courseId,
      teacher: teacherId,
      exam_rooms: examData.studentGroups.map((group) => group.id),
      // course_id: courseId,
      // teacher_id: teacherId,
      // exam_room_ids: examData.studentGroups.map((group) => group.id),
    };

    dispatch(setShowPostExamWarningDialog({ willShow: true, exam: body }));
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  if (loading.savedExam) {
    return <Loader />;
  }

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
                          ? "bg-primary-main text-white"
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
                      ? "text-primary-main"
                      : 1 < currentStep
                      ? "text-green-500"
                      : "text-gray-200"
                  }`}
                >
                  What is this
                  <br />
                  Exam About
                </div>
                <div
                  className={`text-xs w-[80px]  ${
                    currentStep === 2
                      ? "text-primary-main"
                      : 2 < currentStep
                      ? "text-green-500"
                      : "text-gray-200"
                  }`}
                >
                  Add
                  <br />
                  Questions
                </div>
                <div
                  className={`text-xs w-[80px] ${
                    currentStep === 3
                      ? "text-primary-main"
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
                      ? "text-primary-main"
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
                      ? "text-primary-main"
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
                      {currentStep === 1 && "What is this Exam About"}
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
                        <Select
                          value={examData.examType}
                          onValueChange={(value) =>
                            handleSelectChange("examType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select the Exam Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Quiz">Quiz</SelectItem>
                            <SelectItem value="Mid Semester">
                              Mid Semester
                            </SelectItem>
                            <SelectItem value="Exam">Exam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="flex gap-1">
                          Description <p className="opacity-80">(Optional)</p>
                        </Label>
                        <textarea
                          id="description"
                          name="description"
                          placeholder="Describe the exam to your students in your own way. (E.g: First Semester Examination)"
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
                            Select a method to add questions to this exam
                          </p>

                          <div className="space-y-4">
                            {/* Create exam with material */}
                            <MaterialCreateExamAddMaterial
                              examData={examData}
                              updateExamData={updateExamData}
                              setSelectedQuestionMethod={() =>
                                setSelectedQuestionMethod("upload")
                              }
                            />

                            {/* Create exam manually */}
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
                                {/* <FiChevronRight className="h-5 w-5 text-gray-400" /> */}
                              </div>
                            </div>

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
                                {/* <FiChevronRight className="h-5 w-5 text-gray-400" /> */}
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
                            Strict Grading style
                          </Label>
                          <div className="flex space-x-2">
                            <Switch
                              checked={examData.gradingStyle === "strict"}
                              onCheckedChange={() => toggleChange()}
                            />
                            {/* <CustomButton
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
                            </CustomButton> */}
                          </div>
                        </div>
                      </div>

                      <div className="w-full">
                        <div className="mb-1">
                          <div className="w-full flex items-center justify-between">
                            More Details
                            <button
                              onClick={() => setIsOpen(!isOpen)}
                              className="p-2 rounded-full bg-neutral-ghost hover:bg-text-placeholder"
                            >
                              <FiChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                  isOpen ? "rotate-180 transform" : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="content"
                              initial="collapsed"
                              animate="open"
                              exit="collapsed"
                              variants={{
                                open: { opacity: 1, height: "auto" },
                                collapsed: { opacity: 0, height: 0 },
                              }}
                              transition={{
                                duration: 0.3,
                                ease: [0.04, 0.62, 0.23, 0.98],
                              }}
                            >
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                  Grading Style Comparison
                                </h3>

                                <div className="hidden lg:block">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b border-gray-200">
                                          <th className="text-left py-3 px-3 font-medium text-gray-600 min-w-[200px]">
                                            Criteria
                                          </th>
                                          <th className="text-center py-3 px-3 font-medium text-primary-main min-w-[120px]">
                                            Not Strict
                                          </th>
                                          <th className="text-center py-3 px-3 font-medium text-red-600 min-w-[120px]">
                                            Strict
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-200">
                                        {CRITERIA_DATA.map(
                                          (criteria, index) => (
                                            <tr key={index}>
                                              <td className="py-4 px-3 text-gray-700">
                                                <div>
                                                  <div className="font-medium mb-1">
                                                    {criteria.title}
                                                  </div>
                                                  <div className="text-xs text-gray-500">
                                                    {criteria.description}
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="text-center py-4 px-3">
                                                <div className="space-y-2">
                                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {(
                                                      criteria.lenientWeight *
                                                      100
                                                    ).toFixed(0)}
                                                    % weight
                                                  </span>
                                                  <div className="text-xs text-gray-600 max-w-[150px] mx-auto">
                                                    {criteria.lenientDesc}
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="text-center py-4 px-3">
                                                <div className="space-y-2">
                                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {(
                                                      criteria.strictWeight *
                                                      100
                                                    ).toFixed(0)}
                                                    % weight
                                                  </span>
                                                  <div className="text-xs text-gray-600 max-w-[150px] mx-auto">
                                                    {criteria.strictDesc}
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                <div className="lg:hidden space-y-4">
                                  {CRITERIA_DATA.map((criteria, index) => (
                                    <div
                                      key={index}
                                      className="border border-gray-200 rounded-lg p-4 bg-white"
                                    >
                                      <div className="mb-3">
                                        <h4 className="font-medium text-gray-800 text-sm">
                                          {criteria.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {criteria.description}
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-primary-main">
                                              Not Strict
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                              {(
                                                criteria.lenientWeight * 100
                                              ).toFixed(0)}
                                              %
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-600">
                                            {criteria.lenientDesc}
                                          </p>
                                        </div>

                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-red-600">
                                              Strict
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                              {(
                                                criteria.strictWeight * 100
                                              ).toFixed(0)}
                                              %
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-600">
                                            {criteria.strictDesc}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
                                    <div className="space-y-1">
                                      <p className="font-medium text-primary-main">
                                        Not Strict Approach:
                                      </p>
                                      <p>
                                        More forgiving, focuses on relevance and
                                        basic structure. Encourages
                                        participation and understanding.
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="font-medium text-red-600">
                                        Strict Approach:
                                      </p>
                                      <p>
                                        Emphasizes precision, terminology, and
                                        close alignment with expected answers.
                                        Rigorous assessment.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* <div className="pt-4">
                        <button
                          className="text-primary-main p-1 flex font font-medium gap-2 items-center justify-center hover:underline"
                          onClick={handleSkip}
                        >
                          Skip <FiChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div> */}
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
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
                    <div className="flex w-full justify-end gap-6 mt-8">
                      {currentStep === 1 ? (
                        <CustomButton
                          variant="clear"
                          as="link"
                          className="w-1/5 mr-auto"
                          to={-1}
                        >
                          Cancel
                        </CustomButton>
                      ) : (
                        <CustomButton
                          variant="clear"
                          className="w-1/5 mr-auto"
                          onClick={handleBack}
                        >
                          Previous
                        </CustomButton>
                      )}

                      {currentStep === 5 ? (
                        <div className="flex gap-3 ml-auto">
                          {/* <CustomButton
                            variant="ghost"
                            className="w-1/3"
                            // onClick={() => handlePublish()}
                          >
                            Draft
                          </CustomButton> */}
                          <CustomButton
                            // variant="ghost"
                            className="w-1/2"
                            onClick={() => setExamPreview(true)}
                          >
                            Preview
                          </CustomButton>
                          <CustomButton
                            // loading={submitting}
                            // variant="ghost"
                            className="w-1/2"
                            onClick={() => handlePublish()}
                            // onClick={() => dispatch(setShowPostExamWarningDialog({willShow: true, exam: }))}
                          >
                            Publish
                          </CustomButton>
                        </div>
                      ) : (
                        <CustomButton
                          className="bg-primary-main hover:bg-blue-700"
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

      <PublishDraftExamWarningDialog setExamData={setExamData} />
    </div>
  );
};

export default PublishDraftExams;
