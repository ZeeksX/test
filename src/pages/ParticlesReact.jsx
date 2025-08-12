/* eslint-disable react/prop-types */
import Landing from "./Landing";
import { background_pattern } from "../utils/images";
import SEO from "../components/SEO";

const ParticlesReact = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <SEO
        title="ACAD AI - Turn Grading Hours into Minutes"
        description="An efficient, AI-powered examination grading system designed to deliver fast, accurate, and automated grading."
        image="https://firebasestorage.googleapis.com/v0/b/mobile-design-project.appspot.com/o/acad-ai%2FACAD%20AI%20logo.png?alt=media&token=dcd7f49a-bf0f-4b01-be3f-0ad851bdd2f5"
        url="https://acadai.co/"
      />
      <img src={background_pattern} className="absolute w-[100vw] scale-[300%] sm:scale-[100%]" alt="" />
      <div className="flex flex-col items-center gap-2 lg:gap-0 w-full relative z-10">
        <div className="flex flex-col items-center w-full">
          <Landing sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </div>
  );
};

export default ParticlesReact;
