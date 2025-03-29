import React from 'react'
import { FiUpload } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import GroupCard from '../components/lecturer/GroupCard';
import { useNavigate } from 'react-router-dom';

const StudentGroups = () => {
  const navigate = useNavigate();
  const StudentGroup = [
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
        { id: 5, name: "John Doe" },
        { id: 6, name: "Jane Smith" },
        { id: 7, name: "Alice Johnson" },
        { id: 8, name: "Bob Brown" },
      ]
    }
  ];

  const handleStudentGroupClick = (group) => {
    navigate(`/student-groups/${group.id}`, {
      state: { group },
    });
  }

  return (
    <>
      <div className='bg-[#F9F9F9] min-h-screen overflow-y-auto'>
        <div className='flex flex-row max-md:flex-col justify-between items-end'>
          <div className='p-4 flex flex-col gap-4'>
            <h1 className='text-[32px] font-inter font-medium leading-8'>Student Groups</h1>
            <p className='text-[#667085] font-inter text-sm'>
              An examination room helps you organize different groups of students taking the subject(s) you teach
            </p>
          </div>
          <div className='flex flex-row gap-4 p-4 mr-8 max-md:mr-2'>
            <button className='bg-[#FFFFFF] gap-2 border shadow-[0_1px_2px_rgba(16,24,40,0.05)] text-[black] h-[44px] flex items-center justify-center font-inter font-medium text-sm rounded-lg px-4'>
              Share
              <FiUpload />
            </button>
            <button className='bg-[#1835B3] gap-2 text-[white] h-[44px] flex items-center justify-center font-inter font-medium text-sm rounded-lg px-4'>
              Create New Group
              <FaPlus />
            </button>
          </div>
        </div>
        <hr className='text-[#98A2B3] border-1' />
        <div className='flex items-end justify-end gap-4 mr-8 max-md:mr-2 p-4'>
          <button className='bg-[#EAECF0] text-[black] h-[44px] font-inter text-base rounded-lg w-[133px]'>
            View Results
          </button>
          <button className='rounded-lg bg-[#EAECF0] flex items-center justify-center h-[44px] w-[43px]'>
            <MoreHorizIcon className='text-[#667085]' />
          </button>
        </div>
        <div className='flex-1 overflow-y-auto p-4 mr-8 max-md:mr-2'>
          <div className='flex flex-row flex-wrap gap-16'>
            {StudentGroup.map((group) => (
              <div key={group.id}
                className='flex flex-col gap-4 cursor-pointer'
                onClick={() => handleStudentGroupClick(group)}>
                <GroupCard group={group} />
              </div>
            ))}
            {/* Create New Group Card */}
            <div className='flex flex-col gap-4 border-2 border-dashed border-[#E7E7E7] rounded-[20px]'>
              <div className='flex flex-col items-center justify-center w-[518px] h-[378px] bg-[#F4F4F4] rounded-[20px] p-1'>
                <div className='flex flex-col items-center justify-center gap-2 h-full'>
                  <button className='gap-2 text-[#98A2B3] h-[44px] flex flex-col items-center justify-center font-inter font-normal text-sm rounded-lg px-4'>
                    <FaPlus />
                    Add New Student Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentGroups;
