import React from 'react';

const Features = () => {
    return (
        <div className='flex flex-col gap-6 justify-center items-center w-full py-0 lg:py-12'>
            <h1 className='text-center text-4xl font-bold mb-8'>Our Features</h1>
            <div className='flex flex-col lg:flex-row justify-between items-center gap-8 w-[90vw]'>
                {/* Feature 1 */}
                <div className='feature w-full max-w-[350px] md:max-w-[430px] md:w-[427px] flex items-center flex-col rounded-[44px] p-6 md:p-[44px] lg:p-[25px] xl:p-[44px] bg-white transition-shadow duration-300'>
                    <h1 className='metropolis w-[90%] lg:w-4/5 xl:w-[90%] text-2xl md:text-3xl lg:text-2xl xl:text-3xl leading-[30px] text-center font-bold mb-4'>
                        Exam Room Creation:
                    </h1>
                    <h3 className='metropolis-normal font-light text-center text-base md:text-[20px] lg:text-sm xl:text-[20px] leading-6'>
                        Teachers can create customizable exam rooms tied to course-specific information like title, code, and description.
                    </h3>
                </div>

                {/* Feature 2 */}
                <div className='feature w-full max-w-[350px] md:max-w-[430px] md:w-[427px] flex items-center flex-col rounded-[44px] p-4 md:p-[44px] lg:py-[25px] lg:px-[14px] xl:py-[44px] xl:px-[36px] bg-white transition-shadow duration-300'>
                    <h1 className='metropolis w-[90%] lg:w-full text-2xl md:text-3xl lg:text-2xl xl:text-3xl leading-[30px] text-center font-bold mb-4'>
                        Automated Scoring and Feedback:
                    </h1>
                    <h3 className='metropolis-normal font-light text-center text-base md:text-[20px] lg:text-sm xl:text-[20px] leading-6'>
                        Exam submissions are automatically graded, and both students and teachers receive AI-generated feedback and analytics.
                    </h3>
                </div>

                {/* Feature 3 */}
                <div className='feature w-full max-w-[350px] md:max-w-[430px] md:w-[427px] flex items-center flex-col rounded-[44px] p-6 md:p-[44px] lg:p-[25px] xl:p-[44px] bg-white transition-shadow duration-300'>
                    <h1 className='metropolis w-[90%] lg:w-4/5 xl:w-[90%] text-2xl md:text-3xl lg:text-2xl xl:text-3xl leading-[30px] text-center font-bold mb-4'>
                        Analytics Dashboards:
                    </h1>
                    <h3 className='metropolis-normal font-light text-center text-base md:text-[20px] lg:text-sm xl:text-[20px] leading-6'>
                        Comprehensive performance tracking for both students and teachers, with individual course and general overviews.
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default Features;