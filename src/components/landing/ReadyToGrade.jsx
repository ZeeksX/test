import React from 'react'

const ReadyToGrade = () => {
    return (
        <div className='ready-to-grade flex flex-row items-center max-md:flex-col h-[500px] justify-between w-full px-16 py-10'>
            <div className='ready-background h-[400px] w-full px-10 py-16'>
                <div className='w-[536px] flex flex-col gap-5'>
                    <h1 className='text-5xl text-[#454545] font-semibold'>Ready to Grade Faster and Smarter?</h1>
                    <p className='text-[#454545] text-sm font-normal leading-6'>Join educators using Acad AI to save hours, give better feedback, and focus on what really matters - teaching.</p>
                </div>
                <div className='flex flex-row gap-4 mt-10'>
                    <button
                        className='bg-[#1836B2] text-[#ffffff] w-[181px] h-[44px] rounded-lg text-sm font-semibold border border-[#0C289B]'>
                        Get started for Free
                    </button>
                    <button
                        className='bg-[#ffffff] text-[#1836B2] w-[181px] h-[44px] rounded-lg text-sm font-semibold border border-[#0C289B]'>
                        Send me updates
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReadyToGrade