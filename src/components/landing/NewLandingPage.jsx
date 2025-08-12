import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { new_landing_img, new_landing_img_sm } from "../../utils/images";
import { PiStarFourFill } from "react-icons/pi";
import CustomButton from "../ui/Button";

const words = ["Grading", "Marking", "Scoring"];

const NewLandingPage = () => {
  const [index, setIndex] = useState(0);
  const currentWord = words[index];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 950);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 5000); // change word every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const wordVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.25,
      },
    }),
    exit: (i) => ({
      opacity: 0,
      x: 20,
      transition: {
        delay: i * 0.25,
      },
    }),
  };
  return (
    <div
      className="bg-gradient-to-t from-[#C7CEEC] w-full flex flex-col land:flex-row p-4 px-4 sm:px-6 md:px-8 lg:px-[4.5%] md:mt-24 gap-12 sm:gap-8 lg:gap-0"
      id="home"
    >
      <div className="flex-1 flex flex-col items-start justify-start sm:pt-12 xl:pt-20 gap-3 relative">
        <PiStarFourFill
          color="white"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-[150px] lg:h-[150px] opacity-40 absolute -bottom-4 sm:-bottom-8 md:bottom-0 right-4 sm:right-8 lg:right-[80%]"
        />
        <span className="flex gap-3 items-center justify-start">
          <PiStarFourFill color="#1835B3" />
          <p className="text-neutral-new text-[13px]">Reclaim your time</p>
        </span>
        <div className="relative w-full">
          <h1 className="text-[34px] sm:text-[50px] md:text-[46px] xl:text-[58px] leading-[1.2] relative land:w-[calc(100%_+_80px)] font-medium">
            <div className="inline-block font-metropolis mr-1 sm:mr-2 leading-[1] text-[#222222]">
              Turn hours of{" "}
            </div>
            <span className="relative font-metropolis leading-[100%] py-1 mx-1 mr-3 inline-block bg-gradient-to-r from-[#85C7ED] to-[#155EEF] bg-clip-text text-transparent">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWord}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="max-md:w-full"
                >
                  {currentWord.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={wordVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </span>
            <div className="inline-block leading-[1] text-[#222222]">
              into Minutes
            </div>
          </h1>
        </div>
        <p className="text-neutral-new text-sm leading-6">
          Effortlessly grade exams with AI-powered precision—saving you time,
          stress, and energy.
        </p>
        <div className="flex flex-col land:flex-row items-center justify-start gap-4 mt-4 w-full">
          <CustomButton className="h-[40px] w-full land:w-[150px] !font-normal">
            Get Started Now
          </CustomButton>
          <CustomButton
            variant="ghost"
            className="h-[40px] w-full land:w-[160px] border !font-normal !text-primary-main bg-transparent border-primary-main hover:!text-white"
          >
            Send me Updates
          </CustomButton>
        </div>
      </div>
      <img
        src={isMobile ? new_landing_img_sm : new_landing_img}
        alt=""
        className="flex-1 land:max-w-[55%]"
      />
    </div>
  );
};

export default NewLandingPage;
