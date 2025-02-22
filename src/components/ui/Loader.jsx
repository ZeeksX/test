import lightLogoShort from "/logo_light_short.svg";
import darkLogoLong from "/logo_dark_long.svg";
import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-100 z-50 !m-0">
      <div className="relative w-40 h-20 flex items-end justify-center">
        <img src={darkLogoLong} alt="image-dark" className="absolute h-auto z-[60]" />
        <img
          src={lightLogoShort}
          alt="image-light"
          className="absolute bottom-[14px] right-[35px] h-auto animate-slide-in-out"
        />
      </div>
    </div>
  )
}

export default Loader;