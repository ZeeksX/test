import React from 'react';

const Features = () => {
    return (
        <div className='flex flex-col gap-6 justify-center items-center w-full py-0 lg:py-12'>
            <h1 className='text-center text-4xl font-bold mb-8'>Our Features</h1>
            <div className='flex flex-col lg:flex-row lg:justify-between justify-center  items-center gap-8 w-[90vw]'>
                {/* Feature 1 */}
                <div className='feature py-8 px-5 gap-2 flex flex-col items-center h-[274px] lg:w-[427px] w-[90vw] rounded-[44px] bg-white transition-shadow duration-300'>
                    <div className='text-center flex justify-center'>
                        <h1 className='metropolis lg:text-2xl xl:text-3xl text-3xl font-bold mb-4 w-4/5 max-sm:w-[90%]'>
                            Exam Room Creation:
                        </h1>
                    </div>
                    <h3 className='metropolis-normal font-light text-xl text-center leading-6'>
                        Teachers can create customizable exam rooms tied to course-specific information like title, code, and description.
                    </h3>
                </div>

                {/* Feature 2 */}
                <div className='feature py-8 px-5 gap-2 flex flex-col items-center h-[274px] lg:w-[427px] w-[90vw] rounded-[44px] bg-white transition-shadow duration-300'>
                   <div className='text-center flex justify-center'>
                        <h1 className='metropolis lg:text-2xl xl:text-3xl text-3xl  font-bold mb-4 lg:w-[90%] max-sm:w-full'>
                              Automated Scoring and Feedback:
                        </h1>
                    </div>
                    <h3 className='metropolis-normal font-light text-xl text-center leading-6'>
                        Exam submissions are automatically graded, and both students and teachers receive AI-generated feedback and analytics.
                    </h3>
                </div>

                {/* Feature 3 */}
                <div className='feature py-8 px-5 gap-2 flex flex-col items-center h-[274px] lg:w-[427px] w-[90vw] rounded-[44px] bg-white transition-shadow duration-300'>
                   <div className='text-center flex justify-center'>
                        <h1 className='metropolis lg:text-2xl xl:text-3xl text-3xl font-bold mb-4 w-4/5 max-sm:w-[90%]'>
                            Analytics Dashboards:
                        </h1>
                    </div>
                    <h3 className='metropolis-normal font-light text-xl text-center leading-6'>
                        Comprehensive performance tracking for both students and teachers, with individual course and general overviews.
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default Features;