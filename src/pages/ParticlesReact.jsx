import React, { useEffect } from "react";
import Landing from "./Landing";
import { background_pattern } from "../utils/images";
import SEO from "../components/SEO";

// Helper function to load the particles.js script dynamically.
const loadParticlesScript = () => {
  return new Promise((resolve, reject) => {
    // If particlesJS is already available on window, resolve immediately.
    if (window.particlesJS) {
      return resolve();
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load particles.js"));
    document.body.appendChild(script);
  });
};

const ParticlesReact = ({ sidebarOpen, toggleSidebar }) => {
  useEffect(() => {
    loadParticlesScript()
      .then(() => {
        window.particlesJS("particles-js", {
          particles: {
            number: {
              value: 200,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: { value: "#000000" },
            shape: {
              type: "circle",
              stroke: { width: 0, color: "#000000" },
              polygon: { nb_sides: 5 },
            },
            opacity: {
              value: 0.1,
              random: false,
              anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
            },
            size: {
              value: 3,
              random: true,
              anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#000000",
              opacity: 0.1,
              width: 0.8,
            },
            move: {
              enable: true,
              speed: 6,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "bounce",
              bounce: false,
              attract: { enable: false, rotateX: 600, rotateY: 1200 },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: false, mode: "repulse" },
              onclick: { enable: false, mode: "push" },
              resize: true,
            },
            modes: {
              grab: { distance: 400, line_linked: { opacity: 1 } },
              bubble: { distance: 400, size: 40, duration: 2, opacity: 0.1, speed: 3 },
              repulse: { distance: 200, duration: 0.4 },
              push: { particles_nb: 4 },
              remove: { particles_nb: 2 },
            },
          },
          retina_detect: true,
          // Optional demo configuration (won't affect behavior)
          config_demo: {
            hide_card: false,
            background_color: "",
            background_image: "",
            background_position: "50% 50%",
            background_repeat: "no-repeat",
            background_size: "cover",
          },
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <SEO
        title="ACAD AI - Turn Grading Hours into Minutes"
        description="An efficient, AI-powered examination grading system designed to deliver fast, accurate, and automated grading."
        image="https://firebasestorage.googleapis.com/v0/b/mobile-design-project.appspot.com/o/acad-ai%2FACAD%20AI%20logo.png?alt=media&token=dcd7f49a-bf0f-4b01-be3f-0ad851bdd2f5"
        url="https://acadai.co/"
      />
      {/* Container for particles.js */}
      <div
        id="particles-js"
        className="absolute -z-10 top-0 left-0 w-full pointer-events-none h-[55rem] bg-gradient-to-b from-white to-[#C7CEEC]"
      ></div>
      {/* <img src={background_pattern} className="absolute w-[100vw]" alt="" /> */}
      <div className="flex flex-col items-center gap-2 lg:gap-0 w-full relative z-10">
        <div className="flex flex-col items-center w-full">
          <Landing sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </div>
  );
};

export default ParticlesReact;
