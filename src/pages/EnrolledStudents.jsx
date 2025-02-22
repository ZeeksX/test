import React, { useState } from "react";
import { TabContent, TabList, Tabs, TabTrigger } from "../components/ui/Tabs";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { FaArrowRight } from "react-icons/fa";
import { IoArrowForwardOutline } from "react-icons/io5";

const EnrolledStudents = () => {
  const demoCourses = [
    {
      name: "Artificial i.",
      students: [
        "Emmanuel James",
        "Alice Jasmine",
        "Dino Menlaye",
        "Jones Doherty",
        "Emmanuel James",
        "Alice Jasmine",
        "Dino Menlaye",
        "Jones Doherty",
      ],
    },
    {
      name: "Intro Tech",
      students: [
        "Jason Carter",
        "Olivia Bennet",
        "Ethan Reynolds",
        "Sophia Mitchel",
        "Daniel Hayes",
        "Emily Lawson",
        "Michael Brooks",
        "Ava Richardson",
      ],
    },
    {
      name: "Req. Engr",
      students: [
        "Benjamin Scott",
        "Isabella Turner",
        "Christopher Adams",
        "Grace Sullivan",
        "Matthew Foster",
        "Natalie Morgan",
        "Samuel Cooper",
        "Hannah Thompson",
      ],
    },
  ];
  const [courseStudents, setCourseStudents] = useState(demoCourses[0].students);

  return (
    <div className="w-full h-full px-11 py-5 overflow-auto flex flex-col gap-4">
      <h3 className="text-[20px] font-medium">Students&apos; List</h3>
      <Tabs defaultValue={0}>
        <TabList>
          {demoCourses.map((courses, index) => (
            <TabTrigger value={index} key={index}>
              <button
                onClick={() => setCourseStudents(courses.students)}
                className="w-full h-full py-2 px-6"
              >
                {courses.name}
              </button>
            </TabTrigger>
          ))}
        </TabList>
        {demoCourses.map((courses, index) => (
          <TabContent value={index} key={index} activeTab={index}>
            {courseStudents.map((students, index) => (
              <div
                className="w-full border flex justify-between items-center mb-3 rounded-[5px]"
                key={index}
              >
                <div className="flex gap-5 items-center justify-start">
                  <Avatar>
                    <AvatarFallback className="!rounded-[5px] !w-[60px] !h-[60px]"></AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{students}</p>
                </div>
                <span className="mr-10"><IoArrowForwardOutline size={24} /></span>
              </div>
            ))}
          </TabContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EnrolledStudents;
