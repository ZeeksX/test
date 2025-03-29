import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import CourseTopbar from "../components/courses/CourseTopbar";
import { useDispatch, useSelector } from "react-redux";
import { CreateNewExam, StudentGroupWarnDialog } from "../components/courses/CourseComponents";
import CourseNavbar from "../components/courses/CourseNavbar";
import { setShowCreateNewExamination } from "../features/reducers/uiSlice";
import { fetchCourseDetails } from "../features/reducers/courseSlice";
import { Loader } from "../components/ui/Loader";

const CourseOverview = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();

  const { courseLoading: loading, courseError: error } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    dispatch(setShowCreateNewExamination(false));
  }, [dispatch, courseId]);

  useEffect(() => {
    dispatch(fetchCourseDetails({ id: courseId }));
  }, [dispatch, courseId]);

  const isCreateExamOpen = useSelector(
    (state) => state.ui.showCreateNewExamination
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full">
      {isCreateExamOpen ? (
        <CreateNewExam />
      ) : (
        <div className="w-full h-full flex flex-col">
          <CourseTopbar />
          <CourseNavbar />
          <div className="w-full h-[calc(100%_-_75px)] overflow-auto">
            <Outlet />
          </div>
        </div>
      )}
      <StudentGroupWarnDialog />
    </div>
  );
};

export default CourseOverview;
