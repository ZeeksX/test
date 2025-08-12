import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { illustration2 } from "../../utils/images";
import ExaminationTable from "./ExaminationTable";
import CompletedExams from "./CompletedExams";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../ui/Button";
import { Loader } from "../ui/Loader";
import {
  fetchCompletedExams,
  fetchStudentExams,
  fetchUpcomingExams,
} from "../../features/reducers/examSlice";
import { setShowJoinStudentGroupDialog } from "../../features/reducers/uiSlice";

const Examinations = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user.id;
  const dispatch = useDispatch();
  // const exams = useSelector((state) => state.examinations.examinations);
  const {
    studentExams: exams,
    studentUpcomingExams: upcomingExams,
    studentCompletedExams: completedExams,
    loading: examsLoading,
  } = useSelector((state) => state.exams);

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!dataLoaded) {
      dispatch(fetchStudentExams(studentId));
      dispatch(fetchCompletedExams());
      dispatch(fetchUpcomingExams());
      setDataLoaded(true);
    }
  }, [dispatch, dataLoaded, studentId]);

  if (examsLoading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="flex flex-row max-md:flex-col justify-between w-full items-center">
        <div className="flex flex-col gap-4">
          <h3 className="text-[32px] leading-8 font-medium">Examinations</h3>
          <p className="text-sm text-[#222222] font-normal">
            View all your examinations, both upcoming and completed. You have to
            join a student group to participate in examinations.
          </p>
        </div>
        <div className="flex max-md:justify-end max-md:w-full">
          {/* <CustomButton
            onClick={() => dispatch(setShowJoinStudentGroupDialog(true))}
            size="base"
            className="gap-3 h-max !w-48 max-md:mt-2 "
          >
            Join Student Group
            <FaPlus />
          </CustomButton> */}
          <button
            onClick={() => dispatch(setShowJoinStudentGroupDialog(true))}
            className="bg-[#1835B3] hover:ring-2 w-[212px] hidden md:flex gap-2 text-[white] h-[44px] items-center justify-center font-inter font-semibold text-base leading-6 rounded-lg px-4"
          >
            Join Student Group
            <FaPlus />
          </button>
          <button
            onClick={() => dispatch(setShowJoinStudentGroupDialog(true))}
            className="bg-[#1835B3] mt-4 hover:ring-2 w-full md:hidden gap-2 text-[white] h-[44px] flex items-center justify-center font-inter font-semibold text-base leading-6 rounded-lg px-4"
          >
            Join Student Group
            <FaPlus />
          </button>
        </div>
      </div>
      <div className="text-xl gap-6 mt-8">
        {exams.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-4 col-span-full ">
            <img className="w-32 h-32" src={illustration2} alt="Illustration" />
            <h1 className="text-[32px] font-medium leading-8">
              Nothing to see here… yet!
            </h1>
            <p className="text-[#667085] text-lg">
              Join a student group and start taking examinations.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-4">
              <h1
                onClick={() => setSelectedTab("upcoming")}
                className={`cursor-pointer text-lg ${
                  selectedTab === "upcoming"
                    ? "text-[#1836B2] border-b-2 border-[#1836B2]"
                    : "text-black"
                }`}
              >
                Upcoming
              </h1>
              <h1
                onClick={() => setSelectedTab("completed")}
                className={`cursor-pointer text-lg ${
                  selectedTab === "completed"
                    ? "text-[#1836B2] border-b-2 border-[#1836B2]"
                    : "text-black"
                }`}
              >
                Completed
              </h1>
            </div>
            <hr className="text-[#D0D5DD] mt-4" />
            {selectedTab === "upcoming" ? (
              <ExaminationTable examinations={upcomingExams} />
            ) : (
              <CompletedExams examinations={completedExams} />
            )}
            <Outlet />
          </>
        )}
      </div>
    </div>
  );
};

export default Examinations;
