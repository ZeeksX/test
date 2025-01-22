import React from 'react';
import TopNav from '../components/topnav/TopNav';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
const Landing = () => {
    return (
        <>
            <TopNav />
            <div className='flex flex-row justify-center items-center w-full'>
                <button className=' cursor-pointer flex w-52 items-center justify-center mt-12 border-2 border-[#2d4fd8] text-[#1836B2] hover:text-white hover:bg-[#1836B2] font-normal text-sm p-2 rounded-full bg-[#95cff1]'>Reclaim your time</button>
            </div>
            <div className='flex flex-col justify-center items-center w-full mt-8'>
                <h1 className='flex text-center font-medium text-5xl items-center w-[36rem]'>Turn Hours of Grading into Minutes.</h1>
                <h3 className='flex text-center font-normal text-base items-center mt-4'>Streamline your workflow with automated exam creation, proctoring, and grading.</h3>
                <button className='flex flex-row rounded-xl py-2 px-3 mt-4 font-normal text-sm text-white justify-center items-center bg-[#1836B2]'>
                    Get started
                    <ArrowOutwardIcon sx={{
                        width: "0.75rem",
                        height: "0.75rem",
                        marginLeft: "0.25rem"
                    }} />
                </button>
            </div>
        </>
    );
}

export default Landing;