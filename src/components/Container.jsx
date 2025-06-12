import React, { useEffect, useState, useRef } from "react";
import { AvatarFallback, AvatarImage } from "./ui/Avatar";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "./Auth.jsx";
import StudentContainer from "./students/Container.jsx";
import LecturerContainer from "./lecturer/Container.jsx";
import { FaPlus } from "react-icons/fa6";
import { CustomButton } from "./ui/Button.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setShowJoinStudentGroupDialog } from "../features/reducers/uiSlice.jsx";
import { PETTY_SERVER_URL, SERVER_URL } from "../utils/constants.js";
import { profileImageDefault } from "../utils/images.js";
import axios from "axios";
import { Loader } from "./ui/Loader.jsx";
import { fetchUserDetails } from "../features/reducers/userSlice.jsx";

const Container = () => {
  const [src, setSrc] = useState("");
  const [studentGroup, setStudentGroup] = useState([]);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const hasPostedCourse = useRef(false);

  const { userDetails: userDetails, getDetailsLoading } = useSelector(
    (state) => state.users
  );

  // Post course details on mount if userData exists in localStorage
  useEffect(() => {
    const postCourseDetails = async () => {
      try {
        if (hasPostedCourse.current) return;

        const storedData = localStorage.getItem("userData");
        const token = localStorage.getItem("access_token");

        if (!storedData || !token) {
          return;
        }

        const parsedData = JSON.parse(storedData);

        // Only proceed if it's a teacher with form data
        if (parsedData.role === "teacher" && parsedData.form) {
          // Mark as being processed to prevent duplicate requests
          hasPostedCourse.current = true;

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
            // Reset the flag if request failed so it can be retried
            hasPostedCourse.current = false;
            // If response is not OK, try to get the text response for debugging
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }

          const data = await response.json();
          console.log("Course created successfully:", data);
          localStorage.removeItem("userData");
        } else {
          localStorage.removeItem("userData");
        }
      } catch (error) {
        console.error("Error posting course data:", error);
        hasPostedCourse.current = false;
      }
    };

    postCourseDetails();
  }, []);

  useEffect(() => {
    const welcome = async () => {
      try {
        const test = await axios.get(`${PETTY_SERVER_URL}/health`);
        console.log(test.data.status);
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    welcome();
    dispatch(fetchUserDetails());
  }, [dispatch]);

  if (getDetailsLoading) {
    return <Loader />;
  }

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
            <h3 className="text-2xl font-medium">
              Welcome, {userDetails?.title} {user?.last_name}
            </h3>
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
