import { CustomButton } from "../ui/Button";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Input, Textarea } from "../ui/Input";
import { RadioGroup, RadioGroupItem } from "../ui/Radio";
import { Label } from "../ui/Label";
import { Badge } from "../ui/Badge";
import { formatDate } from "../modals/UIUtilities";

const CourseExamPreview = ({ examData, setPreview }) => {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{examData.name}</h1>
          <p className="text-gray-500 line-clamp-2 max-w-[400px]">
            {examData.description}
          </p>
        </div>
        <div className="flex space-x-3">
          <CustomButton variant="clear">Save to Draft</CustomButton>
          <CustomButton onClick={setPreview}>Done</CustomButton>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Add question:</span>
          <span className="text-primary-main font-medium">
            {examData.addQuestion.map((style) => style).join(", ")}
          </span>
          <span className="text-gray-500 ml-4">Question types:</span>
          <span className="text-primary-main font-medium">
            {examData.questionTypes.map((type) => String(type).trim()).join(", ")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Grading style:</span>
          <span className="text-primary-main font-medium">
            {examData.gradingStyle}
          </span>
          <span className="text-gray-500 ml-4">Schedule time:</span>
          <span className="text-primary-main font-medium">
            {examData.scheduleTime
              ? formatDate(examData.scheduleTime)
              : ""}
          </span>
          <span className="text-gray-500 ml-4">Due time:</span>
          <span className="text-primary-main font-medium">
            {examData.dueTime
              ? formatDate(examData.dueTime)
              : ""}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Number of Questions:</span>
          <span className="text-primary-main font-medium">{examData.questions.length}</span>
        </div>
      </div>

      {examData?.questions.length > 0 ? (
        <div className="space-y-6">
          {examData.questions.map((question) => (
            <QuestionCard
              key={question.id}
              type={question.type}
              marks={2}
              question={question.text}
              options={question.options?.map((option) => option.text)}
              questionType={question.type}
            />
          ))}
        </div>
      ) : (
        <div className="">
          <p className="">You have not created any questions</p>
        </div>
      )}
    </div>
  );
};

function QuestionCard({ type, marks, question, options, questionType }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <Badge className="text-sm text-[#A29A9A] bg-[#EEEEEE] rounded-[2px] font-medium">
            {type}
          </Badge>
          <Badge className="text-sm text-[#A29A9A] bg-[#EEEEEE] rounded-[2px] font-medium">
            {marks} marks
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <CustomButton variant="ghost" size="icon">
            <FiEdit className="h-4 w-4" />
          </CustomButton>
          <CustomButton variant="ghost" size="icon">
            <FiTrash2 className="h-4 w-4" />
          </CustomButton>
        </div>
      </div>
      <div className="p-4">
        <p className="mb-4">{question}</p>

        {questionType === "multiple-choice" && (
          <RadioGroup defaultValue="" className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={`option-${index + 1}`}
                  id={`option-${index + 1}`}
                />
                <Label htmlFor={`option-${index + 1}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {questionType === "cloze" && (
          <Input className="mt-4" placeholder="Short answer" />
        )}

        {questionType === "theory" && (
          <Textarea
            className="w-full p-2 border-b outline-none mt-2 resize-none border-black focus:outline-none focus:border-primary-main min-h-[70px]"
            placeholder="Long answer"
          />
        )}
      </div>
    </div>
  );
}

export default CourseExamPreview;
