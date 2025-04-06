import React from "react";
import { formatDate } from "../modals/UIUtilities";

const GroupCard = ({ group }) => {
  const Students = group.students || [];

  return (
    <div className="flex flex-col font-inter rounded-[20px] w-full max-w-[422px] h-[378px] border shadow-white bg-white p-1">
      <div className="h-[278px] w-full">
        <div className="mt-10 flex flex-col items-center justify-between gap-4">
          {Students.map((student, index) => (
            <div
              key={student.student_id}
              className="flex flex-row w-[90%] items-center justify-between gap-2 overflow-hidden"
            >
              <div className="flex flex-row flex-1 gap-3 items-center">
                <h1 className="text-base font-normal text-black">
                  {index + 1} {/* Add +1 to start numbering from 1 instead of 0 */}
                </h1>
                <h1 className="text-base font-normal text-black truncate">
                  {student.last_name} {student.other_names}
                </h1>
              </div>
              <div className="text-base font-normal text-black">
                {student.matric_number}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[100px] bg-[#DDEFF9] rounded-b-[20px] flex items-center justify-between p-1 px-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium text-black">{group.name}</h1>
          <span className="text-[#98A2B3] text-[14px]">
            Last Edited {formatDate(new Date(group.updated_at))}
          </span>
        </div>
        <div className="flex">
          <span className="flex cursor-pointer items-center gap-2 text-[#EA4335]">
            Leave Group
          </span>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
