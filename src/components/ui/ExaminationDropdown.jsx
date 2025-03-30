import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiChevronDown, FiPlus, FiFileText } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { CustomButton } from "./Button";
import { DialogTrigger } from "./Dialog";
import {
    setShowCreateNewExamination
} from "../../features/reducers/uiSlice";
import { fetchExaminations } from "../../features/reducers/examinationSlice";
import DropdownMenuSeparator from "./DropdownMenuSeparator";

const ExaminationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { examinations, loading, error } = useSelector((state) => state.examinations);
    const { pathname } = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchExaminations());
    }, [dispatch]);

    return (
        <div className="w-full mb-4">
            <div className="mb-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex w-full items-center justify-between p-3 text-left hover:bg-secondary-bg
            ${pathname.includes("/examinations") && !isOpen
                            ? "bg-secondary-bg border-l-4 border-primary-main"
                            : "hover:bg-secondary-bg"
                        }
          `}
                    aria-expanded={isOpen}
                    aria-controls="examinations-dropdown"
                >
                    <div className="flex gap-4">
                        <FiFileText size={22} />
                        Examinations
                    </div>
                    <FiChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180 transform" : ""
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
                        <div className="">
                            <ul className="space-y-1" id="examinations-dropdown">
                                {examinations.map((examination) => (
                                    <div
                                        className="w-full flex flex-col items-center justify-center"
                                        key={examination.id}
                                    >
                                        <Link
                                            to={`/examinations/${examination.id}`}
                                            className={`w-full block px-4 py-2 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis ${pathname.includes(`/examinations/${examination.id}`)
                                                    ? "bg-secondary-bg border-l-4 border-primary-main"
                                                    : "hover:bg-secondary-bg"
                                                }`}
                                            title={examination.exam_name}
                                        >
                                            {examination.exam_name}
                                        </Link>
                                    </div>
                                ))}
                                <DropdownMenuSeparator />
                                <div className="pt-4 px-2">
                                    <DialogTrigger onClick={() => dispatch(setShowCreateNewExamination())}>
                                        <CustomButton
                                            className="w-full gap-3 !text-[15px]"
                                            loading={loading}
                                        >
                                            Create New Exam <FiPlus size={20} />
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
export default ExaminationDropdown;