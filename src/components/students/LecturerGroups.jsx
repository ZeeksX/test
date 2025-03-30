import React from 'react'
import { useLocation } from 'react-router'
import { MdPeopleOutline } from "react-icons/md";

const LecturerGroups = () => {
  const location = useLocation()
  const lecturer = location.state.lecturer
  const groups = [
    {
      id: 1,
      name: "Student Group 1",
      lastEdited: "04/12/2025",
      students: [
        { id: 1, name: "Ikinwot Ezekiel" },
        { id: 2, name: "Ebong Nsikak" },
        { id: 3, name: "Ajayi Anjola" },
        { id: 4, name: "Edward Philip" },
      ]
    },
    {
      id: 2,
      name: "Student Group 2",
      lastEdited: "05/12/2025",
      students: [
        { id: 5, name: "Gara Kinkinsoko" },
        { id: 6, name: "Basit Balogun" },
        { id: 7, name: "Duru Chris" },
        { id: 8, name: "Bob Brown" },
        { id: 1, name: "Ikinwot Ezekiel" },
      ]
    },
    {
      id: 3,
      name: "Student Group 3",
      lastEdited: "05/12/2025",
      students: [
        { id: 5, name: "Gara Kinkinsoko" },
        { id: 6, name: "Basit Balogun" },
        { id: 7, name: "Duru Chris" },
        { id: 8, name: "Bob Brown" },
        { id: 1, name: "Ikinwot Ezekiel" },
      ]
    },
    {
      id: 4,
      name: "Student Group 4",
      lastEdited: "05/12/2025",
      students: [
        { id: 1, name: "Ikinwot Ezekiel" },
        { id: 2, name: "Ebong Nsikak" },
        { id: 3, name: "Ajayi Anjola" },
        { id: 4, name: "Edward Philip" },
      ]
    }
  ]

  return (
    <div className=''>
      <div className='py-6 px-11 flex flex-col gap-4'>
        <h1 className='text-[32px] leading-8 font-medium'>{lecturer.lecturerName}</h1>
        <p className="text-sm text-[#222222] font-normal">Lorem ipsum dolor sit amet consectetur. At aliquet pharetra non sociis.</p>
      </div>
      <hr className='text-[#D0D5DD] mt-4' />

      <div className='px-11 grid grid-cols-1 md:grid-cols-2 gap-6 py-8'>
        {groups.map(group => (
          <div key={group.id} className='flex flex-col font-inter rounded-[20px] bg-white shadow-lg p-6'>
            <div className='flex-1 mb-4'>
              <div className='mt-4 flex flex-col gap-4'>
                {group.students.map(student => (
                  <div key={student.id} className='flex justify-between items-center gap-4'>
                    <div className='flex items-center gap-4 w-3/4'>
                      <span className='text-base font-normal text-black'>{student.id}</span>
                      <span className='text-base font-normal text-black truncate'>{student.name}</span>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            <div className='bg-[#F9F9F9] rounded-b-[20px] -mx-6 -mb-6 p-4 mt-4'>
              <div className='flex justify-between items-center'>
                <div className='flex gap-3 flex-col'>
                  <h2 className='text-lg font-medium text-black'>{group.name}</h2>
                  <p className='text-[#98A2B3] text-sm flex flex-row gap-2'>Last Edited {group.lastEdited}
                    <span className='flex flex-row gap-2 items-center text-sm'>
                      <MdPeopleOutline className='text-xl' />{group.students.length} students</span>
                  </p>
                </div>
                <button className='flex items-center text-sm font-semibold cursor-pointer gap-2 text-[#EA4335] hover:text-red-600 transition-colors'>
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LecturerGroups
