import { useNavigate } from "react-router";
import { arrow, bannerTransparent } from "../../utils/images.js";
import { useDispatch } from "react-redux";
import { setShowSendmeUpdatesDialog } from "../../features/reducers/uiSlice.jsx";
import { useState, useEffect } from "react";

const TopNav = () => {
  const navLinks = [
    { title: "Home", link: "#home" },
    { title: "Our Why", link: "#our-why" },
    { title: "Features", link: "#features" },
    { title: "Contact Us", link: "#contact-us" },
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [arrowLoaded, setArrowLoaded] = useState(false);

  useEffect(() => {
    // Preload the banner image
    const bannerImg = new Image();
    bannerImg.src = bannerTransparent;
    bannerImg.onload = () => setImageLoaded(true);

    // Preload the arrow image
    const arrowImg = new Image();
    arrowImg.src = arrow;
    arrowImg.onload = () => setArrowLoaded(true);
  }, [bannerTransparent, arrow]);

  const handleClick = () => {
    navigate("/onboarding");
  };

  return (
    <div className="w-[90vw] mx-auto flex flex-row items-center justify-between h-12 my-4">
      <a className="flex flex-row items-center" href="/">
        <div className="w-full max-md:w-3/5 h-12 relative flex items-center">
          {!imageLoaded && (
            <div className="w-full h-12 bg-gray-100 animate-pulse rounded"></div>
          )}
          <img
            className={`w-auto h-16 object-contain ${imageLoaded ? "block" : "hidden"
              }`}
            src={bannerTransparent}
            alt="Acad AI logo"
            loading="lazy"
          />
        </div>
      </a>
      <div className="hidden md:flex flex-row lg:w-1/3 items-center justify-between">
        <ul className="flex flex-row w-full md:gap-4 lg:gap-6 justify-between">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.link}
              className="text-[#1836B2] leading-[19px] cursor-pointer font-normal text-sm"
            >
              {link.title}
            </a>
          ))}
        </ul>
      </div>
      <button
        onClick={handleClick}
        className="hidden md:flex flex-row gap-3 hover:ring-2 rounded-[10px] w-[143px] h-[50px] font-normal text-sm md:text-base leading-[19.43px] text-white justify-center items-center bg-[#1836B2]"
      >
        Get Started {""}
        <img
          src={arrow}
          alt="arrow"
          className={`w-4 h-4 object-contain ${arrowLoaded ? "block" : "hidden"}`}
          loading="lazy"
        />
      </button>

      {/* <button
        onClick={() => dispatch(setShowSendmeUpdatesDialog(true))}
        className="hidden md:flex flex-row gap-3 hover:ring-2 rounded-[10px] w-max px-4 h-[45px] font-normal text-sm md:text-sm leading-[19.43px] text-white justify-center items-center bg-[#1836B2]"
      >
        Send me updates{" "}
        <img
          src={arrow}
          alt="arrow"
          className={`w-4 h-4 object-contain ${arrowLoaded ? "block" : "hidden"}`}
          loading="lazy"
        />
      </button> */}
    </div>
  );
};

export default TopNav;