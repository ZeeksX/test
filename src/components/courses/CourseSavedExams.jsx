import React from "react";
import { emptyFolderImg } from "../../utils/images";

const CourseSavedExams = () => {
  return (
    <div className="w-full h-full gap-1 flex flex-col items-center justify-center">
      <img src={emptyFolderImg} alt="" />
      <h3 className="font-medium text-2xl">
        Your have no Exams Saved to Draft
      </h3>
      <h5 className="text-text-ghost font-normal text-sm">
        Your saved drafts will appear here
      </h5>
    </div>
  );
};

export default CourseSavedExams;
