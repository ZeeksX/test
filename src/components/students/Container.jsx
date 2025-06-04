import React, { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { TbSchool, TbUserQuestion } from "react-icons/tb";
import { GoChecklist, GoDotFill } from "react-icons/go";
import { illustration1, illustration2 } from "../../utils/images";
import { FaPlus } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import ExaminationTable from "./ExaminationTable";
import CompletedExams from "./CompletedExams";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentGroups,
  fetchStudentsStudentGroups,
  fetchAllTeachersWithTheirExamRooms,
} from "../../features/reducers/examRoomSlice";
import CustomButton from "../ui/Button";
import { setShowJoinStudentGroupDialog } from "../../features/reducers/uiSlice";
import { Loader } from "../ui/Loader";
import { fetchExams } from "../../features/reducers/examSlice";
import { SERVER_URL } from "../../utils/constants";

const Container = () => {
  const dispatch = useDispatch();

  const {
    allStudentGroups,
    studentStudentGroups,
    loading,
  } = useSelector((state) => state.examRooms);

  const {
    allExams: examinations,
    loading: examsLoading,
  } = useSelector((state) => state.exams);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [availableExams, setAvailableExams] = useState([]);
  const [totalExams, setTotalExams] = useState([]);
  const [selectedTab, setSelectedTab] = useState("upcoming");

  useEffect(() => {
    dispatch(fetchAllTeachersWithTheirExamRooms());
  }, [dispatch]);

  useEffect(() => {
    if (!dataLoaded) {
      dispatch(fetchStudentsStudentGroups());
      dispatch(fetchStudentGroups());
      dispatch(fetchExams());
      setDataLoaded(true);
    }
  }, [dispatch, dataLoaded]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/exams/dashboard/student`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          }
        })
        if (response.ok) {
          const data = await response.json();
          setTotalExams(data);
        }

      } catch (error) {
        console.error("Error fetching exams: ", error)
      }
    }
    fetchUserDetails();
  }, [])

  const studentCards = [
    {
      title: "Total Lecturers",
      icon: <TbSchool size={24} color="#1836B2" />,
      bgColor: "#1836B233",
      count: totalExams.total_teachers,
    },
    {
      title: "Student Groups Enrolled",
      icon: <GoChecklist size={24} color="#85C7ED" />,
      bgColor: "#86C6EE33",
      count: totalExams.total_groups || 0,
    },
    {
      title: "Total Examinations Submitted",
      icon: <TbUserQuestion size={24} color="#EE1D1D" />,
      bgColor: "#EE1D1D33",
      count: totalExams.total_submissions || 0,
    },
  ];

  if (loading || examsLoading) return <Loader />;

  return (
    <>
      {/* Stats */}
      <div className="font-inter bg-[#F9F9F9] grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-7">
        {studentCards.map((card, index) => (
          <Card
            key={index}
            className="flex h-32 items-start justify-between p-6 border border-[#D0D5DD]"
          >
            <div className="text-left flex flex-col gap-5">
              <h3 className="text-lg text-[#222222] opacity-80">{card.title}</h3>
              <p className="text-xl text-[#222222] opacity-50">{card.count}</p>
            </div>
            <div className="flex items-start justify-center rounded-full">
              <div className="flex items-center justify-center rounded-md p-2" style={{ backgroundColor: card.bgColor }}>
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Student Groups */}
      <hr className="text-[#D0D5DD] my-4" />
      <h1 className="text-[#222222] text-2xl">Student Groups</h1>
      <hr className="text-[#D0D5DD] mt-4" />
      <div className="text-xl grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        {studentStudentGroups.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-4 col-span-full">
            <img className="w-32 h-32" src={illustration1} alt="Illustration" />
            <h1 className="text-[32px] max-md:text-2xl font-medium">
              No content here yet. Let’s change that!
            </h1>
            <p className="text-[#667085] text-lg">
              Join a student group and start taking examinations.
            </p>
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
          studentStudentGroups.map((group) => {
            const detail = allStudentGroups.find((g) => g.id === group.id);
            if (!detail) return null;

            return (
              <div
                key={detail.id}
                className="flex flex-row py-4 pl-1 pr-6 w-full max-w-[309px] h-max bg-white border rounded-xl border-[#D0D5DD] items-start gap-2"
              >
                <div><BsThreeDotsVertical /></div>
                <div className="flex-1 flex flex-col gap-2">
                  <h1 className="max-w-[250px] text-xl leading-5 text-[#222222] font-medium truncate" title={detail.name}>
                    {detail.name}
                  </h1>
                  <p className="text-[#666666] text-[12px] leading-5 line-clamp-2">{detail.description}</p>
                  <h3 className="text-[#A1A1A1] text-sm flex flex-row gap-1 items-center">
                    {detail.teacher ? `${detail.teacher.title} ${detail.teacher.user?.last_name || ""}` : "No assigned teacher"}
                    <GoDotFill className="text-sm" />
                    <span>
                      {detail.students?.length} {detail.students?.length === 1 ? "student" : "students"}
                    </span>
                  </h3>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Examinations Section */}
      <hr className="text-[#D0D5DD] mt-4" />
      <h1 className="text-[#222222] text-2xl my-4">Examinations</h1>
      {/* Tabs */}
      <div className="flex flex-row gap-4">
        <h1
          onClick={() => setSelectedTab("upcoming")}
          className={`cursor-pointer text-lg ${selectedTab === "upcoming" ? "text-[#1836B2] border-b-2 border-[#1836B2]" : "text-black"}`}
        >
          Upcoming
        </h1>
        <h1
          onClick={() => setSelectedTab("completed")}
          className={`cursor-pointer text-lg ${selectedTab === "completed" ? "text-[#1836B2] border-b-2 border-[#1836B2]" : "text-black"}`}
        >
          Completed
        </h1>
      </div>

      <hr className="text-[#D0D5DD] mt-4" />
      <div className="text-xl pt-4 flex justify-center">
        {examinations.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <img className="w-32 h-32" src={illustration2} alt="Illustration" />
            <h1 className="text-[32px] max-md:text-2xl font-medium">
              Nothing to see here… yet!
            </h1>
            <p className="text-[#667085] text-lg">
              Join a student group and start taking examinations.
            </p>
          </div>
        ) : selectedTab === "upcoming" ? (
          <ExaminationTable examinations={availableExams} />
        ) : (
          <CompletedExams examinations={examinations} />
        )}
      </div>
    </>
  );
};

export default Container;
