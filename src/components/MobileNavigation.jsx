import React from 'react'
import logo from "../assets/brand.jpg";
import DensityMediumOutlinedIcon from '@mui/icons-material/DensityMediumOutlined';
import MobileSidebar from './MobileSidebar';
const MobileNavigation = ({ toggleSidebar, sidebarOpen }) => {

    return (
        <>
            <div className="w-[90vw] mx-auto flex flex-row items-center justify-between h-12 my-4">
                <div className="flex flex-row items-center">
                    <img className="w-full h-12" src={logo} alt="Acad AI logo" />
                </div>
                <div onClick={toggleSidebar} className="cursor-pointer">
                    <DensityMediumOutlinedIcon sx={{ color: "#1836B2" }} />
                </div>
            </div>


            {/* Backdrop */}
            {sidebarOpen && (<div className="fixed bg-black inset-0 z-10 opacity-50" ></div>)}

            <MobileSidebar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        </>
    )
}

export default MobileNavigation