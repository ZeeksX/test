import React from 'react'
import { AcadInterface } from '../../utils/images'

const ReadyToGrade = () => {
    return (
        <div className='ready-to-grade flex flex-row items-center max-md:flex-col h-[500px] max-md:h-auto justify-between w-full px-16 max-md:p-6 py-10'>
            <div className='ready-background h-[400px] max-md:h-auto w-full px-10 py-16 max-md:px-4 max-md:py-8 max-md:mt-5'>
                <div className='w-[536px] max-md:w-full flex flex-col gap-5'>
                    <h1 className='xl:text-5xl md:text-4xl max-md:text-3xl text-[#454545] font-semibold'>Ready to Grade Faster and Smarter?</h1>
                    <p className='text-[#454545] text-sm font-normal leading-6'>Join educators using Acad AI to save hours, give better feedback, and focus on what really matters - teaching.</p>
                </div>
                <div className='flex flex-row max-md:flex-col gap-4 mt-10'>
                    <button
                        className='bg-[#1836B2] text-[#ffffff] max-md:w-full w-[181px] h-[44px] rounded-lg text-sm font-semibold border border-[#0C289B]'>
                        Get started for Free
                    </button>
                    <button
                        className='bg-[#ffffff] text-[#1836B2] max-md:w-full w-[181px] h-[44px] rounded-lg text-sm font-semibold border border-[#0C289B]'>
                        Send me updates
                    </button>
                </div>
                <div className='hidden max-md:flex justify-center items-center mt-4'>
                    <img src={AcadInterface} alt="" />
                </div>
            </div>
        </div>
    )
}

export default ReadyToGrade