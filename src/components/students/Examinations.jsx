import React, { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { illustration2 } from "../../utils/images";
import ExaminationTable from "./ExaminationTable";
import CompletedExams from "./CompletedExams";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../ui/Button";
import { Loader } from "../ui/Loader";
import { fetchExams } from "../../features/reducers/examSlice";
import { filterExamsByStudentSubmissions } from "../modals/UIUtilities";

const Examinations = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [availableExams, setAvailableExams] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user.studentId;
  const dispatch = useDispatch();
  // const exams = useSelector((state) => state.examinations.examinations);
  const { allExams: exams, loading: examsLoading } = useSelector(
    (state) => state.exams
  );

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!dataLoaded) {
      dispatch(fetchExams());
      setDataLoaded(true);
    }
  }, [dispatch, dataLoaded]);

  useEffect(() => {
    const fetchAvailableExams = async () => {
      try {
        const filteredExams = await filterExamsByStudentSubmissions(
          exams,
          studentId
        );
        setAvailableExams(filteredExams);
        console.log({ availableExams });
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchAvailableExams();
  }, [exams, studentId]);

  const upcomingExams = useMemo(
    () => availableExams.filter((exam) => new Date(exam.due_time) > new Date()),
    [availableExams]
  );

  const completedExams = useMemo(
    () => exams.filter((exam) => new Date(exam.due_time) <= new Date()),
    [exams]
  );

  if (examsLoading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="flex flex-row max-md:flex-col justify-between w-full ">
        <div className="flex flex-col gap-4">
          <h3 className="text-[32px] leading-8 font-medium">Examinations</h3>
          <p className="text-sm text-[#222222] font-normal">
            View all your examinations, both upcoming and completed. You have to
            join a student group to participate in examinations.
          </p>
        </div>
        <div className="flex max-md:justify-end w-full ">
          <CustomButton size="base" className="gap-3 h-max max-md:w-48 max-md:mt-2 ">
            Join Student Group
            <FaPlus />
          </CustomButton>
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
                className={`cursor-pointer text-lg ${selectedTab === "upcoming"
                    ? "text-[#1836B2] border-b-2 border-[#1836B2]"
                    : "text-black"
                  }`}
              >
                Upcoming
              </h1>
              <h1
                onClick={() => setSelectedTab("completed")}
                className={`cursor-pointer text-lg ${selectedTab === "completed"
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
