import React from 'react';
import TopNav from '../components/topnav/TopNav';
import arrow from "/Vector.svg";
import VideoSection from '../components/VideoSection';
import Description from '../components/Description';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Landing = () => {
    return (
        <>
            <TopNav />
            <div className='flex flex-row justify-center items-center w-full mt-2'>
                <button className='h-10 cursor-pointer flex w-52 items-center justify-center mt-12 border border-[#1836B2] text-[#1836B2] hover:text-white hover:bg-[#1836B2] font-normal text-sm p-2 rounded-full bg-[#86c7ed4f]'>Reclaim your time</button>
            </div>
            <div className='flex flex-col justify-center items-center w-full mt-8'>
                <h1 className='metropolis w-3/5 flex text-center font-medium text-6xl lg:text-[80px] leading-[85.86px] items-center'>Turn Hours of Grading into Minutes.</h1>
                <h3 className='inter flex text-center font-normal text-2xl leading-[29.05px] items-center mt-6'>Streamline your workflow with automated exam creation, proctoring, and grading.</h3>
                <button className='inter flex flex-row w-[183px] border-white border-[3px] gap-3 leading-[24.2px] h-16 rounded-xl mt-8 mb-16 font-normal text-xl text-white justify-center items-center bg-[#1836B2]'>
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