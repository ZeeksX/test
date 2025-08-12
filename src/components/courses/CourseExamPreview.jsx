import { CustomButton } from "../ui/Button";
import { FiCheck, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { Input, Textarea } from "../ui/Input";
import { RadioGroup, RadioGroupItem } from "../ui/Radio";
import { Label } from "../ui/Label";
import { Badge } from "../ui/Badge";
import { formatDate } from "../modals/UIUtilities";
import { useState } from "react";
import Toast from "../modals/Toast";

const CourseExamPreview = ({ examData, setPreview, updateExamData }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id);
    setEditingQuestion({ ...question });
  };

  const handleSaveQuestion = () => {
    const updatedQuestions = examData.questions.map((q) =>
      q.id === editingQuestionId ? editingQuestion : q
    );

    updateExamData({ questions: updatedQuestions });
    setEditingQuestionId(null);
    setEditingQuestion(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = examData.questions.filter(
      (q) => q.id !== questionId
    );

    if (examData.questions.length < 2) {
      showToast("You need to have at least one question", "error");
      return;
    }

    updateExamData({ questions: updatedQuestions });
  };

  const handleQuestionChange = (field, value) => {
    setEditingQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOptionChange = (optionIndex, value) => {
    const updatedOptions = editingQuestion.options.map((option, index) =>
      index === optionIndex ? { ...option, text: value } : option
    );
    setEditingQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{examData.name}</h1>
          <p className="text-gray-500 line-clamp-2 max-w-[400px]">
            {examData.examType}
          </p>
        </div>
        <div className="flex space-x-3">
          {/* <CustomButton variant="clear">Save to Draft</CustomButton> */}
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
            {examData.questionTypes
              .map((type) => String(type).trim())
              .join(", ")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Grading style:</span>
          <span className="text-primary-main font-medium">
            {examData.gradingStyle}
          </span>
          <span className="text-gray-500 ml-4">Schedule time:</span>
          <span className="text-primary-main font-medium">
            {examData.scheduleTime ? formatDate(examData.scheduleTime) : ""}
          </span>
          <span className="text-gray-500 ml-4">Due time:</span>
          <span className="text-primary-main font-medium">
            {examData.dueTime ? formatDate(examData.dueTime) : ""}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Number of Questions:</span>
          <span className="text-primary-main font-medium">
            {examData.questions.length}
          </span>
        </div>
      </div>

      {examData?.questions.length > 0 ? (
        <div className="space-y-6">
          {examData.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isEditing={editingQuestionId === question.id}
              editingQuestion={editingQuestion}
              onEdit={() => handleEditQuestion(question)}
              onSave={handleSaveQuestion}
              onCancel={handleCancelEdit}
              onDelete={() => handleDeleteQuestion(question.id)}
              onQuestionChange={handleQuestionChange}
              onOptionChange={handleOptionChange}
            />
          ))}
        </div>
      ) : (
        <div className="">
          <p className="">You have not created any questions</p>
        </div>
      )}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
};

function QuestionCard({
  question,
  isEditing,
  editingQuestion,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onQuestionChange,
  onOptionChange,
}) {
  const currentQuestion = isEditing ? editingQuestion : question;
  const marks = question.score || 2;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <Badge className="text-sm text-[#A29A9A] bg-[#EEEEEE] rounded-[2px] font-medium">
            {currentQuestion.type}
          </Badge>
          {isEditing ? (
            <Input
              value={currentQuestion.score}
              onChange={(e) => onQuestionChange("score", e.target.value)}
              // className="mb-4 w-full p-2 border rounded resize-none min-h-[60px]"
              placeholder="0"
            />
          ) : (
            <Badge className="text-sm text-[#A29A9A] bg-[#EEEEEE] rounded-[2px] font-medium">
              {marks} marks
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <CustomButton
                variant="ghost"
                size="icon"
                className="hover:!bg-green-600 hover:!text-white"
                onClick={onSave}
              >
                <FiCheck className="h-4 w-4 " />
              </CustomButton>
              <CustomButton
                variant="ghost"
                className="hover:!bg-red-600 hover:!text-white"
                size="icon"
                onClick={onCancel}
              >
                <FiX className="h-4 w-4" />
              </CustomButton>
            </>
          ) : (
            <>
              <CustomButton variant="ghost" size="icon" onClick={onEdit}>
                <FiEdit className="h-4 w-4" />
              </CustomButton>
              <CustomButton
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="hover:bg-red-600 hover:!text-white"
              >
                <FiTrash2 className="h-4 w-4" />
              </CustomButton>
            </>
          )}
        </div>
      </div>
      <div className="p-4">
        {isEditing ? (
          <Textarea
            value={currentQuestion.text}
            onChange={(e) => onQuestionChange("text", e.target.value)}
            className="mb-4 w-full p-2 border rounded resize-none min-h-[60px]"
            placeholder="Enter question text"
          />
        ) : (
          <p className="mb-4">{currentQuestion.text}</p>
        )}

        {currentQuestion.type === "multiple-choice" && (
          <div className="space-y-2">
            <RadioGroup>
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={`option-${index + 1}`}
                    id={`option-${index + 1}`}
                    disabled={isEditing}
                  />
                  {isEditing ? (
                    <Input
                      value={option.text}
                      onChange={(e) => onOptionChange(index, e.target.value)}
                      className="flex-1"
                      placeholder={`Option ${index + 1}`}
                    />
                  ) : (
                    <Label htmlFor={`option-${index + 1}`}>{option.text}</Label>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {currentQuestion.type === "cloze" &&
          (isEditing ? (
            <Textarea
              className="mb-4 w-full p-2 border rounded resize-none min-h-[60px]"
              placeholder="Short answer"
              onChange={(e) => onQuestionChange("modelAnswer", e.target.value)}
              value={currentQuestion.modelAnswer}
            />
          ) : (
            <Input
              className="mt-4"
              placeholder="Short answer"
              disabled
              value={currentQuestion.modelAnswer}
            />
          ))}

        {currentQuestion.type === "theory" &&
          (isEditing ? (
            <Textarea
              className="w-full p-3 border-[1.5px] rounded-md outline-none placeholder:text-text-placeholder focus:outline-none focus:border-primary-main resize-none"
              placeholder="Long answer"
              rows={4}
              onChange={(e) => onQuestionChange("modelAnswer", e.target.value)}
              value={currentQuestion.modelAnswer}
            />
          ) : (
            <Textarea
              className="w-full p-3 border-[1.5px] rounded-md outline-none placeholder:text-text-placeholder focus:outline-none focus:border-primary-main resize-none"
              rows={4}
              placeholder="Long answer"
              disabled
              value={currentQuestion.modelAnswer}
            />
          ))}
      </div>
    </div>
  );
}

export default CourseExamPreview;
