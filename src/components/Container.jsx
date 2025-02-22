import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Card, CardContent, CardImage } from "./ui/Card";
import Rectangle4221 from "/Rectangle_4221.svg";
import Rectangle4223 from "/Rectangle_4223.png";
import Rectangle4225 from "/Rectangle_4225.png";
import { TbSchool, TbUserQuestion } from "react-icons/tb";
import { GoChecklist } from "react-icons/go";
import { useAuth } from "./Auth.jsx";

const Container = () => {
  const [src, setSrc] = useState("");

  const { user } = useAuth();
  console.log(user)

  return (
    <div className="w-full h-full px-11 py-5 overflow-auto">
      <div className="flex items-center justify-start gap-5 mb-5">
        <Avatar>
          {src ? (
            <AvatarImage
              src={src}
              className="!w-[53px] !h-[53px]"
              alt="Profile"
            />
          ) : (
            <AvatarFallback className="!w-[53px] !h-[53px]">A</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="text-[19px] font-normal">Welcome Back, {user.last_name}</h3>
          <p className="text-sm">Teacher</p>
        </div>
      </div>
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
            <p className="opacity-[50%] text-xl">50</p>
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
    </div>
  );
};

export default Container;