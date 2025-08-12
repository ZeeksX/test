/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { emptyFolderImg } from "../../utils/images";
import { CustomButton } from "../ui/Button";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowCreateNewExamination,
  setShowDeleteExamDialog,
  setShowStudentGroupWarnDialog,
} from "../../features/reducers/uiSlice";
import { DialogTrigger } from "../ui/Dialog";
import { Loader } from "../ui/Loader";
import { formatScheduleTime } from "../modals/UIUtilities";
import { Link, useParams } from "react-router";
import { fetchExamsforACourse } from "../../features/reducers/examSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/Dropdown";
import { DeleteExamDialog } from "./CourseComponents";
import { Input, Search } from "../ui/Input";

const CoursePublishedExams = () => {
  const { courseId } = useParams();
  const { hasStudentGroups } = useSelector((state) => state.examRooms);
  const { courseExams, loading, error } = useSelector((state) => state.exams);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchExamsforACourse({ courseId }));
  }, [dispatch, courseId]);

  const filteredExams = courseExams.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  if (courseExams.length == 0) {
    return (
      <div className="w-full h-full gap-1 flex flex-col items-center justify-center p-4">
        {/* ...empty state code */}
      </div>
    );
  }

  return (
    <div className="w-full h-full gap-1 p-4">
      {courseExams.length > 10 && (
        <div className="mb-4 flex justify-end">
          <Search
            placeholder="Search exams by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=""
          />
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        {[...filteredExams]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((exam) => (
            <ExaminationCard
              key={exam.id}
              title={exam.title}
              description={exam.exam_type}
              id={exam.id}
              studentGroups={exam.exam_rooms.length}
              dueTime={formatScheduleTime(exam.due_time)}
            />
          ))}
      </div>
    </div>
  );
};

export default CoursePublishedExams;

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
      className="bg-white border rounded-md w-full shadow-sm p-4 mb-4"
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
          <p className="text-sm font-medium text-primary-main">
            {studentGroups} Student Groups
          </p>
          <p className="text-sm text-gray-500">Due Date & Time - {dueTime}</p>
        </div>
      </div>
      <CustomButton
        as="link"
        to={`${id}/detail`}
        className="mt-4 ml-auto w-[150px]"
      >
        View Results
      </CustomButton>

      {idToShow != 0 && <DeleteExamDialog title={title} id={idToShow} />}
    </div>
  );
}
