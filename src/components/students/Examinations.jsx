import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { illustration2 } from "../../utils/images";
import ExaminationTable from "./ExaminationTable";
import CompletedExams from "./CompletedExams";
import { Outlet } from "react-router";

const Examinations = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const exams = useSelector((state) => state.examinations.examinations);

  const upcomingExams = useMemo(
    () => exams.filter((exam) => new Date(exam.due_time) > new Date()),
    [exams]
  );

  const completedExams = useMemo(
    () => exams.filter((exam) => new Date(exam.due_time) <= new Date()),
    [exams]
  );

  return (
    <div className="">
      <div className="flex flex-row justify-between w-full ">
        <div className="flex flex-col gap-4 py-8 px-11">
          <h3 className="text-[32px] leading-8 font-medium">Examinations</h3>
          <p className="text-sm text-[#222222] font-normal">
            Lorem ipsum dolor sit amet consectetur. At aliquet pharetra non
            sociis.
          </p>
        </div>
        <div className={"flex items-center justify-center py-4 px-11"}>
          <button className="bg-[#1835B3] hover:ring-2 w-[212px] gap-2 text-[white] h-[44px] flex items-center justify-center font-inter font-semibold text-base leading-6 rounded-lg px-4">
            Join Student Group
            <FaPlus />
          </button>
        </div>
      </div>
      <div className="text-xl px-11 gap-6 py-8">
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
            <div className="flex flex-row gap-4 ">
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
