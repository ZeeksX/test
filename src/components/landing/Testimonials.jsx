import React from 'react'
import { star } from '../../utils/images.js'

const Testimonials = () => {
    const testimonials = [
        {
            stars: 5,
            descrption: "AcadAI has transformed the way I approach grading. The AI's accuracy and speed are unmatched, making my life so much easier.",
            name: "Prof. Ikinwot Ezekiel PhD",
            designation: "Professor of Computer Science",
            university: "Oxford University",
        },
        {
            stars: 5,
            descrption: "AcadAI has transformed the way I approach grading. The AI's accuracy and speed are unmatched, making my life so much easier.",
            name: "Prof. Ikinwot Ezekiel PhD",
            designation: "Professor of Computer Science",
            university: "Oxford University",
        },
        {
            stars: 5,
            descrption: "AcadAI has transformed the way I approach grading. The AI's accuracy and speed are unmatched, making my life so much easier.",
            name: "Prof. Ikinwot Ezekiel PhD",
            designation: "Professor of Computer Science",
            university: "Oxford University",
        },
        {
            stars: 5,
            descrption: "AcadAI has transformed the way I approach grading. The AI's accuracy and speed are unmatched, making my life so much easier.",
            name: "Prof. Ikinwot Ezekiel PhD",
            designation: "Professor of Computer Science",
            university: "Oxford University",
        },
        {
            stars: 5,
            descrption: "AcadAI has transformed the way I approach grading. The AI's accuracy and speed are unmatched, making my life so much easier.",
            name: "Prof. Ikinwot Ezekiel PhD",
            designation: "Professor of Computer Science",
            university: "Oxford University",
        },
        {
            stars: 5,
            descrption: "AcadAI has transformed the way I approach grading. The AI's accuracy and speed are unmatched, making my life so much easier.",
            name: "Prof. Ikinwot Ezekiel PhD",
            designation: "Professor of Computer Science",
            university: "Oxford University",
        },

    ]
    return (
        <div className='testimonials flex flex-col w-full pt-16 max-lg:p-6 h-auto lg:pb-16'>
            <div className='flex flex-col gap-2 max-lg:mt-4 xl:pl-24 pl-8 max-md:px-0'>
                <h1 className='text-4xl xl:text-5xl text-[#1836B2] font-medium max-lg:text-3xl max-lg:font-semibold'>Don’t Just Take Our Word for It</h1>
                <p className='text-base text-[#454545] font-normal max-lg:text-sm'>See real results from real users</p>
            </div>
            <div className='flex flex-col justify-center items-center gap-4 mt-8 max-lg:mt-6 w-full'>
                <div className='grid grid-cols-3 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1 max-lg:gap-8 mt-8 max-md:mt-2 '>
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className='flex flex-col md:max-h-[310px] h-auto max-w-[400px] max-md:h-auto max-md:p-4 max-lg:p-6 max-lg:w-[370px] max-md:w-full md:w-[350px] xl:w-[385px] gap-4 bg-white p-6 border rounded-lg'>
                            <div className='flex items-center gap-2 max-md:mt-3'>
                                {[...Array(testimonial.stars)].map((_, starIndex) => (
                                    <img key={starIndex} src={star} alt="Star" className='w-5 h-5' />
                                ))}

                            </div>
                            <p className='text-base xl:text-[18px] text-gray-700'>{testimonial.descrption}</p>
                            <div className='flex flex-col gap-1'>
                                <span className='text-base text-[#454545] font-semibold'>{testimonial.name}</span>
                                <div className='flex flex-row flex-wrap gap-1'>
                                    <span className='text-sm  text-[#454545]'>{testimonial.designation} | </span>
                                    <span className='text-sm text-[#454545]'>{testimonial.university}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Testimonials