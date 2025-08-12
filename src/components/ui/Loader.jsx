import { darkLogoLong, lightLogoShort } from "../../utils/images.js";
import { SpinnerStyle } from "./Styles.jsx";

export const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-100 z-[10000] !m-0 h-screen">
      <div className="relative w-40 h-20 flex items-end justify-center">
        <img src={darkLogoLong} alt="image-dark" className="absolute h-auto z-[60]" />
        <img
          src={lightLogoShort}
          alt="image-light"
          className="absolute bottom-0 right-[22px] h-auto animate-slide-in-out"
        />
      </div>
    </div>
  )
}

export const Spinner = () => {
  return (
    <SpinnerStyle>
      <div className="spinner center">
        <div className="spinner-blade" />
        <div className="spinner-blade" />
        <div className="spinner-blade" />
        <div className="spinner-blade" />
        <div className="spinner-blade" />
        <div className="spinner-blade" />
        <div className="spinner-blade" />
        <div className="spinner-blade" />
        <div className="spinner-blade" />
        <div className="spinner-blade" />
        <div className="spinner-blade" />
        <div className="spinner-blade" />
      </div>
    </SpinnerStyle>
  )
}