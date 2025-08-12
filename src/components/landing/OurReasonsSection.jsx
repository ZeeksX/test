import { icon1, icon2, icon3 } from "../../utils/images";

const OurReasonsSection = () => {
  const reasons = [
    {
      icon: icon1,
      title: "Why We Exist",
      description:
        "Acad AI was created to ease the burden of exam creation and grading for teachers, while ensuring students receive clear, timely feedback to support real learning.",
    },
    {
      icon: icon2,
      title: "What We Do",
      description:
        "We automate the tedious parts of assessments — from organizing to grading — giving teachers control and providing students with transparent, insightful results.",
    },
    {
      icon: icon3,
      title: "What We Believe",
      description:
        "We believe in efficiency, clarity, and empowering educators and students alike, creating a fair, feedback-driven assessment experience for all.",
    },
  ];
  return (
    <div className="our-why flex flex-col w-full px-[5%] py-[60px]">
      <div className="flex flex-col gap-2 max-lg:mt-4">
        <h1 className="text-[40px] text-primary-main font-medium max-lg:text-4xl leading-10">
          Our why
        </h1>
        <p className="text-sm text-[#454545] font-normal">
          Making Learning and Teaching Easier
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-stretch mt-8">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="flex flex-1 min-w-[300px] flex-col justify-start items-start gap-6 bg-primary-main rounded-xl text-white p-6 xl:p-8 max-lg:p-6"
          >
            <img
              src={reason.icon}
              alt="icon"
              className="w-[54px] h-[54px] max-[280px]:w-1/4 max-[280px]:h-1/4"
            />
            <div className="flex flex-col text-white gap-4">
              <h2 className="xl:text-[28px] text-white font-normal max-lg:font-semibold">
                {reason.title}
              </h2>
              <p className="text-sm text-white font-normal leading-6">
                {reason.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurReasonsSection;
