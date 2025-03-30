import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import { illustration2 } from '../../utils/images';
import ExaminationTable from './ExaminationTable';
import CompletedExams from './CompletedExams';
import { Outlet } from 'react-router';

const Examinations = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const exams = [
    {
      id: 1,
      serial_number: 1,
      exam_name: "Introduction to Computer Science Final Exam",
      lecturer: "Prof. Ezekiel Ikinwot",
      course: "CSC 101",
      date: "2025-03-29 15:00",
      duration: "2 hours",
      questions: 50,
      option: "Start Exam"
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
      option: "View Details"
    },
    {
      id: 3,
      serial_number: 3,
      exam_name: "Algorithms Final Assessment",
      lecturer: "Dr. Anjola Ajayi",
      course: "CSC 301",
      date: "2025-03-31 09:00",
      duration: "3 hours",
      questions: 100,
      option: "Join Waiting Room"
    },
    {
      id: 4,
      serial_number: 4,
      exam_name: "Linux Mid semester",
      lecturer: "Dr. Edward Philip",
      course: "CSC 317",
      date: "2025-04-01 09:00",
      duration: "2 hours",
      questions: 60,
      option: "Join Waiting Room"
    }
  ]
  return (
    <div className=''>
      <div className="flex flex-row justify-between w-full ">
        <div className="flex flex-col gap-4 py-8 px-11">
          <h3 className="text-[32px] leading-8 font-medium">Examinations</h3>
          <p className="text-sm text-[#222222] font-normal">Lorem ipsum dolor sit amet consectetur. At aliquet pharetra non sociis.</p>
        </div>
        <div className={"flex items-center justify-center py-4 px-11"}>
          <button
            className='bg-[#1835B3] hover:ring-2 w-[212px] gap-2 text-[white] h-[44px] flex items-center justify-center font-inter font-semibold text-base leading-6 rounded-lg px-4'>
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
            <div className='flex flex-row gap-4 '>
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
            <hr className='text-[#D0D5DD] mt-4' />
            {
              selectedTab === "upcoming" ? (
                <ExaminationTable examinations={exams} />
              ) : (
                <CompletedExams examinations={exams} />
              )
            }
            <Outlet />
          </>
        )}
      </div>
    </div>
  )
}

export default Examinations