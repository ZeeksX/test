import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiBookOpen, FiChevronDown, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { CustomButton } from "./Button";
import { DialogTrigger } from "./Dialog";
import {
  setShowCreateExaminationRoom,
  setShowCreateNewExamination,
} from "../../features/reducers/uiSlice";
import { fetchCourses } from "../../features/reducers/courseSlice";

export const CourseDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <div className="w-full mb-4">
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between p-3 text-left hover:bg-secondary-bg
            ${
              pathname.includes("/course") && !isOpen
                ? "bg-secondary-bg border-l-4 border-primary-main"
                : "hover:bg-secondary-bg"
            }
          `}
          aria-expanded={isOpen}
          aria-controls="courses-dropdown"
        >
          <div className="flex gap-4">
            <FiBookOpen size={22} />
            Courses
          </div>
          <FiChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{
              duration: 0.3,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
          >
            <div className="h-[350px] overflow-auto pb-4">
              <ul className="space-y-1" id="courses-dropdown">
                {courses.map((course) => (
                  <div
                    className="w-full flex flex-col items-center justify-center"
                    key={course.id}
                  >
                    <Link
                      to={`/course/${course.id}/published`}
                      className={`w-full block px-4 py-2 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis ${
                        pathname.includes(`/course/${course.id}`)
                          ? "bg-secondary-bg border-l-4 border-primary-main"
                          : "hover:bg-secondary-bg"
                      }`}
                      title={course.course_title}
                    >
                      {course.course_title}
                    </Link>
                  </div>
                ))}
                <DropdownMenuSeparator />
                <div className="pt-4 px-2">
                  <DialogTrigger onClick={setShowCreateExaminationRoom}>
                    <CustomButton
                      className="w-full gap-3 !text-[15px]"
                      loading={loading}
                    >
                      Add New Course <FiPlus size={20} />
                    </CustomButton>
                  </DialogTrigger>
                </div>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function DropdownMenuSeparator() {
  return <div className="border-t border-gray-200 my-1" />;
}
