import React, { useEffect, useState } from "react";
import { Card, CardContent, CardImage } from "../ui/Card";
import { TbSchool, TbUserQuestion } from "react-icons/tb";
import { GoChecklist } from "react-icons/go";
import {
  Rectangle4221,
  Rectangle4223,
  Rectangle4225,
} from "../../utils/images";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentGroups } from "../../features/reducers/examRoomSlice";
import { Loader } from "../ui/Loader";
import { SERVER_URL } from "../../utils/constants";
import { Link, useNavigate } from "react-router";
import CustomButton from "../ui/Button";

const Container = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teacherStudentGroups, loading, error } = useSelector(
    (state) => state.examRooms
  );
  const [details, setDetails] = useState([]);

  useEffect(() => {
    dispatch(fetchStudentGroups());
  }, [dispatch]);

  useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`${SERVER_URL}/exams/dashboard/teacher`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            }
          })
          if (response.ok) {
            const data = await response.json();
            setDetails(data);
          }
  
        } catch (error) {
          console.error("Error fetching exams: ", error)
        }
      }
      fetchUserDetails();
    }, [])

  const handleStudentGroupClick = (group) => {
    navigate(`/student-groups/${group.id}`, {
      state: { group },
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-7">
        <Card>
          <CardContent>
            <div className="flex w-full items-center justify-between mb-5">
              <h3 className="font-normal text-lg opacity-[80%]">
                Total courses created
              </h3>
              <span className="rounded-[6px] p-1 bg-[#1836B233]">
                <TbSchool size={24} color="#1836B2" />
              </span>
            </div>
            <p className="opacity-[50%] text-xl">{details.total_courses || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex w-full items-center justify-between mb-5">
              <h3 className="font-normal text-lg opacity-[80%]">
                Total student groups created
              </h3>
              <span className="rounded-[6px] p-1 bg-[#86C6EE33]">
                <GoChecklist size={24} color="#85C7ED" />
              </span>
            </div>
            <p className="opacity-[50%] text-xl">
              {details.total_groups || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex w-full items-center justify-between mb-5">
              <h3 className="font-normal text-lg opacity-[80%]">
                Total exams created
              </h3>
              <span className="rounded-[6px] p-1 bg-[#EE1D1D33]">
                <TbUserQuestion size={24} color="#EE1D1D" />
              </span>
            </div>
            <p className="opacity-[50%] text-xl">{details.total_exams || 0}</p>
          </CardContent>
        </Card>
      </div>
      <div className="text-xl">
        <h2 className="mb-5">Recent Student Groups</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...teacherStudentGroups]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by latest
            .slice(0, 3)
            .map((group) => (
              <Card key={group.id}>
                <CardImage src={Rectangle4225} alt="Intro Tech" />
                <CardContent>
                  <CustomButton
                    variant="link"
                    onClick={() => handleStudentGroupClick(group)}
                    className="!text-2xl !text-black "
                  >
                    <p className="!truncate !max-w-[250px]" title={group.name}>
                      {group.name}
                    </p>
                  </CustomButton>
                  <p className="opacity-[50%] text-base mt-4">
                    Enrolled students: {group.students.length}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};

export default Container;
