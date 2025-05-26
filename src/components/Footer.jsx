// import React from "react";
// import { Link } from "react-router-dom";
import { GrLinkedinOption } from "react-icons/gr";
// import { TiSocialFacebookCircular } from "react-icons/ti";
import { footerLogo } from "../utils/images";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";

const Footer = () => {
  const footerItems = [
    { title: "Home", link: "#home" },
    { title: "Our Why", link: "#our-why" },
    { title: "Features", link: "#features" },
    { title: "Contact Us", link: "#contact-us" },
  ];

  const socialIcons = [
    {
      name: "LinkedIn",
      icon: GrLinkedinOption,
      url: "https://www.linkedin.com/company/acad-ai/",
    },
    {
      name: "instagram",
      icon: BsInstagram,
      url: " https://www.instagram.com/acad__ai/",
    },
    {
      name: "facebook",
      icon: FaFacebookF,
      url: "https://www.facebook.com/people/ACAD-AI/61575249458622/",
    },
    {
      name: "twitter",
      icon: FaXTwitter,
      url: "https://x.com/acad__ai",
    },
  ];

  return (
    <div
      className='footer md:bg-[url("/footer-background.svg")] bg-no-repeat bg-cover w-full flex flex-col justify-center items-center md:h-96 mt-10 pt-8'
      id="contact-us"
    >
      <div className="flex w-[90%] md:w-4/5 gap-6 md:items-start justify-between flex-col md:flex-row md:mt-12">
        <div className="flex flex-col my-8 gap-4 md:gap-8">
          <img className="w-1/2" src={footerLogo} alt="Acad-AI logo" />
          <a
            href="mailto:info@acadai.co"
            className="roboto w-[274px] h-[66px] flex items-center justify-center bg-white rounded-[5px]"
          >
            Contact Us
          </a>
        </div>
        <div className="flex flex-col gap-4 my-8">
          <h3 className="inter font-bold text-base text-white leading-[19.43px]">
            Company
          </h3>
          {footerItems.map((item, index) => (
            <a
              key={index}
              className="inter font-normal text-base text-white leading-[19.43px]"
              href={item.link}
            >
              {item.title}
            </a>
          ))}
        </div>
        <div className="flex flex-col my-8 gap-4">
          <h3 className="inter font-bold text-base text-white leading-[19.43px]">
            Socials
          </h3>
          <div className="flex flex-row md:flex-col gap-5">
            {socialIcons.map((item) => (
              <a
                key={item.name}
                className="inter font-normal h-[19.43px] text-base text-white leading-[19.43px]"
                href={item.url}
                target="blank"
              >
                <item.icon size={24} color="#ffffff" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-12 mb-4 text-center inter font-light text-white text-xs leading-[14.52px]">
        © 2025 All Rights Reserved. ACAD AI Ltd.
      </p>
    </div>
  );
};

export default Footer;
