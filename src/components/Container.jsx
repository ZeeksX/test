import React, { useEffect, useState, useRef } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
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
import { useNavigate } from "react-router";

const Container = () => {
  const [studentGroup, setStudentGroup] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasPostedCourse = useRef(false);

  const { userDetails: userDetails, getDetailsLoading } = useSelector(
    (state) => state.users
  );

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

        if (parsedData.role === "teacher" && parsedData.form) {
          hasPostedCourse.current = true;

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
            hasPostedCourse.current = false;
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }

          const data = await response.json();
          navigate(`/course/${data.id}/published`);
          localStorage.removeItem("userData");
        } else if (parsedData.role === "student") {
          dispatch(setShowJoinStudentGroupDialog(true))
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
      <div className="flex items-center justify-start gap-5 mb-5 w-full">
        <div className="flex flex-1 justify-start gap-2">
          <div
            // sx={{ bgcolor: "blue" }}
            className="!w-[60px] !h-[60px] rounded-full bg-primary-main"
            alt="Profile Image"
          >
            <img
              className="rounded-full w-full h-full object-cover"
              src={
                user.profile_image ? user.profile_image : profileImageDefault
              }
              alt=""
            />
            {/* {user?.last_name ? user?.last_name.charAt(0) : "A"} */}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg md:text-2xl font-medium">
              Welcome, {userDetails?.title} {user?.last_name}
            </h3>
            <p className="text-base text-[#858585] capitalize">{user?.role}</p>
          </div>
        </div>
        {/* <div className="flex h-[60px] w-max"> */}
        {user?.role === "student" && (
          <div>
            <CustomButton
              onClick={() => dispatch(setShowJoinStudentGroupDialog(true))}
              className="hidden container:flex gap-3  items-center"
              size="lg"
            >
              Join Student Group
              <FaPlus />
            </CustomButton>
            <CustomButton
              onClick={() => dispatch(setShowJoinStudentGroupDialog(true))}
              className="block container:hidden gap-3 h-full"
              size="lg"
            >
              <FaPlus />
            </CustomButton>
          </div>
        )}
        {/* </div> */}
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
