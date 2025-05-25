import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiBookOpen, FiChevronDown, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { CustomButton } from "./Button";
import { DialogTrigger } from "./Dialog";
import {
  setShowCreateExaminationRoom,
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

export function DropdownMenu({ children }) {
  return <div className="relative">{children}</div>;
}

DropdownMenu.propTypes = {
  children: PropTypes.node.isRequired,
};

export function DropdownMenuTrigger({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-start p-2 hover:bg-neutral-mediumGray text-left rounded-full bg-transparent"
    >
      {children}
    </button>
  );
}

DropdownMenuTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export function DropdownMenuContent({
  children,
  open,
  setOpen,
  className,
  align = "start",
}) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  return open ? (
    <div
      ref={ref}
      className={`absolute bg-white border border-gray-200 rounded-md shadow-lg mt-2 w-56 z-[9] ${className}`}
      style={{ right: align === "start" ? 0 : "auto" }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
    >
      {children}
    </div>
  ) : null;
}

DropdownMenuContent.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(["start", "end"]),
};

export function DropdownMenuLabel({ children }) {
  return (
    <div className="px-4 py-2 text-sm font-semibold text-gray-700">
      {children}
    </div>
  );
}

DropdownMenuLabel.propTypes = {
  children: PropTypes.node.isRequired,
};

export function DropdownMenuItem({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 rounded-md"
      role="menuitem"
    >
      {children}
    </div>
  );
}

DropdownMenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};