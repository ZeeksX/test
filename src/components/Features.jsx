import React from 'react';

const Features = () => {
    const features = [
        {
            title: "Exam Room Creation:",
            description: "Teachers can create customizable exam rooms tied to course-specific information like title, code, and description."
        },
        {
            title: "Automated Scoring and Feedback:",
            description: "Exam submissions are automatically graded, and both students and teachers receive AI-generated feedback and analytics."
        },
        {
            title: "Analytics Dashboards:",
            description: "Comprehensive performance tracking for both students and teachers, with individual course and general overviews."
        },
    ];

    return (
        <div className='flex flex-col gap-6 justify-center items-center w-full py-0 md:py-12'>
            <h1 className='text-center text-4xl font-bold mb-8'>Our Features</h1>
            <div className='flex flex-col lg:flex-row justify-between items-center gap-8 w-[90vw]'>
                {features.map((feature, index) => (
                    <div key={index} className='feature w-full max-w-[350px] md:max-w-[427px] md:w-[427px] flex items-center flex-col rounded-[44px] p-6 md:p-8 bg-white transition-shadow duration-300'>
                        <h1 className='metropolis w-[90%] md:w-[95%] text-2xl md:text-3xl leading-[30px] text-center font-bold mb-4'>{feature.title}</h1>
                        <h3 className='metropolis-normal font-light text-center text-base md:text-xl leading-6'>{feature.description}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;