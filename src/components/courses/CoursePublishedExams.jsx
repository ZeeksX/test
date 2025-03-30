import React from "react";
import { emptyFolderImg } from "../../utils/images";
import { CustomButton } from "../ui/Button";
import { FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowCreateNewExamination,
  setShowStudentGroupWarnDialog,
} from "../../features/reducers/uiSlice";
import { DialogTrigger } from "../ui/Dialog";
import { Loader } from "../ui/Loader";
import { ExaminationCard } from "./CourseComponents";
import { newFormatDate } from "../modals/UIUtilities";
import { useParams } from "react-router";

const CoursePublishedExams = () => {
  const { courseId } = useParams();
  const { hasStudentGroups } = useSelector((state) => state.examRooms);
  const { allExams, loading, error } = useSelector((state) => state.exams);
  const dispatch = useDispatch();

  if (loading) {
    return <Loader />;
  }

  if (allExams.length == 0) {
    return (
      <div className="w-full h-full gap-1 flex flex-col items-center justify-center">
        <img src={emptyFolderImg} alt="" />
        <h3 className="font-medium text-2xl">
          Your journey starts here! Add your first examination now.
        </h3>
        <h5 className="text-text-ghost font-normal text-sm">
          Set up a new examination with custom questions and settings.
        </h5>

        <DialogTrigger
          onClick={
            hasStudentGroups
              ? setShowCreateNewExamination
              : setShowStudentGroupWarnDialog
          }
        >
          <CustomButton className="gap-2 mt-2">
            Create Examination <FiPlus size={20} />
          </CustomButton>
        </DialogTrigger>
      </div>
    );
  }

  return (
    <div className="w-full h-full gap-1 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {allExams.map((exam) => (
          <ExaminationCard
            key={exam.id}
            title={exam.title}
            description={exam.description}
            id={exam.id}
            // dueTime={newFormatDate(exam.dueTime)}
          />
        ))}
      </div>
    </div>
  );
};

export default CoursePublishedExams;
