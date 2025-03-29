import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { useAuth } from "./Auth.jsx";
import StudentContainer from "./students/Container.jsx";
import LecturerContainer from "./lecturer/Container.jsx";
import { FaPlus } from "react-icons/fa6";
import { CustomButton } from "./ui/Button.jsx";
import { useDispatch } from "react-redux";
import { setShowJoinStudentGroupDialog } from "../features/reducers/uiSlice.jsx";

const Container = () => {
  const [src, setSrc] = useState("");
  const [studentGroup, setStudentGroup] = useState([]);
  const dispatch = useDispatch();

  const { user } = useAuth();
  // console.log(user)

  return (
    <div className="w-full h-full p-5 overflow-auto">
      <div className="flex items-center justify-start gap-5 mb-5">
        <Avatar>
          {src ? (
            <AvatarImage
              src={src}
              className="!w-[53px] !h-[53px]"
              alt="Profile"
            />
          ) : (
            <AvatarFallback className="!w-[53px] !h-[53px]">
              {user.last_name ? user.last_name.charAt(0) : "A"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-row justify-between h-[60px] w-full">
          <div className="flex flex-col justify-between">
            <h3 className="text-2xl font-medium">Welcome {user?.last_name}</h3>
            <p className="text-base text-[#858585] capitalize">{user.role}</p>
          </div>
          <div
            className={
              studentGroup.length === 0
                ? "hidden"
                : "flex" + "items-center justify-center"
            }
          >
            {/* <button className='bg-[#1835B3] w-64 gap-2 text-[white] h-[60px] flex items-center justify-center font-inter font-semibold text-lg rounded-lg px-4'>
              Join Student Group
              <FaPlus />
            </button> */}
            <CustomButton
              onClick={() => dispatch(setShowJoinStudentGroupDialog(true))}
              className="gap-2 !font-medium !text-sm"
              size="lg"
            >
              Join Student Group
              <FaPlus />
            </CustomButton>
          </div>
        </div>
      </div>
      {user.role === "teacher" ? (
        <LecturerContainer />
      ) : (
        <StudentContainer
          studentGroup={studentGroup}
          setStudentGroup={setStudentGroup}
        />
      )}
    </div>
  );
};

export default Container;
