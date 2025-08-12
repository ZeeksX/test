import { background_pattern, CTAImageOne, CTAImageTwo } from "../../utils/images";
import CustomButton from "../ui/Button";

const CTASection = () => {
  const ctaDetails = [
    {
      image: CTAImageOne,
      title: "To Educators",
      description:
        "We understand the demands on educators. Endless hours spent creating, distributing, and grading exams take away from valuable teaching time and personal life. Acad AI is here to change that.",
      buttonText: "Get Started as an Educator",
    },
    {
      image: CTAImageTwo,
      title: "To Students",
      description:
        "Acad AI connects you directly with your teachers and exams in a streamlined way. Get your grades sooner, see precisely what made up your score, and receive useful feedback to guide your learning with Acad AI.",
      buttonText: "Get Started as a Student",
    },
  ];

  return (
    <div className="flex flex-col w-full px-[5%] py-[60px] pt-0 relative">
      <img
        src={background_pattern}
        className="absolute w-[100vw] scale-[300%] sm:scale-[100%] z-[-10]"
        alt=""
      />
      <div className="flex flex-col gap-2 mt-[60px]">
        <h1 className="text-primary-main font-medium text-[28px] sm:text-[32px] leading-10">
          Made with you in mind
        </h1>
        <p className="text-sm text-[#454545] font-normal">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid,
          aliquam!
        </p>
      </div>

      <div className="flex flex-wrap gap-10 items-stretch mt-8">
        {ctaDetails.map((item, index) => (
          <div
            key={index}
            className="flex flex-1 sm:min-w-[400px] flex-col gap-2"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full object-cover rounded-t-xl"
            />
            <div className="flex flex-col mt-6 gap-3">
              <h2 className="text-[#1836B2] text-[32px] font-medium leading-10">
                {item.title}
              </h2>
              <p className="text-[#454545] text-base leading-8 font-normal">
                {item.description}
              </p>
            </div>
            <CustomButton className="bg-[#1836B2] text-white w-[313px] h-[51px] rounded-md hover:bg-[#0f2a7d] mt-4">
              {item.buttonText}
            </CustomButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CTASection;
