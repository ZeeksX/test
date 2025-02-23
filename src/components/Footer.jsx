import React from 'react';
import logo from "../assets/footer-logo.png";
import { Link } from 'react-router-dom';
import instagram from "../assets/instagram.png"
import github from "../assets/github.png"
import twitter from "../assets/twitter.png"
import figma from "../assets/figma.png"

const Footer = () => {
    const footerItems = ["Home", "Features", "Services", "Contact"];

    const socialIcons = [
        {
            name: "github",
            icon: github,
            url: ""
        },
        {
            name: "instagram",
            icon: instagram,
            url: ""
        },
        {
            name: "figma",
            icon: figma,
            url: ""
        },
        {
            name: "twitter",
            icon: twitter,
            url: ""
        }
    ]

    return (
        <div className='bg-[url("/footer-background.svg")] w-full flex flex-col justify-center items-center h-96 mt-44 pt-8'>
            <div className='flex w-4/5 items-center justify-between flex-row mt-12'>
                <div className='flex flex-col gap-8'>
                    <img className='w-1/2' src={logo} alt="Acad-AI logo" />
                    <button className='roboto w-[274px] h-[66px] bg-white rounded-[5px]'>Contact Us</button>
                </div>
                <div className='flex flex-col gap-4'>
                    {footerItems.map((item) => (
                        <Link key={item} className='inter font-normal text-base text-white leading-[19.43px]' to={`#${item}`}>
                            {item}
                        </Link>
                    ))}
                </div>
                <div className='flex flex-col gap-4'>
                    {socialIcons.map((item) => (
                        <Link key={item.name} className='inter font-normal text-base text-white leading-[19.43px]' to={`${item.url}`}>
                            <img src={item.icon} alt={item.name} />
                        </Link>
                    ))}
                </div>
            </div>
            <p className='mt-12 text-center inter font-light text-white text-xs leading-[14.52px]'>© 2025 All Rights Reserved</p>
        </div>
    );
}

export default Footer;