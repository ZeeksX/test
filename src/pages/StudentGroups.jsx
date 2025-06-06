import React, { useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import GroupCard from "../components/lecturer/GroupCard";
import { useNavigate } from "react-router-dom";
import { setShowCreateStudentGroup } from "../features/reducers/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentGroups } from "../features/reducers/examRoomSlice";
import { Loader } from "../components/ui/Loader";

const StudentGroups = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    teacherStudentGroups: StudentGroup,
    loading,
    error,
  } = useSelector((state) => state.examRooms);

  useEffect(() => {
    dispatch(fetchStudentGroups());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="bg-[#F9F9F9] min-h-screen overflow-y-auto">
        <div className="flex flex-row max-md:flex-col justify-between items-start">
          <div className="p-4 flex flex-col gap-4">
            <h1 className="text-[32px] font-inter font-medium leading-8">
              Student Groups
            </h1>
            <p className="text-[#667085] max-w-xl font-inter text-sm">
              A Student Group helps you organize different groups of
              students taking the subject(s) you teach
            </p>
          </div>
          <div className="flex flex-row gap-4 p-4 mr-8 max-md:mr-2 max-md:w-full max-md:justify-end max-md:items-end">
            {/* <button className="bg-[#FFFFFF] gap-2 border shadow-[0_1px_2px_rgba(16,24,40,0.05)] text-[black] h-[44px] flex items-center justify-center font-inter font-medium text-sm rounded-lg px-4">
              Share
              <FiUpload />
            </button> */}
            <button
              onClick={() => dispatch(setShowCreateStudentGroup(true))}
              className="bg-[#1835B3] gap-2 text-[white] h-[44px] flex items-center justify-center font-inter font-medium text-sm rounded-lg px-4"
            >
              Create New Group
              <FaPlus />
            </button>
          </div>
        </div>
        <hr className="text-[#98A2B3] border-1" />
        {/* <div className="flex items-end justify-end gap-4 mr-8 max-md:mr-2 p-4">
          <button className="bg-[#EAECF0] text-[black] h-[44px] font-inter text-base rounded-lg w-[133px]">
            View Results
          </button>
          <button className="rounded-lg bg-[#EAECF0] flex items-center justify-center h-[44px] w-[43px]">
            <MoreHorizIcon className="text-[#667085]" />
          </button>
        </div> */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 max-md:grid-cols-1 flex-wrap">
            {StudentGroup.map((group) => (
              <div
                key={group.id}
                className="flex flex-col gap-4 mb-8 w-full"
                // onClick={() => handleStudentGroupClick(group)}
              >
                <GroupCard group={group} />
              </div>
            ))}
            {/* Create New Group Card */}
            <div
              onClick={() => dispatch(setShowCreateStudentGroup(true))}
              className="cursor-pointer flex flex-col border-2 w-full max-w-[422px] h-[378px] border-dashed border-[#E7E7E7] rounded-[20px]"
            >
              <div className="flex flex-col items-center justify-center w-full max-w-[422px] h-[378px] bg-[#F4F4F4] rounded-[20px] p-1">
                <div className="flex flex-col items-center justify-center gap-2 h-full">
                  <button className="gap-2 text-[#98A2B3] h-[44px] flex flex-col items-center justify-center font-inter font-normal text-sm rounded-lg px-4">
                    <FaPlus />
                    Add New Student Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentGroups;
