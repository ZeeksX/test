import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { illustration3 } from "../../utils/images";
import LecturersTable from "./LecturersTable";
import { Outlet } from "react-router";
import { useDispatch } from "react-redux";
import { setShowJoinStudentGroupDialog } from "../../features/reducers/uiSlice";

const Lecturers = () => {
  const dispatch = useDispatch();
  const lecturers = [
    {
      id: 1,
      lecturerName: "Prof. Ezekiel Ikinwot",
      groupsJoined: 3,
      options: "View",
    },
    {
      id: 2,
      lecturerName: "Dr. Nsikak Ebong",
      groupsJoined: 4,
      options: "View",
    },
    {
      id: 3,
      lecturerName: "Dr. Anjola Ajayi",
      groupsJoined: 2,
      options: "View",
    },
    {
      id: 4,
      lecturerName: "Dr. Edward Philip",
      groupsJoined: 5,
      options: "View",
    },
    {
      id: 5,
      lecturerName: "Dr. Chinonso Okeke",
      groupsJoined: 1,
      options: "View",
    },
    {
      id: 6,
      lecturerName: "Dr. Joseph Fadare",
      groupsJoined: 3,
      options: "View",
    },
    {
      id: 7,
      lecturerName: "Mr. Oluseye Bamise",
      groupsJoined: 2,
      options: "View",
    },
  ];

  return (
    <>
      <div className="">
        <div className="flex flex-row justify-between w-full ">
          <div className="flex flex-col gap-4 py-4 px-11">
            <h3 className="text-[32px] leading-8 font-medium">Teachers</h3>
            <p className="text-sm text-[#222222] font-normal">
              Lorem ipsum dolor sit amet consectetur. At aliquet pharetra non
              sociis.
            </p>
          </div>
          <div
            className={
              lecturers.length === 0
                ? "hidden"
                : "flex" + " items-center justify-center py-4 px-11"
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
        <div className="text-xl px-11 gap-6 py-12">
          {lecturers.length === 0 ? (
            <div className="flex flex-col justify-center items-center gap-4 col-span-full">
              <img
                className="w-32 h-32"
                src={illustration3}
                alt="Illustration"
              />
              <h1 className="text-[32px] font-medium leading-8">
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
