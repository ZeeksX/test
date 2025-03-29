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

const CoursePublishedExams = () => {
  const { hasStudentGroups } = useSelector((state) => state.examRooms);
  const dispatch = useDispatch();

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
};

export default CoursePublishedExams;
