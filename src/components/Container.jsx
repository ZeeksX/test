import React, { useEffect, useState } from "react";
import { AvatarFallback, AvatarImage } from "./ui/Avatar";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "./Auth.jsx";
import StudentContainer from "./students/Container.jsx";
import LecturerContainer from "./lecturer/Container.jsx";
import { FaPlus } from "react-icons/fa6";
import { CustomButton } from "./ui/Button.jsx";
import { useDispatch } from "react-redux";
import { setShowJoinStudentGroupDialog } from "../features/reducers/uiSlice.jsx";
import { SERVER_URL } from "../utils/constants.js";
import { profileImageDefault } from "../utils/images.js";

const Container = () => {
  const [src, setSrc] = useState("");
  const [studentGroup, setStudentGroup] = useState([]);
  const dispatch = useDispatch();
  const { user } = useAuth();

  // Post course details on mount if userData exists in localStorage
  useEffect(() => {
    const postCourseDetails = async () => {
      try {
        const storedData = localStorage.getItem("userData");
        const token = localStorage.getItem("access_token");
        if (!storedData) return;

        const parsedData = JSON.parse(storedData);
        if (parsedData.role === "teacher" && parsedData.form) {
          // Ensure you correctly map the fields from parsedData.form
          const { course: course_title, code: course_code } = parsedData.form;

          const response = await fetch(`${SERVER_URL}/exams/courses/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ course_title, course_code }),
          });

          if (!response.ok) {
            // If response is not OK, try to get the text response for debugging
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }

          const data = await response.json();
          // Remove userData and user after successful post
          localStorage.removeItem("userData");
        } else {
          localStorage.removeItem("userData");
        }
      } catch (error) {
        console.error("Error posting course data:", error);
      }
    };

    postCourseDetails();
  }, []); 

  return (
    <div className="w-full h-full p-5 overflow-auto bg-[#F9F9F9]">
      <div className="flex items-center justify-start gap-5 mb-5">
        <Avatar
          sx={{ bgcolor: "blue" }}
          className="!w-[60px] !h-[60px] rounded-full"
          alt="Profile Image"
          src={user.profile_image ? user.profile_image : profileImageDefault}
        >
          {user?.last_name ? user?.last_name.charAt(0) : "A"}
        </Avatar>
        <div className="flex flex-row justify-between h-[60px] w-full">
          <div className="flex flex-col justify-between">
            <h3 className="text-2xl font-medium">Welcome {user?.last_name}</h3>
            <p className="text-base text-[#858585] capitalize">{user?.role}</p>
          </div>
          <div
            className={
              studentGroup.length === 0
                ? "hidden"
                : "flex items-center justify-center"
            }
          >
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
      {user?.role === "teacher" ? (
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
