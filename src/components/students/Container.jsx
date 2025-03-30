import React, { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { TbSchool, TbUserQuestion } from "react-icons/tb";
import { GoChecklist } from "react-icons/go";
import { illustration1, illustration2 } from "../../utils/images";
import { FaPlus } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import ExaminationTable from "./ExaminationTable";
import CompletedExams from "./CompletedExams";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentGroups,
  fetchStudentsStudentGroups,
  selectStudentGroupById,
} from "../../features/reducers/examRoomSlice";
import CustomButton from "../ui/Button";
import { setShowJoinStudentGroupDialog } from "../../features/reducers/uiSlice";
import { Loader } from "../ui/Loader";

const Container = () => {
  //  I am fetching the student group from the redux state now
  const {
    allStudentGroups,
    studentStudentGroups: studentGroup,
    loading,
    error,
  } = useSelector((state) => state.examRooms);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStudentsStudentGroups());
    dispatch(fetchStudentGroups());
  }, [dispatch]);

  const examinations = [
    {
      id: 1,
      serial_number: 1,
      exam_name: "Introduction to Computer Science Final Exam",
      lecturer: "Prof. Ezekiel Ikinwot",
      course: "CSC 101",
      date: "2025-03-29 15:00",
      duration: "2 hours",
      questions: 50,
      option: "Start Exam",
    },
    {
      id: 2,
      serial_number: 2,
      exam_name: "Data Structures Midterm",
      lecturer: "Dr. Nsikak Ebong",
      course: "CSC 201",
      date: "2025-03-30 13:00",
      duration: "1 hour",
      questions: 30,
      option: "View Details",
    },
    {
      id: 3,
      serial_number: 3,
      exam_name: "Algorithms Final Assessment",
      lecturer: "Dr. Anjola Ajayi",
      course: "CSC 301",
      date: "2025-12-10 09:00",
      duration: "3 hours",
      questions: 100,
      option: "Join Waiting Room",
    },
  ];

  const studentCards = [
    {
      title: "Total Courses",
      icon: <TbSchool size={24} color="#1836B2" />,
      bgColor: "#1836B233",
      count: 0,
    },
    {
      title: "Student Groups",
      icon: <GoChecklist size={24} color="#85C7ED" />,
      bgColor: "#86C6EE33",
      count: studentGroup ? studentGroup.length : 0,
    },
    {
      title: "Total Examinations",
      icon: <TbUserQuestion size={24} color="#EE1D1D" />,
      bgColor: "#EE1D1D33",
      count: 0,
    },
  ];

  // State to toggle between upcoming and completed exam tables.
  const [selectedTab, setSelectedTab] = useState("upcoming");

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="font-inter grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-7">
        {studentCards.map((card, index) => (
          <Card
            key={index}
            className="flex h-32 items-start justify-between p-6 border border-[#D0D5DD]"
          >
            <div className="text-left flex flex-col gap-5">
              <h3 className="text-lg text-[#222222] opacity-80">
                {card.title}
              </h3>
              <p className="text-xl text-[#222222] opacity-50">{card.count}</p>
            </div>
            <div className="flex items-start justify-center rounded-full">
              <div
                className="flex items-center justify-center rounded-md p-2"
                style={{ backgroundColor: card.bgColor }}
              >
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <h1 className="text-[#222222] text-2xl">Student Groups</h1>
      <hr className="text-[#D0D5DD] mt-4" />
      <div className="text-xl grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        {studentGroup.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-4 col-span-full">
            <img className="w-32 h-32" src={illustration1} alt="Illustration" />
            <h1 className="text-[32px] font-medium">
              No content here yet. Let’s change that!
            </h1>
            <p className="text-[#667085] text-lg">
              Join a student group and start taking examinations.
            </p>
            {/* Used Custom button component */}
            <CustomButton
              size="lg"
              className="gap-4"
              onClick={() => dispatch(setShowJoinStudentGroupDialog(true))}
            >
              Join Student Group
              <FaPlus />
            </CustomButton>
          </div>
        ) : (
          studentGroup.map((group) => {
            const studentGroupDetail = allStudentGroups.find(
              (g) => g.id === group.id
            );

            if (!studentGroupDetail) return null;

            return (
              <div
                key={studentGroupDetail.id}
                className="flex flex-row py-4 pl-1 pr-6 w-full max-w-[309px] h-max bg-white border rounded-xl border-[#D0D5DD] items-start gap-4"
              >
                <div>
                  <BsThreeDotsVertical className="text-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl leading-5 text-[#222222] font-medium">
                    {studentGroupDetail.name}
                  </h1>
                  <p className="text-[#666666] text-[12px] leading-5 line-clamp-2">
                    {studentGroupDetail.description}
                  </p>
                  <h3 className="text-[#A1A1A1] text-sm">
                    Prof. Ezekiel Ikinwot.{" "}
                    <span>{studentGroupDetail.students?.length} students</span> {/* I am waiting to get the number of students in a student group with this */}
                  </h3>
                </div>
              </div>
            );
          })
        )}
      </div>

      <hr className="text-[#D0D5DD] mt-4" />
      <h1 className="text-[#222222] text-2xl my-4">Examinations</h1>
      {/* Tabs for Upcoming and Completed */}
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
      <div className="text-xl pt-4 flex justify-center">
        {examinations.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <img className="w-32 h-32" src={illustration2} alt="Illustration" />
            <h1 className="text-[32px] font-medium">
              Nothing to see here… yet!
            </h1>
            <p className="text-[#667085] text-lg">
              Join a student group and start taking examinations.
            </p>
          </div>
        ) : // Conditional rendering based on selected tab.
        selectedTab === "upcoming" ? (
          <ExaminationTable examinations={examinations} />
        ) : (
          <CompletedExams examinations={examinations} />
        )}
      </div>
      <hr className="text-[#D0D5DD] mt-4" />
    </>
  );
};

export default Container;
