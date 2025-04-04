import React from 'react';
import { Link } from 'react-router-dom';
import { figmaLogo, footerLogo, githubLogo, instagramLogo, twitterLogo } from '../utils/images';

const Footer = () => {
    const footerItems = ["Home", "Features", "Services", "Contact"];

    const socialIcons = [
        {
            name: "github",
            icon: githubLogo,
            url: ""
        },
        {
            name: "instagram",
            icon: instagramLogo,
            url: ""
        },
        {
            name: "figma",
            icon: figmaLogo,
            url: ""
        },
        {
            name: "twitter",
            icon: twitterLogo,
            url: ""
        }
    ]

    return (
        <div className='footer md:bg-[url("/footer-background.svg")] bg-no-repeat bg-cover w-full flex flex-col justify-center items-center md:h-96 mt-44 pt-8'>
            <div className='flex w-[90%] md:w-4/5 gap-6 md:items-start justify-between flex-col md:flex-row md:mt-12'>
                <div className='flex flex-col my-8 gap-4 md:gap-8'>
                    <img className='w-1/2' src={footerLogo} alt="Acad-AI logo" />
                    <button className='roboto w-[274px] h-[66px] bg-white rounded-[5px]'>Contact Us</button>
                </div>
                <div className='flex flex-col gap-4 my-8'>
                    <h3 className='inter font-bold text-base text-white leading-[19.43px]'>Company</h3>
                    {footerItems.map((item) => (
                        <Link key={item} className='inter font-normal text-base text-white leading-[19.43px]' to={`#${item}`}>
                            {item}
                        </Link>
                    ))}
                </div>
                <div className='flex flex-col my-8 gap-4'>
                    <h3 className='inter font-bold text-base text-white leading-[19.43px]'>Socials</h3>
                    <div className='flex flex-row md:flex-col gap-4'>
                        {socialIcons.map((item) => (
                            <Link key={item.name} className='inter font-normal h-[19.43px] text-base text-white leading-[19.43px]' to={`${item.url}`}>
                                <img src={item.icon} alt={item.name} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <p className='mt-12 mb-4 text-center inter font-light text-white text-xs leading-[14.52px]'>© 2025 All Rights Reserved</p>
        </div>
    );
}

export default Footer;