import React from "react";
import {
  firstabsolute,
  secondabsolute,
  whatwebelieve,
  whatwedo,
  whyweexist,
} from "../utils/images";

const OurReasonsSection = () => {
  const reasons = [
    {
      title: "Why We Exist",
      description:
        "Acad AI was created to ease the burden of exam creation and grading for teachers, while ensuring students receive clear, timely feedback to support real learning.",
      icon: whyweexist,
    },
    {
      title: "What We Do",
      description:
        "We automate the tedious parts of assessments — from organizing to grading — giving teachers control and providing students with transparent, insightful results.",
      icon: whatwedo,
    },
    {
      title: "What We Believe",
      description:
        "We believe in efficiency, clarity, and empowering educators and students alike, creating a fair, feedback-driven assessment experience for all.",
      icon: whatwebelieve,
    },
  ];
  return (
    <div className="md:px-10 px-5 mb-12 w-full overflow-hidden pt-10" id="our-why">
      <div className="px-8 py-12 w-full rounded-[28px] bg-[#DDEFF9] relative overflow-hidden">
        <img src={firstabsolute} className="absolute right-0 z-0 h-full" alt="" />
        <img src={secondabsolute} className="absolute right-[20%] bottom-[20px] z-0" alt="" />
        <div className="flex flex-col relative z-10">
          <button className="text-primary-main text-xs md:text-base border cursor-default w-max bg-[#86C7ED4F] border-primary-main px-3 py-1.5 rounded-full">
            Our Why
          </button>
          <h2 className="font-metropolis text-xl md:text-[30px] font-bold mt-4 mb-8">
            Making Learning and Teaching Easier
          </h2>
          <div className="flex flex-wrap justify-evenly w-full gap-8">
            {reasons.map((reason, index) => (
              <div
                className="flex-1 min-w-[300px] max-md:min-w-[250px] bg-white md:p-8 p-6 rounded-[26px]"
                key={index}
              >
                <img src={reason.icon} alt="" className="mb-4" />
                <h3 className="font-metropolis text-[24px] font-bold mb-4 relative">
                  {reason.title}
                </h3>
                <p className="font-metropolis text-sm md:text-base text-justify">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurReasonsSection;
