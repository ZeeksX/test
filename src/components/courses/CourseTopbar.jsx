import { CustomButton } from "../ui/Button";
import { FiPlus } from "react-icons/fi";
import { LuFileDown } from "react-icons/lu";
import { DialogTrigger } from "../ui/Dialog";
import {
  setShowCreateNewExamination,
  setShowStudentGroupWarnDialog,
} from "../../features/reducers/uiSlice";
import { useSelector } from "react-redux";

const CourseTopbar = () => {
  const { course } = useSelector((state) => state.courses);

  const { hasStudentGroups } = useSelector((state) => state.examRooms);

  return (
    <div className="w-full px-5 py-2.5 flex items-center justify-between border-b">
      <h2 className="text-xl font-medium">
        {course.course_title} ({course.course_code})
      </h2>
      <div className="flex items-center justify-center gap-4">
        {/* <CustomButton variant={"ghost"} className="text-xs gap-2">
          Export File <LuFileDown size={20} />
        </CustomButton> */}
        <DialogTrigger
          onClick={
            hasStudentGroups
              ? setShowCreateNewExamination
              : setShowStudentGroupWarnDialog
          }
        >
          <CustomButton variant={"ghost"} className="text-xs gap-2">
            Create New Exam <FiPlus size={20} />
          </CustomButton>
        </DialogTrigger>
      </div>
    </div>
  );
};

export default CourseTopbar;
