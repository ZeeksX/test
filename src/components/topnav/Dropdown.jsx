import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../Auth.jsx";
import { useNavigate } from "react-router";
import { Loader } from "../ui/Loader.jsx";

const Dropdown = ({ showDropDown, setShowDropDown }) => {
    const { logout } = useAuth(); // Assuming logout function exists in Auth
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [loader, showLoader] = useState(false)

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropDown(false);
            }
        };
        if (showDropDown) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropDown, setShowDropDown]);

    const handleLogout = () => {
        setShowDropDown(false);
        showLoader(true);

        setTimeout(() => {
            logout();
        }, 2000);
    };

    return (
        <>
            {showDropDown && (
                <div
                    ref={dropdownRef}
                    className="absolute right-4 top-16 w-48 bg-white shadow-lg rounded-lg border border-gray-200 p-2 flex flex-col z-50"
                >
                    <button className="px-4 py-2 text-left hover:bg-gray-100 rounded" onClick={() => navigate("/profile")}>
                       Edit Profile
                    </button>
                    <button className="px-4 py-2 text-left hover:bg-gray-100 rounded" onClick={() => navigate("/billing")}>
                        Manage Billings
                    </button>
                    <button className="px-4 py-2 text-left hover:bg-red-100 rounded text-red-600" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
            {loader && <Loader />}
        </>

    );
};

export default Dropdown;
