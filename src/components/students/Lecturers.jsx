import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { illustration3 } from "../../utils/images";
import LecturersTable from "./LecturersTable";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setShowJoinStudentGroupDialog } from "../../features/reducers/uiSlice";
import { fetchAllTeachersWithTheirExamRooms } from "../../features/reducers/examRoomSlice";
import { Loader } from "../ui/Loader";

const Lecturers = () => {
  const dispatch = useDispatch();

  const {
    allTeachersAndExamRooms: lecturers,
    loading,
    error,
  } = useSelector((state) => state.examRooms);

  useEffect(() => {
    dispatch(fetchAllTeachersWithTheirExamRooms());
  }, [dispatch]);
  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="">
        <div className="flex flex-row max-md:flex-col justify-between w-full ">
          <div className="flex flex-col gap-4 py-4 px-11 max-md:px-4">
            <h3 className="text-[32px] leading-8 font-medium">Teachers</h3>
            <p className="text-sm text-[#222222] font-normal">
              See all the lecturers and lecturer groups you have enrolled for
            </p>
          </div>
          <div
            className={
              lecturers.length === 0
                ? "hidden"
                : "flex" + " items-center justify-center max-md:justify-end py-4 max-md:py-1 px-11 max-md:px-4"
            }
          >
            <button
              onClick={() => dispatch(setShowJoinStudentGroupDialog(true))}
              className="bg-[#1835B3] hover:ring-2 w-[212px] gap-2 text-[white] h-[44px] flex items-center justify-center font-inter font-semibold text-base leading-6 rounded-lg px-4"
            >
              Join Student Group
              <FaPlus />
            </button>
          </div>
        </div>
        <hr className="text-[#D0D5DD] mt-4" />
        <div className="text-xl px-11 max-md:px-4 gap-6 py-12">
          {lecturers.length === 0 ? (
            <div className="flex flex-col justify-center items-center gap-4 col-span-full">
              <img
                className="w-32 h-32"
                src={illustration3}
                alt="Illustration"
              />
              <h1 className="text-[32px] max-md:text-2xl font-medium leading-8">
                Oops, this page looks a little lonely. Let’s fill it up
              </h1>
              <p className="text-[#667085] text-lg">
                Join a student group and get necessary informations here
              </p>
            </div>
          ) : (
            <>
              <LecturersTable lecturers={lecturers} />
              <Outlet /> {/* Add this for nested routes */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Lecturers;
