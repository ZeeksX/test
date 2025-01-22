import React from 'react'
import { useNavigate } from 'react-router'
const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>Landing</div>
      <h3 className='cursor-pointer hover:underline' onClick={()=>{
        navigate("/login")
      }}>Login Page</h3>
      <h3 className='cursor-pointer hover:underline' onClick={()=>{
        navigate("/signup")
      }}>Sign up page</h3>
      <h3 className='cursor-pointer hover:underline' onClick={()=>{
        navigate("/onboarding")
      }}>Onboarding</h3>
    </>

  )
}

export default Landing