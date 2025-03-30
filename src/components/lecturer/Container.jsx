import React, { useEffect } from "react";
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

const Container = () => {
  const dispatch = useDispatch();
  const { teacherStudentGroups, loading, error } = useSelector(
    (state) => state.examRooms
  );

  useEffect(() => {
    dispatch(fetchStudentGroups());
  }, [dispatch]);

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
                Total Enrolled
              </h3>
              <span className="rounded-[6px] p-1 bg-[#1836B233]">
                <TbSchool size={24} color="#1836B2" />
              </span>
            </div>
            <p className="opacity-[50%] text-xl">5000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex w-full items-center justify-between mb-5">
              <h3 className="font-normal text-lg opacity-[80%]">
                Total Exam rooms created
              </h3>
              <span className="rounded-[6px] p-1 bg-[#86C6EE33]">
                <GoChecklist size={24} color="#85C7ED" />
              </span>
            </div>
            <p className="opacity-[50%] text-xl">
              {teacherStudentGroups.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex w-full items-center justify-between mb-5">
              <h3 className="font-normal text-lg opacity-[80%]">Requests</h3>
              <span className="rounded-[6px] p-1 bg-[#EE1D1D33]">
                <TbUserQuestion size={24} color="#EE1D1D" />
              </span>
            </div>
            <p className="opacity-[50%] text-xl">50</p>
          </CardContent>
        </Card>
      </div>
      <div className="text-xl">
        <h2 className="mb-5">Recent Exam Rooms</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardImage src={Rectangle4221} alt="AI Course" />
            <CardContent>
              <h3 className="text-2xl text-black mb-4">
                Artificial Intelligence
              </h3>
              <p className="opacity-[50%] text-base">Enrolled Students: 500</p>
            </CardContent>
          </Card>
          <Card>
            <CardImage src={Rectangle4223} alt="Intro Tech" />
            <CardContent>
              <h3 className="text-2xl text-black mb-4">Intro Tech</h3>
              <p className="opacity-[50%] text-base">Enrolled students: 900</p>
            </CardContent>
          </Card>
          <Card>
            <CardImage src={Rectangle4225} alt="Requirements Engr." />
            <CardContent>
              <h3 className="text-2xl text-black mb-4">Requirements Engr.</h3>
              <p className="opacity-[50%] text-base">Enrolled students: 1500</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Container;
