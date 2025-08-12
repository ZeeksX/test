import React from 'react'
import { link, insta, faceb, bannerTransparent } from '../../utils/images'
import { Link } from 'react-router-dom'
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#f9f9f9] py-4 w-full flex h-auto flex-col-reverse items-center">
      <div className="container mx-auto text-center md:hidden">
        <p className="text-sm md:text-base font-semibold text-[#454545]">
          © {new Date().getFullYear()} Acad AI. All rights reserved.
        </p>
      </div>
      <div className='flex flex-row my-4 justify-between w-full items-center px-6'>
        <div className='w-1/3 md:w-auto'>
          <img src={bannerTransparent} alt="" className='max-w-40 w-full' />
        </div>
        <div className="hidden md:flex items-center">
          <p className="text-sm md:text-base text-[#454545] font-semibold">
            © {new Date().getFullYear()} Acad AI. All rights reserved.
          </p>
        </div>
        <div className='flex items-center'>
          <Link to="" className="mx-2">
            <img src={link} alt="Instagram" className="inline-block w-6 h-6" />
          </Link>
          <Link to="" className="mx-2">
            <img src={insta} alt="Instagram" className="inline-block w-6 h-6" />
          </Link>
          <Link to="" className="mx-2">
            <img src={faceb} alt="Facebook" className="inline-block w-6 h-6" />
          </Link>
          <Link to="" className="mx-2">
            <FaXTwitter className="inline-block w-6 h-6" />
          </Link>
        </div>

      </div>
    </footer>
  )
}

export default Footer