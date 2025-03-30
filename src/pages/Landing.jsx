import React from 'react';
import TopNav from '../components/topnav/TopNav';
import VideoSection from '../components/VideoSection';
import Description from '../components/Description';
import Features from '../components/Features';
import Footer from '../components/Footer';
import MobileNavigation from '../components/MobileNavigation';
import { useMediaQuery } from '@mui/material';
import { arrow } from '../utils/images';
import { useNavigate } from 'react-router';

const Landing = ({ sidebarOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/onboarding")
    }

    const isMobile = useMediaQuery('(max-width:768px)');
    return (
        <>
            {isMobile ? <MobileNavigation toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} /> : <TopNav />}
            <div className='flex flex-row justify-center items-center w-full mt-2'>
                <button className='h-10 cursor-pointer flex w-52 items-center justify-center mt-12 border border-[#1836B2] text-[#1836B2] hover:text-white hover:bg-[#1836B2] font-normal text-sm p-2 rounded-full bg-[#86c7ed4f]'>Reclaim your time</button>
            </div>
            <div className='flex flex-col justify-center items-center w-full mt-8'>
                <h1 className='metropolis w-[85vw] md:w-4/5 flex text-center font-medium text-5xl leading-[50px] md:text-6xl xl:text-[80px] md:leading-[65px] xl:leading-[85.86px] items-center'>Turn Hours of Grading into Minutes.</h1>
                <h3 className='inter max-md:w-[85vw] w-[90vw] flex justify-center text-center font-normal text-2xl leading-[29.05px] items-center mt-6'>Streamline your workflow with automated exam creation, proctoring, and grading.</h3>
                <button onClick={() => { handleClick() }}
                    className='inter flex flex-row w-[183px] hover:border-white border-[3px] gap-3 leading-[24.2px] h-16 rounded-xl mt-8 mb-16 font-normal text-xl text-white justify-center items-center bg-[#1836B2]'>
                    Get started
                    <img src={arrow} alt="arrow" />
                </button>

            </div>
            <VideoSection />
            <Description />
            <Features />
            <Footer />
        </>
    );
}

export default Landing;