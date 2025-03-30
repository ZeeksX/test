import React from 'react'
import { useLocation } from 'react-router'
import { BsDot } from "react-icons/bs";
import GroupTable from './GroupTable';

const StudentGroup = () => {
    const location = useLocation()
    const group = location.state.group
    return (
        <div
            className='flex flex-col font-inter'
        >
            <div className='p-6 flex flex-col gap-4'>
                <h1 className='text-[#222222] text-[32px] leading-8 font-medium'>{group.name}</h1>
                <p className="text-[#A1A1A1] text-sm flex flex-row items-center">
                    Prof. Ezekiel Ikinwot <span className='flex flex-row items-center'>
                        <BsDot />{group.students.length} students</span>
                </p>
            </div>
            <hr className='text-[#D0D5DD]' />
            <GroupTable group={group} />
        </div>
    )
}

export default StudentGroup