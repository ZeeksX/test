import React from "react";
import {
  for_educators,
  for_students,
  for_students_img,
  for_teachers_img,
  placeholder,
} from "../../utils/images";

const Description = () => {
  const items = [
    {
      title: "To Educators",
      description:
        "We understand the demands on educators. Endless hours spent creating, distributing, and grading exams take away from valuable teaching time and personal life. Acad AI is here to change that.",
      image: for_teachers_img,
      icon: for_educators,
      reverse: true,
    },
    {
      title: "To Students",
      description:
        "Acad AI connects you directly with your teachers and exams in a streamlined way. Get your grades sooner, see precisely what made up your score, and receive useful feedback to guide your learning with Acad AI.",
      image: for_students_img,
      icon: for_students,
      reverse: false,
    },
  ];

  return (
    <div className="px-5 mt-20 mb-10">
      {items.map((item, index) => (
        <div key={index} className="w-full flex-shrink-0 mb-10">
          <div
            className={`flex flex-col-reverse lg:flex-row items-center gap-10 p-4 ${
              item.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            }`}
          >
            <div className="w-full lg:w-1/2 relative">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden flex items-center">
                <img
                  src={item.image || ""}
                  alt={item.title}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <h3 className="font-metropolis text-[40px] font-bold mb-8 relative">
                {item.title}
                <img
                  src={item.icon}
                  alt=""
                  className="absolute left-[calc(100%_-_50px)] top-[-15px]"
                />
              </h3>
              <p className="font-metropolis text-xl text-justify mb-6">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Description;
