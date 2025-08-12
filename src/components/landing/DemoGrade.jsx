import { Label } from "../ui/Label";
import { Textarea } from "../ui/Input";
import CustomButton from "../ui/Button";
import { PiHexagonFill } from "react-icons/pi";
import { OutsideDismissDialog } from "../ui/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { setShowDemoDialog } from "../../features/reducers/uiSlice";
import { Badge } from "../ui/Badge";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/Collapsible";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { RenderFeedback } from "../RenderComponents";
import axios from "axios";
import Toast from "../modals/Toast";

const DemoGrade = () => {
  return (
    <div className="bg-primary-main w-full px-[5%] flex flex-col justify-center items-center py-[50px] relative">
      <PiHexagonFill
        color="white"
        className="w-[150px] h-[150px] opacity-10 absolute top-32 left-1/2 rotate-90"
      />
      <PiHexagonFill
        color="white"
        className="w-[150px] h-[150px] opacity-10 -left-16 absolute top-54 rotate-90"
      />
      <PiHexagonFill
        color="white"
        className="w-[150px] h-[150px] opacity-10 right-6 absolute bottom-4 rotate-90"
      />
      <h3 className="text-white text-[32px] font-medium">Test It Out</h3>
      <p className="text-white text-xs max-w-[500px] text-center leading-6">
        Try Acad AI right here. Enter a question, a student answer, and see how
        it gets graded - in seconds.
      </p>
      <GradeInputComponent />
    </div>
  );
};

const GradeInputComponent = () => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [formData, setFormData] = useState({
    question: "",
    studentAnswer: "",
    modelAnswer: "",
    strict: "true",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        "https://ai-v2-238741267770.us-central1.run.app/api/test-grade",
        formData
      );

      if (response.status === 201 || response.status === 200) {
        dispatch(
          setShowDemoDialog({
            willShow: true,
            result: {
              question: formData.question,
              studentAnswer: formData.studentAnswer,
              modelAnswer: formData.modelAnswer,
              response: response.data,
            },
          })
        );
      }
    } catch (error) {
      showToast("Failed to run test. Please try again.", "error");
      console.error("Error sending code:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <form
      className="bg-white w-full p-6 py-12 rounded-xl mt-12 flex flex-col items-center gap-10"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-wrap items-stretch gap-6">
        <div className="flex flex-1 min-w-[300px] flex-col justify-start items-start">
          <Label>Question</Label>
          <Textarea
            value={formData.question}
            onChange={handleChange("question")}
            placeholder="e.g What are the causes of climate change"
            className="w-full p-3 border-[1.5px] border-neutral-light rounded-md bg-transparent outline-none placeholder:text-neutral-light placeholder:text-sm focus:outline-none focus:border-primary-main resize-none"
            rows={2}
            required
          />
          <p className="text-xs text-neutral-new">
            The exam or assignment question you want to grade
          </p>
        </div>
        <div className="flex flex-1 min-w-[300px] flex-col justify-start items-start">
          <Label>Model Answer</Label>
          <Textarea
            value={formData.modelAnswer}
            onChange={handleChange("modelAnswer")}
            placeholder="e.g The main causes of climate change include..."
            className="w-full p-3 border-[1.5px] border-neutral-light rounded-md bg-transparent outline-none placeholder:text-neutral-light placeholder:text-sm focus:outline-none focus:border-primary-main resize-none"
            rows={4}
            required
          />
          <p className="text-xs text-neutral-new">
            An ideal or reference answer to compare against. Optional but helps
            improve grading
          </p>
        </div>
        <div className="flex flex-1 min-w-[300px] flex-col justify-start items-start">
          <Label>Student’s Answer</Label>
          <Textarea
            value={formData.studentAnswer}
            onChange={handleChange("studentAnswer")}
            placeholder="e.g I think climate change happens because of..."
            className="w-full p-3 border-[1.5px] border-neutral-light rounded-md bg-transparent outline-none placeholder:text-neutral-light placeholder:text-sm focus:outline-none focus:border-primary-main resize-none"
            rows={4}
            required
          />
          <p className="text-xs text-neutral-new">
            The student’s response to the question. This is what Acad AI will
            grade.
          </p>
        </div>
      </div>
      <div className="flex items-center flex-col justify-center">
        <CustomButton
          type="submit"
          loading={submitting}
          // onClick={() => dispatch(setShowDemoDialog(true))}
          className="h-[40px] w-[150px] !font-normal"
        >
          Grade Answer
        </CustomButton>
        <p className="text-center mt-3 text-sm text-neutral-new">
          Total mark for the question is 5.
        </p>
      </div>

      <GradeResultDialog />
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </form>
  );
};

