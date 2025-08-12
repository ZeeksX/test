import { useEffect, useState } from "react";
import { Input, Textarea } from "../ui/Input";
import { CustomButton } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Checkbox } from "../ui/Checkbox";
import {
  FiAlertCircle,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiCopy,
  FiHelpCircle,
  FiMinus,
  FiPlus,
  FiTrash,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { Label } from "../ui/Label";
import { iconDocx, iconPdf, iconPptx } from "../../utils/images";
import apiCall from "../../utils/apiCall";
import Toast from "../modals/Toast";
import { RadioGroup } from "../ui/Radio";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import { useDispatch } from "react-redux";
import { fetchUserCredits } from "../../features/reducers/userSlice";
import { mapQuestions, unMapQuestion } from "../modals/UIUtilities";

export const ManualCreateExamQuestion = ({
  examData,
  updateExamData,
  setSelectedQuestionMethod,
  currentStep,
  style = "manually",
  setCurrentStep,
  setPreviousStep,
}) => {
  const [isOpen, setIsOpen] = useState();
  const [questions, setQuestions] = useState([
    {
      id: "1",
      type: "theory",
      text: "",
      score: 2,
      modelAnswer: "",
    },
  ]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (examData.questions && examData.questions.length > 0) {
      setQuestions([...mapQuestions(examData.questions)]);
    } else {
      setQuestions([
        {
          id: "1",
          type: "theory",
          text: "",
          score: 2,
          modelAnswer: "",
        },
      ]);
    }
  }, [examData.questions]);

  // console.log(questions)

  const [activeQuestion, setActiveQuestion] = useState(0);

  const addQuestion = () => {
    const newQuestion = {
      id: `${questions.length + 1}`,
      type: "theory",
      score: 2,
      text: "",
      modelAnswer: "",
    };
    setQuestions([...questions, newQuestion]);
    setActiveQuestion(questions.length);
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = questions[index];
    const duplicatedQuestion = {
      ...JSON.parse(JSON.stringify(questionToDuplicate)),
      id: `${questions.length + 1}`,
    };

    // Update option IDs in the duplicated question if it has options
    if (duplicatedQuestion.options) {
      duplicatedQuestion.options = duplicatedQuestion.options.map((opt, i) => ({
        ...opt,
        id: `q${questions.length + 1}_opt${i + 1}`,
      }));
    }

    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, duplicatedQuestion);
    setQuestions(newQuestions);
    setActiveQuestion(index + 1);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) {
      setQuestions([
        {
          id: "1",
          type: "theory",
          text: "",
          score: 2,
          modelAnswer: "",
        },
      ]);
      setActiveQuestion(0);
      return;
    }

    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    setActiveQuestion(Math.min(index, newQuestions.length - 1));
  };

  const updateQuestionType = (type, index) => {
    const newQuestions = [...questions];
    newQuestions[index].type = type;

    // Reset options if changing to cloze or theory
    if (type === "cloze" || type === "theory") {
      newQuestions[index].options = [];
      // Initialize modelAnswer for theory and cloze if it doesn't exist
      if (!newQuestions[index].modelAnswer) {
        newQuestions[index].modelAnswer = "";
      }
    } else if (type === "multiple-choice") {
      // Add default options if changing to multiple-choice
      newQuestions[index].options = [
        { id: `q${index + 1}_opt1`, text: "", isCorrect: true },
        { id: `q${index + 1}_opt2`, text: "", isCorrect: false },
      ];
      // Remove modelAnswer for multiple-choice
      delete newQuestions[index].modelAnswer;
    }

    setQuestions(newQuestions);
  };

  const updateQuestionText = (text, index) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const updateQuestionScore = (score, index) => {
    const newQuestions = [...questions];
    newQuestions[index].score = parseInt(score);
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    const newOptionId = `q${questionIndex + 1}_opt${
      newQuestions[questionIndex].options.length + 1
    }`;
    newQuestions[questionIndex].options.push({
      id: newOptionId,
      text: "",
      isCorrect: false,
    });
    setQuestions(newQuestions);
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];

    if (newQuestions[questionIndex].options.length <= 2) {
      return;
    }

    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const updateOptionText = (text, questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = text;
    setQuestions(newQuestions);
  };

  const toggleOptionCorrect = (questionIndex, optionIndex) => {
    const newQuestions = questions.map((q, idx) =>
      idx === questionIndex
        ? {
            ...q,
            options: q.options.map((option, idx2) => ({
              ...option,
              isCorrect: idx2 === optionIndex,
            })),
          }
        : q
    );

    setQuestions(newQuestions);
  };

  const updateModelAnswer = (text, index) => {
    const newQuestions = [...questions];
    newQuestions[index].modelAnswer = text;
    setQuestions(newQuestions);
  };

  const handleFinishSetQuestion = () => {
    if (questions.length >= 1) {
      const validationErrors = [];

      questions.forEach((question, index) => {
        const questionNumber = index + 1;

        if (!question.text || question.text.trim() === "") {
          validationErrors.push(
            `Question ${questionNumber}: Question text is required`
          );
        }

        if (!question.score || question.score == 0) {
          validationErrors.push(
            `Question ${questionNumber}: Question score is missing or is 0`
          );
        }

        if (question.type === "multiple-choice") {
          if (!question.options || question.options.length === 0) {
            validationErrors.push(
              `Question ${questionNumber}: Multiple-choice questions must have options`
            );
          } else {
            const hasCorrectOption = question.options.some(
              (option) => option.isCorrect
            );
            if (!hasCorrectOption) {
              validationErrors.push(
                `Question ${questionNumber}: At least one option must be marked as correct`
              );
            }

            question.options.forEach((option, optIndex) => {
              if (!option.text || option.text.trim() === "") {
                validationErrors.push(
                  `Question ${questionNumber}, Option ${
                    optIndex + 1
                  }: Option text is required`
                );
              }
            });
          }
        } else if (question.type === "theory" || question.type === "cloze") {
          if (!question.modelAnswer || question.modelAnswer.trim() === "") {
            validationErrors.push(
              `Question ${questionNumber}: Correct answer is required for ${question.type} questions`
            );
          }
        }
      });

      if (validationErrors.length > 0) {
        showToast(
          "Please fix the following issues:\n\n" + validationErrors.join("\n"),
          "error"
        );
        return;
      }

      const uniqueQuestionTypes = [...new Set(questions.map((q) => q.type))];
      const questionStyle = [style];

      console.log({
        questions: [...questions],
        questionTypes: [uniqueQuestionTypes],
        addQuestion: [...questionStyle],
      })

      updateExamData({
        questions: [...questions],
        questionTypes: [uniqueQuestionTypes],
        addQuestion: [...questionStyle],
      });

      setCurrentStep();
    }
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="mb-4">
          <Input
            name="name"
            placeholder="Exam Name"
            value={examData.name}
            onChange={(e) => updateExamData({ name: e.target.value })}
            className="text-3xl placeholder:text-3xl font-bold border-none !p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Input
            name="description"
            placeholder="Exam Description"
            value={examData.examType}
            onChange={(e) => updateExamData({ examType: e.target.value })}
            className="text-gray-500 border-none !p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex justify-end mb-4 ml-auto space-x-2">
          <CustomButton variant="clear" onClick={setPreviousStep}>
            Previous
          </CustomButton>
          <CustomButton onClick={() => handleFinishSetQuestion()}>
            Save Questions
          </CustomButton>
        </div>
      </div>
      <div className="space-y-8 max-w-2xl mx-auto p-4 !px-0">
        {questions.map((question, questionIndex) => (
          <div className="border p-4 rounded-md !relative" key={questionIndex}>
            {/* <CustomButton
              type="button"
              variant="clear"
              size="icon"
              onClick={() => deleteQuestion(questionIndex)}
              className="!absolute top-0 left-full ml-2"
            >
              <FiMinus className="h-4 w-4" />
            </CustomButton> */}
            <h2 className="mb-4 font-bold text-xl">
              Question {questionIndex + 1}
            </h2>

            <div className="my-4 flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <Label className="mb-1">Question Type</Label>
                <Select
                  value={questions[questionIndex]?.type}
                  onValueChange={(value) =>
                    updateQuestionType(value, questionIndex)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theory">Theory</SelectItem>
                    <SelectItem value="multiple-choice">
                      Multiple-choice
                    </SelectItem>
                    <SelectItem value="cloze">Fill in the gaps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`marks-${questionIndex}`} className="mb-1">
                  Maximum Score
                </Label>
                <Input
                  id="questionScore"
                  name="score"
                  type="number"
                  placeholder="0"
                  topClassName="!w-[200px]"
                  value={questions[questionIndex].score}
                  onChange={(e) =>
                    updateQuestionScore(e.target.value, questionIndex)
                  }
                />
              </div>
            </div>

            <Textarea
              placeholder={`Enter question text`}
              rows={3}
              value={questions[questionIndex].text}
              onChange={(e) =>
                updateQuestionText(e.target.value, questionIndex)
              }
              required
              maxLength={250}
              className="w-full p-3 border-[1.5px] rounded-md outline-none placeholder:text-text-placeholder focus:outline-none focus:border-primary-main resize-none"
            />

            {questions[questionIndex].type === "multiple-choice" && (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Select all correct options.
                </p>

                {questions[questionIndex].options.map((option, optionIndex) => (
                  <div key={option.id} className="flex items-center mb-4">
                    <Checkbox
                      id={option.id}
                      checked={option.isCorrect}
                      onCheckedChange={() =>
                        toggleOptionCorrect(questionIndex, optionIndex)
                      }
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Option {optionIndex + 1}
                      </label>
                      <Input
                        placeholder="Enter option here"
                        value={option.text}
                        onChange={(e) =>
                          updateOptionText(
                            e.target.value,
                            questionIndex,
                            optionIndex
                          )
                        }
                      />
                    </div>
                    {questions[questionIndex].options.length > 2 && (
                      <button
                        onClick={() => deleteOption(questionIndex, optionIndex)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete option"
                      >
                        <FiTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                <CustomButton
                  variant="clear"
                  size="sm"
                  className="mt-2 !text-sm !font-medium"
                  onClick={() => addOption(questionIndex)}
                >
                  <FiPlus className="h-4 w-4 mr-2" />
                  Add option
                </CustomButton>
              </>
            )}

            {questions[questionIndex].type === "cloze" && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Correct answer
                </label>
                <Input
                  placeholder="Short answer"
                  value={questions[questionIndex].modelAnswer || ""}
                  onChange={(e) =>
                    updateModelAnswer(e.target.value, questionIndex)
                  }
                />
              </div>
            )}

            {questions[questionIndex].type === "theory" && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Correct answer
                </label>
                <Textarea
                  placeholder="Long answer"
                  value={questions[questionIndex].modelAnswer || ""}
                  onChange={(e) =>
                    updateModelAnswer(e.target.value, questionIndex)
                  }
                  // className="w-full p-2 border-b outline-none mt-2 resize-none border-black focus:outline-none focus:border-primary-main min-h-[70px]"
                  className="w-full p-3 border-[1.5px] rounded-md outline-none placeholder:text-text-placeholder focus:outline-none focus:border-primary-main resize-none"
                  rows="5"
                />
              </div>
            )}

            <div className="flex justify-end mt-6 space-x-4">
              <button
                size="sm"
                className="!text-sm flex p-2 text-primary-main !font-medium"
                onClick={() => duplicateQuestion(questionIndex)}
              >
                <FiCopy className="h-4 w-4 mr-2" />
                Duplicate
              </button>
              <button
                size="sm"
                className="!text-sm flex p-2 text-primary-danger !font-medium"
                onClick={() => deleteQuestion(questionIndex)}
              >
                <FiTrash className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}

        <CustomButton variant="clear" className="w-full" onClick={addQuestion}>
          <FiPlus className="h-4 w-4 mr-2" />
          Add new question
        </CustomButton>
        <CustomButton
          className="w-full"
          onClick={() => handleFinishSetQuestion()}
        >
          Save Questions
        </CustomButton>
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
};

export const MaterialCreateExamUpdateMetaData = ({
  examData,
  updateExamData,
  setSelectedQuestionMethod,
  currentStep,
  setCurrentStep,
  setPreviousStep,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (!examData.questionTypes.includes("theory")) {
      updateExamData({
        questionTypes: [...examData.questionTypes, "theory"],
      });
    }
  }, []);

  const handleQuestionTypeChange = (type) => {
    const currentTypes = [...examData.questionTypes];
    if (currentTypes.includes(type)) {
      updateExamData({
        questionTypes: currentTypes.filter((t) => t !== type),
      });
    } else {
      updateExamData({
        questionTypes: [...currentTypes, type],
      });
    }
  };

  const handleCancel = () => {
    updateExamData({ questionTypes: [] });
    updateExamData({ uploadedFiles: [] });
    setSelectedQuestionMethod();
  };

  const handleDone = async () => {
    if (!examData.uploadedFiles[0]?.file) {
      console.error("No file selected");
      return;
    }

    if (examData.numberOfQuestions > 60) {
      showToast("You cannot create more than 60 questions", "error");
      return;
    }

    const questionTypes = examData.questionTypes;
    const numQuestions = examData.numberOfQuestions;

    try {
      // console.log({
      //   uploadedFiles: examData.uploadedFiles[0]?.file,
      //   questionTypes,
      //   numQuestions,
      // });

      const result = await uploadFile(
        examData.uploadedFiles[0]?.file,
        questionTypes,
        numQuestions
      );

      // console.log({ result });

      updateExamData({
        questions: mapQuestions(result.questions),
        examCreationMethod: "material",
      });
      await dispatch(fetchUserCredits()).unwrap();
      showToast("Your questions have been generated", "success");
      // setTimeout(() => {
      //   setSelectedQuestionMethod();
      // }, 2000);
    } catch (error) {
      if (error.status == 400) {
        showToast(
          error.response?.data?.error ||
            "Failed to generate questions. Please try again.",
          "error"
        );
      } else {
        showToast("Failed to generate questions. Please try again.", "error");
      }
      console.error("Upload error:", error);
    }
  };

  const uploadFile = async (file, questionTypes, numQuestions) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("question_types", JSON.stringify(questionTypes));
      formData.append("total_questions", numQuestions);

      const response = await apiCall.post(
        "/exams/generate_questions/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  if (examData.questions.length > 0) {
    return (
      <ManualCreateExamQuestion
        examData={examData}
        updateExamData={updateExamData}
        setSelectedQuestionMethod={() => setSelectedQuestionMethod("")}
        currentStep={currentStep}
        style="uploaded material"
        setCurrentStep={() => setCurrentStep()}
        setPreviousStep={() => setPreviousStep()}
      />
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-start">
        <div className="mb-4 w-full">
          <Input
            name="name"
            placeholder="Exam Name"
            value={examData.name}
            onChange={(e) => updateExamData({ name: e.target.value })}
            className="text-3xl placeholder:text-3xl font-bold mb-1 border-none !p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Input
            name="description"
            disabled
            value={examData.examType}
            onChange={(e) => updateExamData({ examType: e.target.value })}
            className="text-gray-500 border-none !p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-medium mb-4">Question Types</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center flex-1 justify-start space-x-2">
                <Checkbox
                  id="mcq"
                  checked={examData?.questionTypes?.includes("mcq")}
                  onCheckedChange={() => handleQuestionTypeChange("mcq")}
                />
                <Label htmlFor="mcq">Single/Multiple Choice</Label>
              </div>
              <div className="flex items-center flex-1 justify-start space-x-2">
                <Checkbox
                  id="cloze"
                  checked={examData?.questionTypes?.includes("cloze")}
                  onCheckedChange={() => handleQuestionTypeChange("cloze")}
                />
                <Label htmlFor="cloze">Fill in the gaps</Label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="theory"
                checked={examData?.questionTypes?.includes("theory")}
                onCheckedChange={() => handleQuestionTypeChange("theory")}
              />
              <Label htmlFor="theory">Theory</Label>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Number of Questions</h2>
          <Input
            id="examName"
            name="numberOfQuestions"
            type="number"
            max={60}
            placeholder="Examination 1"
            value={examData.numberOfQuestions}
            onChange={(e) =>
              updateExamData({ numberOfQuestions: e.target.value })
            }
          />
        </div>
        <div className="flex mt-4 w-full justify-between">
          <CustomButton variant="clear" onClick={() => handleCancel()}>
            Cancel
          </CustomButton>
          <div className="flex gap-3">
            {/* <TooltipProvider>
              <button
                disabled
                className="px-4 py-2 rounded flex items-center gap-2 border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <span className="font-medium text-sm md:block hidden">
                  Total Cost: {examData.numberOfQuestions / 5} Credit(s)
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
                      This is the amount of credit that will be deducted to
                      generate your questions.
                    </p>
                    <p className="text-sm">
                      You can generate 5 questions with one credit
                    </p>
                  </TooltipContent>
                </Tooltip>
              </button>
            </TooltipProvider> */}
            <CustomButton
              disabled={isUploading}
              loading={isUploading}
              onClick={() => handleDone()}
              className="w-[200px]"
            >
              Generate Questions
            </CustomButton>
          </div>
        </div>
        <TooltipProvider>
          <button
            disabled
            className="w-full px-4 py-2 rounded flex items-center justify-between mt-4 gap-2 border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <span className="font-medium text-sm">
              {/* Total Cost: {Math.ceil(examData.numberOfQuestions / 5)} Credit(s) */}
              Total Cost: {examData.numberOfQuestions / 5} Credit(s)
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
                  This is the amount of credit that will be deducted to generate
                  your questions.
                </p>
                <p className="text-sm">
                  You can generate 5 questions with one credit
                </p>
              </TooltipContent>
            </Tooltip>
          </button>
        </TooltipProvider>
      </div>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
};

export const MaterialCreateExamAddMaterial = ({
  examData,
  updateExamData,
  setSelectedQuestionMethod,
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState(null);

  // 5MB in bytes
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  useEffect(() => {
    if (uploadedFile) {
      updateExamData({
        uploadedFiles: [uploadedFile],
        addQuestion: examData.addQuestion.includes("upload")
          ? examData.addQuestion
          : [...examData.addQuestion, "upload"],
      });
    } else {
      updateExamData({
        uploadedFiles: [],
        addQuestion: examData.addQuestion.filter((style) => style !== "upload"),
      });
    }
  }, [uploadedFile]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Clear any previous errors
    setFileError(null);

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError(
        `File size exceeds 5MB limit. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB.`
      );
      return;
    }

    // Check file type
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setFileError("Only PDF and DOCX files are supported.");
      return;
    }

    setUploadingFile({
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      type: file.type,
      progress: 0,
      status: "uploading",
    });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadingFile((prev) => ({ ...prev, progress }));
      if (progress >= 100) {
        clearInterval(interval);
        setUploadingFile(null);
        setUploadedFile({
          file,
          name: file.name,
          size: Math.round(file.size / 1024),
          type: file.type,
          status: "completed",
        });
      }
    }, 300);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileError(null);
    updateExamData({ uploadedFiles: [] });
  };

  const clearError = () => {
    setFileError(null);
  };

  const fileIcons = {
    "application/pdf": iconPdf,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      iconPptx,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      iconDocx,
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium">Upload file</h3>
          <p className="text-sm text-gray-500">
            Upload your teaching notes, specify the type and number of
            questions, edit your questions
          </p>
        </div>
        {/* <FiChevronRight className="h-5 w-5 text-gray-400" /> */}
      </div>

      <div
        className={`mt-4 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-center">
          Drag & Drop or{" "}
          <label className="text-blue-600 cursor-pointer">
            Choose File
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
          </label>{" "}
          to upload
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Only PDF & DOCX are supported (Max 5MB)
        </p>
      </div>

      {fileError && (
        <div className="mt-4 border border-red-300 bg-red-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiAlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{fileError}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {uploadingFile && (
        <div className="mt-4 border rounded-lg p-3">
          <div className="flex items-center">
            <img src={fileIcons[uploadingFile.type]} alt="" />
            <div className="ml-3 flex-grow">
              <p className="text-sm font-medium">{uploadingFile.name}</p>
              <p className="text-xs text-gray-500">{uploadingFile.size}</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${uploadingFile.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadedFile && (
        <div className="mt-4 border rounded-lg p-3">
          <div className="flex items-center">
            <img src={fileIcons[uploadedFile.type]} alt="" />
            <div className="ml-3 flex-grow">
              <p className="text-sm font-medium">{uploadedFile.name}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{uploadedFile.size} KB</p>
                <button className="text-red-500" onClick={removeFile}>
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadedFile && (
        <div className="w-full pt-4 flex items-center justify-end">
          <CustomButton onClick={setSelectedQuestionMethod}>
            Generate Questions
          </CustomButton>
        </div>
      )}
    </div>
  );
};
