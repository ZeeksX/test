import { Label } from "@mui/icons-material";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import React from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardFormattedText,
} from "./ui/Card";

const QuestionDisplay = ({ question, number }) => {
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Question {number}</h2>
        <div className="flex items-center gap-2">
          <span>
            {question.points} / {question?.score}
          </span>
        </div>
      </div>
      <p className="text-gray-800">{question?.text}</p>

      {question?.type === "multiple-choice" && (
        <SubmissionRadioDisplay
          options={question.options}
          studentAnswer={question.studentAnswers[0].selectedOption}
        />
      )}

      {(question.type === "theory" || question.type === "cloze") && (
        <div className="">
          <CardContent className="!p-0">
            <div className="w-full h-3 border-b border-dashed"></div>
            <p className="font-semibold text-sm my-2">Correct Answer</p>
            <CardDescription className="whitespace-pre-wrap">
              {question.modelAnswer}
            </CardDescription>
            <div className="w-full h-3 border-b border-dashed"></div>
            <p className="font-semibold text-sm my-2">Student&apos;s Answer</p>
            <CardDescription className="whitespace-pre-wrap">
              {question.studentAnswers[0].answerText}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col gap-1 !p-0 !pt-4">
            <p className="font-semibold text-sm mb-2">AI Feedback</p>
            <CardDescription className="whitespace-pre-wrap">
              <CardFormattedText text={question.studentAnswers[0].AIFeedback} />
            </CardDescription>
          </CardFooter>
        </div>
      )}
    </div>
  );
};

export const SubmissionRadioDisplay = ({
  options,
  studentAnswer,
  ...props
}) => {
  return (
    <div className="flex mt-4 flex-col gap-4">
      <p className="font-bold">Options</p>
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex items-center cursor-pointer p-2 border rounded-md border-transparent ${
            option.id === studentAnswer?.id &&
            option.isCorrect &&
            "border-[#34A853] bg-[#CCFFDA]"
          } ${option.isCorrect && "border-[#34A853] bg-[#CCFFDA]"} ${
            option.id === studentAnswer?.id &&
            !option.isCorrect &&
            "border-[#EA4335] bg-[#FFC8C3]"
          }`}
        >
          <input
            type="radio"
            value={option.value}
            checked={option.isCorrect}
            className="hidden"
            disabled
            {...props}
          />
          <div
            className={`w-5 h-5 flex items-center justify-center border-2 rounded-full ${
              option.id === studentAnswer?.id &&
              option.isCorrect &&
              "border-[#34A853] bg-[#CCFFDA]"
            } ${option.isCorrect && "border-[#D0D5DD] bg-[#CCFFDA]"} ${
              option.id === studentAnswer?.id &&
              !option.isCorrect &&
              "border-[#EA4335] bg-[#FFC8C3]"
            }`}
          >
            {option.isCorrect && (
              <div className="w-3 h-3 bg-[#CCFFDA] rounded-full"></div>
            )}
            {option.id === studentAnswer?.id && !option.isCorrect && (
              <div className="w-3 h-3 bg-primary-brightRedHover rounded-full"></div>
            )}
          </div>
          <span className="ml-2 text-base w-full flex items-center justify-between">
            <p>{option.text}</p>{" "}
          </span>
        </label>
      ))}
    </div>
  );
};

export default QuestionDisplay;