const GradeResultDialog = () => {
  const isOpen = useSelector((state) => state.ui.showDemoDialog.willShow);
  const result = useSelector((state) => state.ui.showDemoDialog.result);
  console.log({ result });

  const [questionOpen, setQuestionOpen] = useState(true);
  const [modelAnswerOpen, setModelAnswerOpen] = useState(false);
  const [studentAnswerOpen, setStudentAnswerOpen] = useState(false);

  return (
    <OutsideDismissDialog
      maxWidth="900px"
      height="90vh"
      open={isOpen}
      onOpenChange={setShowDemoDialog}
    >
      <div className="w-full h-full overflow-auto hide-scrollbar p-6 space-y-4">
        <div className="">
          <h2 className="text-primary-main text-[18px] sm:text-[24px] font-semibold leading-10">
            Your Answer Has Been Graded!
          </h2>
          <p className="text-gray-600 text-sm">
            Here’s how Acad AI evaluated the response - including score,
            feedback, and rubric insight
          </p>
        </div>
        <div className="flex">
          <div className="flex sm:flex-row flex-col items-start sm:items-center w-full gap-2 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium text-sm sm:text-base">
                Total Score:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">75</span>
                <span className="text-gray-400">/2</span>
              </div>
            </div>
            {/* <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 ml-auto"
            >
              🟡 Partially Correct!
            </Badge> */}
          </div>
        </div>
        <Collapsible open={questionOpen} onOpenChange={setQuestionOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-t-lg hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">Question</span>
            {questionOpen ? (
              <FiChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <FiChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border border-gray-200 border-t-0 rounded-b-lg">
            <p className="text-gray-700 leading-relaxed">{result?.question}</p>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={modelAnswerOpen} onOpenChange={setModelAnswerOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-t-lg hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">Model Answer</span>
            {modelAnswerOpen ? (
              <FiChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <FiChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border border-gray-200 border-t-0 rounded-b-lg">
            <p className="text-gray-700 leading-relaxed">
              {result?.modelAnswer}
            </p>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={studentAnswerOpen}
          onOpenChange={setStudentAnswerOpen}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-t-lg hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">
              {"Student's Answer"}
            </span>
            {studentAnswerOpen ? (
              <FiChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <FiChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border border-gray-200 border-t-0 rounded-b-lg">
            <p className="text-gray-700 leading-relaxed">
              {result?.studentAnswer}
            </p>
          </CollapsibleContent>
        </Collapsible>
        <RenderFeedback
          feedback={
            "Genral Feedback:\n\nExcellent! Your answer perfectly matches the model answer. You correctly identified the name of the AI-powered educational platform. Keep up the great work!\n\nModel Answer: Edward is currently working on Acad AI.\n\nScore Breakdown:\nCriterion 1 - Provides a relevant point to every aspect of the question. - 0.2/0.2\nCriterion 2 - Is well explained with correct terminologies where applicable, and contains no incorrect, vague, or irrelevant points. - 1.0/1.0\nCriterion 3 - Closely matches the model answer or, if not provided, contains at least two strong and directly relevant points/ sentences. - 0.8/0.8"
          }
        />
      </div>
    </OutsideDismissDialog>
  );
};

export default DemoGrade;
