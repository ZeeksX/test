import React, { useEffect } from "react";
import { emptyFolderImg } from "../../utils/images";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../ui/Loader";
import { fetchSavedExams } from "../../features/reducers/draftSlice";
import { SavedExamsCard } from "../drafts/DraftComponents";

const CourseSavedExams = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();

  const { savedExams, loading, error } = useSelector((state) => state.drafts);

  useEffect(() => {
    dispatch(fetchSavedExams({ courseId }));
  }, [dispatch, courseId]);

  if (loading.savedExams) {
    return <Loader />;
  }

  // if (error.savedExams) {
  //   console.log(error.savedExams);
  //   // return <Loader />;
  // }

  if (savedExams.length == 0) {
    return (
      <div className="w-full h-full gap-1 flex flex-col items-center justify-center p-4">
        <img src={emptyFolderImg} alt="" />
        <h3 className="font-medium text-2xl max-md:text-xl">
          Your have no Exams Saved to Draft
        </h3>
        <h5 className="text-text-ghost font-normal text-sm">
          Your saved drafts will appear here
        </h5>
      </div>
    );
  }

  return (
    <div className="w-full h-full gap-1 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {savedExams.map((exam) => (
          <SavedExamsCard key={exam.id} exams={exam} />
        ))}
      </div>
    </div>
  );
};

export default CourseSavedExams;
