/* eslint-disable react/prop-types */
import { IoChevronBack } from "react-icons/io5";
import CustomButton from "../ui/Button";
import { Card } from "../ui/Card";
import {
  getQuestionTypeCount,
  getUniqueQuestionTypes,
} from "../modals/UIUtilities";
import { FiCalendar, FiClock, FiFileText, FiTarget } from "react-icons/fi";
import { LuTimer } from "react-icons/lu";
import { Badge } from "../ui/Badge";

export function ExamHeader({ title, onBack, onExport, onPublish, publishing }) {
  return (
    // <Card className="w-full bg-white rounded-xl">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="rounded-full w-8 hover:bg-[#EAECF0] bg-transparent flex items-center justify-center hover:text-primary-main"
            >
              <IoChevronBack size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <CustomButton
              className="gap-2 !bg-secondary-bg !text-black"
              onClick={onExport}
            >
              <FileExportIcon className="h-4 w-4" />
              Export Result
            </CustomButton>
            <CustomButton
              onClick={onPublish}
              loading={publishing}
              className="w-[100px] bg-blue-600 hover:bg-blue-700"
            >
              Publish
            </CustomButton>
          </div>
        </div>
      </div>
    // </Card>
  );
}

export function ExamInfoGrid({
  exam,
  questions,
  totalScore,
  startDateTime,
  endDateTime,
}) {
  const uniqueTypes = getUniqueQuestionTypes(questions);

  return (
    <div className="space-y-6 p-4 border-t">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <FiFileText className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-500">Exam Type</span>
            <p className="text-gray-900 font-medium">{exam.exam_type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FiFileText className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-500">Questions</span>
            <p className="text-gray-900 font-medium">
              {questions.length} questions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FiTarget className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-500">
              Total Score
            </span>
            <p className="text-gray-900 font-medium">{totalScore} marks</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <FiCalendar className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-500">
              Start Time
            </span>
            <p className="text-gray-900 font-medium">{startDateTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FiClock className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-500">Due Time</span>
            <p className="text-gray-900 font-medium">{endDateTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LuTimer className="w-5 h-5 text-gray-500" />
          <div>
            <span className="text-sm font-medium text-gray-500">Duration</span>
            <p className="text-gray-900 font-medium">{exam.duration} minutes</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <span className="text-sm font-medium text-gray-500 mb-3 block">
          Question Types
        </span>
        <div className="flex flex-wrap gap-2">
          {uniqueTypes.map((type) => {
            const count = getQuestionTypeCount(questions, type);
            return (
              <Badge key={type} variant="outline" className="capitalize">
                {type.replace("-", " ")}: {count}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function StudentGroupTabs({
  examRooms,
  activeStudentGroup,
  onGroupChange,
}) {
  if (!examRooms?.length) return null;

  return (
    <div className="mb-6 bg-transparent">
      <div className="w-full overflow-x-auto pt-4 flex flex-wrap gap-4 items-center">
        {examRooms.map((group) => (
          <button
            key={group.id}
            className="rounded-md flex overflow-hidden"
            onClick={() => onGroupChange(group.id)}
          >
            <div
              className={`p-2 px-3 text-sm ${
                activeStudentGroup === group.id
                  ? " text-white bg-primary-main"
                  : "text-black bg-white hover:bg-secondary-bg"
              }`}
            >
              {group.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FileExportIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M11 13v-1h2v1" />
      <path d="M11 16v1h2v-1" />
      <path d="M9 14h6" />
    </svg>
  );
}
