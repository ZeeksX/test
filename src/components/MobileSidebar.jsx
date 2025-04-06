import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { bannerLogo } from '../utils/images';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const MobileSidebar = ({ toggleSidebar, sidebarOpen }) => {
    const [shouldRender, setShouldRender] = useState(sidebarOpen);
    const navItems = [
        { name: "Home", icon: <HomeIcon />, link: "/" },
        { name: "Features", icon: <LibraryBooksIcon />, link: "/features" },
        { name: "Services", icon: <BeenhereIcon />, link: "/services" },
        { name: "Contact", icon: <AccountCircleIcon />, link: "/contact" },
    ];

    useEffect(() => {
        if (sidebarOpen) {
            setShouldRender(true);
        } else {
            setTimeout(() => setShouldRender(false), 500);
        }
    }, [sidebarOpen]);

    if (!shouldRender) return null;

    const handleClose = () => {
        toggleSidebar();
    };

    return (
        <>
            <div className={`mobile-sidebar ${sidebarOpen ? "open" : "close"}`}>
                <div className="flex flex-col gap-12 items-start h-full p-4">
                    <img className="w-full" src={bannerLogo} alt="Acad AI logo" />
                    <div className="flex flex-col items-center justify-between w-full">
                        <ul className="flex flex-col gap-8 w-full">
                            {navItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="text-[#1836B2] leading-[19px] cursor-pointer font-normal text-sm md:text-base"
                                >
                                    <Link to={item.link} className="flex items-center gap-2">
                                        {item.icon} {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-6 items-start w-full">
                        <Link to="/login" className="w-4/5">
                            <button className="w-full cursor-pointer rounded-lg py-2 px-3 font-medium text-sm text-white bg-[#1836B2] hover:bg-[#0061A2]">
                                Login
                            </button>
                        </Link>
                        <Link to="/onboarding" className="w-4/5">
                            <button className="w-full cursor-pointer rounded-lg py-2 px-3 font-medium text-sm text-white bg-[#1836B2] hover:bg-[#0061A2]">
                                Sign up
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 lg:hidden z-20"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default MobileSidebar;