import React, { useEffect, useState } from "react";
import TopNav from "../components/topnav/TopNav";
import Description from "../components/Description";
import Features from "../components/Features";
import Footer from "../components/Footer";
import MobileNavigation from "../components/MobileNavigation";
import { useMediaQuery } from "@mui/material";
import {
  arrow,
  landing_img,
} from "../utils/images";
import { useNavigate } from "react-router";
import CustomButton from "../components/ui/Button";
import OurReasonsSection from "../components/OurReasonsSection";
import axios from "axios";
import { SERVER_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setShowSendmeUpdatesDialog } from "../features/reducers/uiSlice";
import ConsentBanner from "../components/modals/ConsentBanner";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Grading", "Marking", "Scoring"];

const Landing = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const currentWord = words[index];

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


  const handleClick = () => {
    navigate("/onboarding");
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    const welcome = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}`);
        if (response.status === 200) {
          console.log(response.data);
        }
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    welcome();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setShowSendmeUpdatesDialog(true));
    }, 5000);

    return () => clearTimeout(timer); // cleanup if unmounted early
  }, [dispatch]);

  return (
    <>
      {isMobile ? (
        <MobileNavigation
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
      ) : (
        <TopNav />
      )}
      <div className="bg-gradient-to-t from-[#C7CEEC] w-full p-4" id="home">
        <div className="flex flex-row justify-center items-center w-full mt-2">
          <button className="h-10 flex md:w-52 w-40 items-center justify-center md:mt-12 border border-[#1836B2] text-[#1836B2] font-normal text-sm p-2 rounded-full bg-[#86c7ed4f]">
            Reclaim your time
          </button>
        </div>
        <div className="flex flex-col justify-center items-center w-full mt-8">
          <h1 className="font-metropolis text-center font-bold text-5xl leading-[107%] tracking-[0%] max-w-[900px] md:text-6xl xl:text-[80px] md:leading-[65px] xl:leading-[85.86px] items-center">
            <div className="inline-block font-metropolis mr-4 leading-tight">Turn Hours of {" "}</div>
            <span className="relative font-metropolis leading-[100%] px-2 max-[340px]:w-[80%] border-primary-main border-[1.5px] py-1 mx-1 inline-block h-[56px] w-[120px] max-md:max-w-[240px] max-md:w-[65%] max-sm:h-auto md:w-auto md:h-auto">
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
              
              {/* Corner squares */}
              <div className="absolute top-[-6px] left-[-6px] bg-white w-[11px] h-[11px] border-[1px] border-primary-main"></div>
              <div className="absolute top-[-6px] right-[-6px] bg-white w-[11px] h-[11px] border-[1px] border-primary-main"></div>
              <div className="absolute bottom-[-6px] left-[-6px] bg-white w-[11px] h-[11px] border-[1px] border-primary-main"></div>
              <div className="absolute bottom-[-6px] right-[-6px] bg-white w-[11px] h-[11px] border-[1px] border-primary-main"></div>

            </span>
            <div className="inline-block">into Minutes.</div>
          </h1>
          <h3 className="inter w-full max-w-[750px] flex justify-center font-inter font-normal md:text-2xl text-[16px] items-center text-center mt-6">
            Automate every step of the exam process, from creation to grading
            and managing results for all your students
          </h3>
          <CustomButton
            // onClick={() => {
            //   handleClick();
            // }}
            onClick={() => dispatch(setShowSendmeUpdatesDialog(true))}
            className="inter !font-normal flex flex-row w-max hover:border-white border-[3px] gap-3 leading-[24.2px] md:h-16 h-12 rounded-xl mt-8 md:!px-6 md:text-xl text-white justify-center items-center bg-[#1836B2] mb-10"
          >
            Send me updates
            <img src={arrow} alt="arrow" />
          </CustomButton>
        </div>
      </div>
      <div className="w-full pl-10 max-md:p-0 relative">
        <div className="absolute h-1/2 bg-[#C7CEEC] w-full left-0"></div>
        <div className="relative w-full max-w-6xl max-md:max-w-[100vw] mx-auto">
          <img src={landing_img} alt="" className="rounded-lg" />
        </div>
      </div>
      <Description />
      <OurReasonsSection />
      <Features />
      {/* <CTASection /> */}
      <Footer />
      {/* <BetaWaitlistDialog /> */}
      <ConsentBanner />
    </>
  );
};

// const BetaWaitlistDialog = () => {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState("");
//   const [sending, setSending] = useState(false);
//   const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
//   const isOpen = useSelector((state) => state.ui.showSendmeUpdatesDialog);

//   // Returns an error message if invalid, or empty string if OK
//   const validateEmail = (value) => {
//     if (!value.trim()) {
//       return "Email is required";
//     }
//     // RFC-style basic check
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(value)) {
//       return "Please enter a valid email address";
//     }
//     return "";
//   };

//   const submitEmail = async (e) => {
//     e.preventDefault();

//     const validationError = validateEmail(email);
//     if (validationError) {
//       // immediate user feedback
//       showToast(validationError, "error");
//       return;
//     }

//     setSending(true);

//     try {
//       const response = await apiCall.post("/newsletter/signup/", { email });
//       if (response.status === 200) {
//         showToast("Thank you for subscribing to our newsletter", "success");
//         setEmail("");
//         // Close dialog after successful submission
//         setTimeout(() => {
//           dispatch(setShowSendmeUpdatesDialog(false));
//         }, 2000);
//       }
//     } catch (error) {
//       const status = error.response?.status;
//       if (status === 400) {
//         showToast("That email looks invalid to us, please check again.", "error");
//       } else {
//         showToast(`Unexpected error: ${error.message}`, "error");
//       }
//     } finally {
//       setSending(false);
//     }
//   };

//   const showToast = (message, severity = "info") => {
//     setToast({ open: true, message, severity });
//   };
//   const closeToast = () => setToast({ open: false, message: "", severity: "info" });

//   // Derive validation state for disabling the button
//   const emailError = validateEmail(email);

//   return (
//     <CustomBlurBgDialog
//       open={isOpen}
//       onOpenChange={(open) => dispatch(setShowSendmeUpdatesDialog(open))}
//     >
//       <div className="w-full p-8 px-16 relative overflow-hidden">
//         <img
//           src={firstabsolute}
//           className="absolute right-0 bottom-[-50px] z-0 h-2/3"
//           alt=""
//         />
//         <img
//           src={secondabsolute}
//           className="absolute right-[30px] bottom-[-50px] z-0 h-1/3"
//           alt=""
//         />
//         <div className="flex flex-col relative z-10">
//           <h3 className="font-metropolis font-bold text-[16.61px] md:text-[28px] leading-[100%] text-center max-w-[600px]">
//             Be the first to know when Acad AI launches!
//           </h3>
//           <form
//             className="w-full mt-4 md:mt-8 flex items-center flex-col"
//             onSubmit={submitEmail}
//           >
//             <Input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className=""
//               required
//               placeholder="Enter your email here"
//             />
//             <CustomButton
//               type="submit"
//               className="min-w-[170px] !min-h-11 !py-3 gap-1 !font-normal !rounded-[14px] md:mt-8 mt-4"
//               loading={sending}
//               disabled={sending}
//             >
//               Get Updates <GoArrowUpRight size={20} />
//             </CustomButton>
//           </form>
//         </div>
//       </div>

//       <Toast
//         open={toast.open}
//         message={toast.message}
//         severity={toast.severity}
//         onClose={closeToast}
//       />
//     </CustomBlurBgDialog>
//   );
// };

export default Landing;