import React from 'react'

const Description = () => {
    return (
        <div className='flex flex-row justify-center bg-white my-32 '>
            <div className='flex flex-col lg:flex-row justify-between md:items-center gap-12 w-[85vw]'>
                <div className='flex flex-col w-full md:w-[594px] gap-8'>
                    <h1 className='metropolis w-full lg:w-[75%] font-bold text-4xl md:text-[40px] leading-[40px]'>The AI-Powered Exam System That Makes Grading Effortless</h1>
                    <h3 className='font-normal text-justify lg:text-left text-2xl leading-[29.43px]'>Grading exams manually can be a tedious and time-consuming task,
                        often leaving you with less time for what truly matters: engaging with your students and enhancing their learning experience.
                    </h3>
                </div>
                <div className='bg-[#D9D9D9] w-full md:w-[594px] h-[297px]'></div>
            </div>
        </div>
    )
}

export default Description