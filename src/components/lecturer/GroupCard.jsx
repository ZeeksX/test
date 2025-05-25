import React from "react";
import { RiLink } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import { formatDate } from "../modals/UIUtilities";
import CustomButton from "../ui/Button";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router";
import { setShowAddStudentToStudentGroupDialog } from "../../features/reducers/uiSlice";
import { useDispatch } from "react-redux";

const GroupCard = ({ group }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Students = group.students || [];

  const handleStudentGroupClick = (group) => {
    navigate(`/student-groups/${group.id}`, {
      state: { group },
    });
  };

  return (
    <div className="flex flex-col font-inter rounded-[20px] w-full max-w-[422px] bg-white shadow-lg p-1">
      <div className="h-[278px] w-full">
        <div className="mt-10 flex flex-col items-center justify-between gap-4">
          {Students.map((student) => (
            <div
              key={student.student_id}
              className="flex flex-row w-[90%] items-center justify-between gap-2"
            >
              <div className="flex flex-row flex-1 gap-3 items-center">
                <h1 className="text-base font-normal text-black">
                  {student.student_id}
                </h1>
                <h1 className="text-base font-normal text-black truncate">
                  {student.last_name}, {student.other_names}
                </h1>
              </div>
              {/* <div className="flex flex-row w-1/3 justify-between items-center">
                <div className="w-0.5 bg-[#D0D5DD] rounded-[1px] h-4"></div>
                <CustomButton variant="link" className="flex items-center gap-2 !text-[#EA4335]">
                  Remove
                  <TiDeleteOutline className="text-[#EA4335] text-2xl" />
                </CustomButton>
              </div> */}
            </div>
          ))}
        </div>
      </div>
      <div className="h-[80px] bg-secondary-bg rounded-b-[20px] flex items-center justify-between p-1 px-4">
        <div className="flex flex-col gap-1">
          <CustomButton
            variant="link"
            onClick={() => handleStudentGroupClick(group)}
            className="text-xl font-medium !text-black !p-0 !justify-start"
          >
            {group.name}
          </CustomButton>
          <span className="text-[#98A2B3] text-[14px]">
            Last Edited {formatDate(new Date(group.updated_at))}
          </span>
        </div>
        {/* <div className="flex"> */}
        <CustomButton
          variant="link"
          onClick={() =>
            dispatch(
              setShowAddStudentToStudentGroupDialog({
                isOpen: true,
                groupId: group.id,
              })
            )
          }
          className="flex flex-row gap-2 cursor-pointer items-center text-[#155EEF] relative z-10"
        >
          Add Student <FiUserPlus size={24} />
        </CustomButton>
        {/* </div> */}
      </div>
    </div>
  );
};

export default GroupCard;
