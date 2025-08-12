import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { bannerTransparent, profileImageDefault } from "../../utils/images.js";
import { FiChevronDown, FiCreditCard, FiSettings } from "react-icons/fi";
import { useAuth } from "../Auth.jsx";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import MobileSidebar from "../lecturer/MobileSidebar.jsx";
import StudentMobileSidebar from "../students/StudentMobileSidebar.jsx";
import Dropdown from "./Dropdown.jsx";
import { useNavigate } from "react-router-dom";
import CustomButton from "../ui/Button.jsx";
import { DropdownMenu, DropdownMenuContent } from "../ui/Dropdown.jsx";
import { setShowPurchaseCreditDialog } from "../../features/reducers/uiSlice.jsx";
import { useDispatch } from "react-redux";
import { PurchaseCreditDialog } from "./PurchaseCreditDialog.jsx";
import { useSelector } from "react-redux";
import { Loader } from "../ui/Loader.jsx";
import { fetchUserCredits } from "../../features/reducers/userSlice.jsx";

const DynamicTopNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropDown, setShowDropDown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  const { userCredits: credits, getCreditsLoading } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchUserCredits());
  }, [dispatch]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClick = () => setShowDropDown((prev) => !prev);

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  if (getCreditsLoading) {
    return <Loader />;
  }

  return (
    <>
      <div
        className={
          "fixed top-0 z-10 w-full flex flex-row items-center justify-between h-16 px-4 border-b-[4px] border-b-border-main bg-white max-w-[1440px]"
        }
      >
        <div className="flex">
          <div className="flex flex-row items-center gap-2">
            <div className="text-2xl cursor-pointer md:hidden flex">
              <DensityMediumIcon onClick={toggleSidebar} />
            </div>
            <img
              className="w-36 max-[350px]:w-28 lg:w-48 pl-2 md:pl-4"
              src={bannerTransparent}
              alt="Acad AI logo"
            />
            {/* <Logo /> */}
          </div>
          {/* <div className="flex ml-6">
            <CustomButton
              // disabled={!canGoBack}
              onClick={handleBack}
              className="!rounded-none mr-1 h-full p-2 px-4 flex items-center justify-center"
            >
              <IoChevronBackOutline />
            </CustomButton>
            <CustomButton
              disabled={!canGoForward}
              onClick={handleForward}
              className="!rounded-none mr-1 h-full p-2 px-4 flex items-center justify-center"
            >
              <IoChevronForwardOutline />
            </CustomButton>
          </div> */}
        </div>
        <div className="flex items-center justify-start gap-2 md:gap-6">
          {user.role === "teacher" && (
            <DropdownMenu>
              {/* <DropdownMenuTrigger> */}
              <button
                // variant="outline"
                onClick={toggleDropdown}
                className="px-4 py-2 rounded flex items-center gap-2 border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <FiCreditCard className="w-4 h-4" />
                <span className="font-medium text-sm md:block hidden">{credits} Credit(s)</span>
                <FiChevronDown className="w-4 h-4" />
              </button>
              {/* </DropdownMenuTrigger> */}
              <DropdownMenuContent
                align="start"
                className="w-[250px] p-2"
                open={isOpen}
                setOpen={setIsOpen}
              >
                <div className="px-3 py-2 text-sm text-gray-600">
                  Current Balance:{" "}
                  <span className="font-semibold text-primabg-primary-main">
                    {credits} Credit(s)
                  </span>
                </div>
                <CustomButton
                  // variant="clear"
                  onClick={() => {
                    toggleDropdown();
                    dispatch(setShowPurchaseCreditDialog(true));
                  }}
                  className="cursor-pointer w-full mt-2"
                >
                  <FiCreditCard className="w-4 h-4 mr-2" />
                  Purchase More Credits
                </CustomButton>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* <FiBell size={20} className="cursor-pointer max-md:hidden" /> */}
          <FiSettings
            size={20}
            className="cursor-pointer max-md:hidden"
            onClick={() => {
              handleSettingsClick();
            }}
          />
          <div>
            <div className="hidden md:flex flex-col items-right justify-right">
              <h1 className="text-xs font-semibold text-[#222222] text-right">
                {user?.other_names} {user?.last_name}
              </h1>
              <p className="text-[8px] text-[#A1A1A1] text-right">
                {user?.role === "teacher" ? "Teacher" : "Student"}
              </p>
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              handleClick();
            }}
          >
            <Avatar>
              <div className="relative">
                <Dropdown
                  showDropDown={showDropDown}
                  setShowDropDown={setShowDropDown}
                />
              </div>
              {profileImageDefault ? (
                <AvatarImage src={profileImageDefault} alt="Profile" />
              ) : (
                <AvatarFallback>
                  {user?.last_name ? user?.last_name.charAt(0) : "A"}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
      </div>
      {showSidebar && user?.role === "teacher" ? (
        <MobileSidebar
          showSidebar={showSidebar}
          toggleSidebar={toggleSidebar}
        />
      ) : user?.role === "student" ? (
        <StudentMobileSidebar
          showSidebar={showSidebar}
          toggleSidebar={toggleSidebar}
        />
      ) : null}

      <PurchaseCreditDialog />
    </>
  );
};

export default DynamicTopNav;
