import React from "react";

const Onboarding = () => {
  return (
    <div className="landing flex p-6 justify-center items-center sm:flex-row flex-col w-full min-h-screen">
      <div className="flex flex-col rounded-3xl h-[85vh] items-center justify-center w-3/5 bg-white py-8">
        <div className="flex flex-row justify-center items-center gap-24">
          <button className="flex justify-center items-center w-24 flex-row relative -top-14 left-3 text-xs p-2 rounded-t-md rounded-br-md text-white bg-[#1836B2] hover:outline hover:outline-blue-300">
            Student
          </button>
          <button className="flex justify-center items-center w-24 flex-row relative -top-8  text-xs p-2 rounded-t-md rounded-br-md text-white bg-[#528BCD] hover:outline hover:outline-blue-200">
            Learner
          </button>
        </div>
        <div className="flex items-center justify-center gap-12">
          <button className="flex justify-center items-center w-24 flex-row relative -top-8 text-xs p-2 rounded-t-md rounded-br-md text-white bg-[#86C7ED] hover:outline hover:outline-blue-100">
            Educator
          </button>
          <h3 className="text-[2rem] leading-[38.73px] w-60 font-medium text-center">
            Which one best describes you?
          </h3>
          <button className="flex justify-center items-center w-24 flex-row relative   text-xs p-2 rounded-t-md rounded-br-md text-white bg-[#86C7ED] hover:outline hover:outline-blue-100">
            Instructor
          </button>
        </div>
        <div className="flex flex-row justify-center items-center gap-24">
          <button className="flex justify-center items-center w-24 flex-row relative top-12 text-xs p-2 rounded-t-md rounded-br-md text-white bg-[#528BCD] hover:outline hover:outline-blue-200">
            Pupil
          </button>
          <button className="flex justify-center items-center w-24 flex-row relative top-8 left-8  text-xs p-2 rounded-t-md rounded-br-md text-white bg-[#1836B2] hover:outline hover:outline-blue-300">
            Lecturer
          </button>
        </div>
        <div className="flex flex-column justify-center items-center relative top-[4.5rem]">
          <div className="flex flex-col justify-center items-center gap-4">
            <button className="bg-[#1836B2] font-medium p-2 w-72 text-sm text-white hover:text-[#1836B280] hover:bg-[#DDE4FF]">
              Next
            </button>
            <div className="flex flex-row items-center gap-1">
              <button className="bg-[#c3dbff] w-2 h-2 rounded-full flex flex-col"></button>
              <button className="bg-[#6EA5F3] w-6 h-2 rounded flex flex-col"></button>
              <button className="bg-[#c3dbff] w-2 h-2 rounded-full flex flex-col"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
