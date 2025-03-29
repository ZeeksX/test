import React from 'react'
import { RiLink } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";

const GroupCard = ({ group }) => {
    const Students = group.students || [];

    return (
        <div className='flex flex-col font-inter rounded-[20px] w-[522px] h-[378px] bg-white shadow-lg p-1'>
            <div className='h-[278px] w-full'>
                <div className='mt-10 flex flex-col items-center justify-between gap-8'>
                    {Students.map((student) => (
                        <div key={student.id} className='flex flex-row w-[90%] items-center justify-between gap-2'>
                            <div className='flex flex-row w-2/5 gap-8 items-center'>
                                <h1 className='text-base font-normal text-black'>{student.id}</h1>
                                <h1 className='text-base font-normal text-black'>{student.name}</h1>
                            </div>
                            <div className='flex flex-row w-1/3 justify-between items-center'>
                                <div className="w-0.5 bg-[#D0D5DD] rounded-[1px] h-4"></div>
                                <span className='flex items-center gap-2 text-[#EA4335]'>Remove
                                    <TiDeleteOutline className='text-[#EA4335] text-2xl' />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='h-[100px] bg-[#F9F9F9] rounded-b-[20px] flex items-center justify-between p-1 px-4'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-xl font-medium text-black'>{group.name}</h1>
                    <span className='text-[#98A2B3] text-[14px]'>Last Edited {group.lastEdited}</span>
                </div>
                <div className='flex'>
                    <span className='flex flex-row gap-2 cursor-pointer items-center text-[#155EEF]'>Copy link
                        <RiLink className='text-2xl' />
                    </span>
                </div>

            </div>
        </div>
    )
}

export default GroupCard