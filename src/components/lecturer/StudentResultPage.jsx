import { useState } from "react";
import { useParams } from "react-router";
import CustomButton from "../ui/Button";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import QuestionDisplay from "../QuestionDisplay";
import Pagination from "../ui/Pagination";

const StudentResultPage = () => {
  const { studentId } = useParams();
  const { studentResult, loading, error } = useSelector((state) => state.exams);
  const questions = studentResult?.exam?.questions;

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 1;

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions?.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const totalPages = Math.ceil(questions?.length / questionsPerPage);

  return (
    <div>
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {studentResult.student.last_name},{" "}
              {studentResult.student.other_names}
            </h1>
            <p className="text-gray-500">
              {studentResult.student.matric_number}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">Total Score:</span>
            <div className="flex items-center rounded-md">
              <span>{studentResult.totalScore} / 100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {currentQuestions?.map((question, index) => (
          <QuestionDisplay
            key={question.id}
            number={indexOfFirstQuestion + index + 1}
            question={question}
          />
        ))}
      </div>

      <div className="pb-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default StudentResultPage;
