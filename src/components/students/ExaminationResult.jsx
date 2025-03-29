import React from 'react'
import { useLocation } from 'react-router'
import ProgressBar from '../ui/ProgressBar';

const ExaminationResult = () => {
    const location = useLocation();
    const exam = location.state.exam;
    console.log(exam)
    return (
        <div className='mt-[60px]'>
            <div className='py-6 px-11 flex flex-col gap-4'>
                <h1 className='text-[32px] leading-8 font-medium'>{exam.exam_name} - Results</h1>
                <p className="text-sm text-[#222222] font-normal">Lorem ipsum dolor sit amet consectetur. At aliquet pharetra non sociis.</p>
            </div>
            <hr className='text-[#D0D5DD] mb-4' />

            <div className='w-full flex justify-center items-center'>
                <div className='bg-white flex flex-row justify-between px-32 gap-12 border my-8 border-[#D0D5DD] rounded-md w-4/5 h-[408px] py-10'>
                    <div className='w-[356px] h-[327px] flex flex-col justify-between'>
                        <div className='flex flex-col justify-between gap-10'>
                            <div>
                                <ProgressBar />
                            </div>
                            <h1 className='text-[#A1A1A1] text-[40px] font-semibold'>
                                <span className='text-[#1836B2] text-9xl font-semibold'>85</span>/100</h1>
                        </div>
                        <p className='text-[#1836B2] text-base font-semibold'>Congratulations! You passed the examination!</p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div>
                            <h1 className='text-base'>Total Number of Questions</h1>
                            <span className='text-[#A1A1A1] text-[40px]'>50</span>
                        </div>
                        <div>
                            <h1 className='text-base'>Number of right answers</h1>
                            <span className='text-[#34A853] text-[40px]'>37</span>
                        </div>
                        <div>
                            <h1 className='text-base'>Number of wrong answers</h1>
                            <span className='text-[#EA4335] text-[40px]'>13</span>
                        </div>
                        <button
                            className='bg-[#1835B3] w-[92px] h-11 gap-2 text-white flex items-center justify-center font-inter font-semibold text-base rounded-md px-4 hover:ring-2'
                        >
                            Review
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ExaminationResult