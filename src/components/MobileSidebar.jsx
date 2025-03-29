import React, { useEffect, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Link } from "react-router-dom"
import { bannerLogo } from '../utils/images';

const MobileSidebar = ({ toggleSidebar, sidebarOpen }) => {
    const [shouldRender, setShouldRender] = useState(sidebarOpen);
    const navLinks = ["Home", "Features", "Services", "Contact"];

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
    }
    return (
        <div className={`mobile-sidebar ${sidebarOpen ? 'open' : 'close'}`}>
            <CloseOutlinedIcon onClick={handleClose} sx={{ color: "#1836B2" }} />
            <div className='flex flex-col gap-12 items-center min-h-screen'>
                <img className='w-1/2' src={bannerLogo} alt="Acad AI logo" />
                <div className="flex flex-col items-center justify-between">
                    <ul className="flex flex-col gap-8 w-full justify-between">
                        {navLinks.map((link, index) => (
                            <li
                                key={index}
                                className=" text-[#1836B2] leading-[19px] cursor-pointer font-normal text-sm md:text-base"
                            >
                                {link}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex gap-6 items-center">
                    <Link to="/login">
                        <button
                            className="flex flex-row cursor-pointer w-24 rounded-lg py-2 px-3 font-medium text-sm text-white justify-center items-center hover:bg-[#0061A2] bg-[#1836B2]"
                        >
                            Login
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button
                            className="flex flex-row w-24 cursor-pointer rounded-lg py-2 px-3 font-medium text-sm text-white justify-center items-center hover:bg-[#0061A2] bg-[#1836B2]">
                            Sign up
                        </button>
                    </Link>

                </div>
            </div>

        </div>

    )
}

export default MobileSidebar