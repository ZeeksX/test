import React from 'react';
import { useNavigate } from 'react-router';
import logo from "../../assets/logo.png";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const TopNav = () => {
  const navLinks = ["Home", "Features", "Services", "Contact"];
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login")
  }

  return (
    <div className='w-[90vw] flex flex-row items-center justify-between h-12 m-6'>
      <div className='flex flex-row items-center'>
        <img className='w-16' src={logo} alt="Acad AI logo" />
        <div className='flex flex-col'>
          <h3 className='flex flex-row text-[#1836B2]  text-lg font-medium'>ACAD <span className='flex  ml-1 text-[#86C7ED]'>AI</span></h3>
          <h3 className='flex flex-row text-[#1836B2] text-[0.5rem] font-medium'>Artificial Intelligence for Educational good</h3>
        </div>
      </div>
      <div className='flex flex-row w-1/3 items-center justify-between'>
        <ul className='flex flex-row w-full justify-between'>
          {navLinks.map((link, index) => (
            <li key={index} className=' text-[#1836B2] cursor-pointer font-normal text-sm'>{link}</li> // Added key and cursor style
          ))}
        </ul>
      </div>
      <button onClick={handleClick} className='flex flex-row rounded-xl py-2 px-3 font-normal text-sm text-white justify-center items-center bg-[#1836B2]'>
        Get started
        <ArrowOutwardIcon sx={{
          width: "0.75rem",
          height: "0.75rem",
          marginLeft: "0.25rem"
        }} />
      </button>
    </div>
  );
}

export default TopNav;