import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiChevronDown, FiFileText } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchStudentExams } from "../../features/reducers/examSlice";
import { DropdownMenuSeparator } from "./Dropdown";
import { Loader } from "./Loader";

const ExaminationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingExam, setLoadingExam] = useState(false);
  const {
    studentExams: exams,
    loading,
    error,
  } = useSelector((state) => state.exams); // This is the correct one, the function in the useeffect fetches the exams from my slice
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user.studentId;

  useEffect(() => {
    dispatch(fetchStudentExams({ id: studentId })); // this is the function i was talking about
  }, [dispatch, studentId]);

  const handleClick = (examination) => {
    setLoadingExam(true);
    setTimeout(() => {
      setLoadingExam(false);
      navigate(`/examinations/${examination.id}/instructions`, {
        state: { examination },
      });
    }, 1000);
  };

  return (
    <div className="w-full mb-4">
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between p-3 text-left hover:bg-secondary-bg
             ${
               pathname.includes("/examinations") && !isOpen
                 ? "bg-secondary-bg border-l-4 border-primary-main"
                 : "hover:bg-secondary-bg"
             }`}
          aria-expanded={isOpen}
          aria-controls="examinations-dropdown"
        >
          <div className="flex gap-4">
            <FiFileText size={22} />
            Examinations
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
            <div>
              <ul className="space-y-1" id="examinations-dropdown">
                {loadingExam ? (
                  <div className="flex justify-center items-center p-4">
                    <Loader />
                  </div>
                ) : exams.length > 0 ? (
                  exams.map((examination) => (
                    <div
                      className="w-full flex flex-col items-center justify-center"
                      key={examination.id}
                    >
                      <a
                        onClick={() => handleClick(examination)}
                        className={`w-full cursor-pointer block px-4 py-2 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis ${
                          pathname.includes(`/examinations/${examination.id}`)
                            ? "bg-secondary-bg border-l-4 border-primary-main"
                            : "hover:bg-secondary-bg"
                        }`}
                      >
                        {examination.title}
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="ml-4 text-base ">No Examination Found</div>
                )}

                <DropdownMenuSeparator />
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExaminationDropdown;
