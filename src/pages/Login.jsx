import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "../styles/main.css";
import ForgotPassword from "../components/modals/ForgotPassword";
import Toast from "../components/modals/Toast";
import { brandLogo, googleLogo, logoMobile } from "../utils/images.js";
import { SERVER_URL } from "../utils/constants.js";
import { Loader } from "../components/ui/Loader.jsx";
import { CustomButton } from "../components/ui/Button.jsx";
import { Input, Password } from "../components/ui/Input.jsx";
import { Label } from "../components/ui/Label.jsx";
import { FiHome } from "react-icons/fi";

const Login = ({ isMobile }) => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLogging(true);

      try {
        const formData = new FormData();
        formData.append("email", formState.email);
        formData.append("password", formState.password);

        const res = await fetch(`${SERVER_URL}/users/login/`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);

          login({
            email: formState.email,
            last_name: data.last_name,
            role: data.role,
            id: data.id,
            studentId: data.studentId,
            teacherId: data.teacher1d,
            access: data.access,
            refresh: data.refresh,
          });

          // Show toast on the login page
          showToast("Login successful!", "success");

          // Store the toast message in local storage for the dashboard
          localStorage.setItem(
            "toastMessage",
            JSON.stringify({
              message: "Login successful!",
              severity: "success",
            })
          );

          setLoader(true);
          // Delay navigation by 1 second
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } else {
          setLoader(false);
          console.log("Login failed:", data);
          showToast(data.detail || "Login failed. Please try again.", "error");
          if (
            data.detail ===
            "Account is not verified. Please verify your email via OTP."
          ) {
            setTimeout(() => {
              navigate("/users/verify-otp");
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error during login:", error.message);
        showToast("An error occurred. Please try again later.", "error");
      } finally {
        setIsLogging(false);
      }
    },
    [formState, navigate, login]
  );

  const navigateToSignUp = () => {
    navigate("/onboarding");
  };

  const navigateToOTP = () => {
    navigate("/users/verify-otp");
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <div className="landing flex flex-col items-center justify-center w-full min-h-screen">
      {loader && <Loader />}
      <div className="sign-in flex flex-row lg:w-3/5 lg:h-[90vh]">
        <div className="signin-image md:w-1/2 hidden md:flex"></div>
        <div className="login hide-scrollbar flex overflow-y-scroll flex-col w-4/5 mx-auto max-w-96 lg:max-w-screen-lg md:w-full md:rounded-r-2xl bg-white text-black px-4 lg:px-3 border gap-4 2xl:gap-6 py-4">
          <Header navigateToSignUp={navigateToSignUp} />
          <form
            action="/dashboard"
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 lg:gap-3 items-start w-[90%] md:w-4/5 mx-auto"
          >
            <div className="w-full">
              <Label htmlFor="email" className="text-[#666666]">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formState.email}
                placeholder="E.g email@example.com"
                autoComplete="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full mb-2">
              <Label htmlFor="password" className="text-[#666666]">
                Password
              </Label>
              <Password
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formState.password}
                onChange={handleInputChange}
              />
            </div>
            <CustomButton
              size="lg"
              loading={isLogging}
              className="w-full"
              type="submit"
            >
              Login
            </CustomButton>
            {isMobile ? <GoogleSignInMobile /> : <GoogleSignInDesktop />}
            <p className="flex md:hidden text-[#666666] justify-center w-full my-2 text-[0.75rem] font-normal gap-2 text-center">
              Don't have an account?
              <span
                className="underline cursor-pointer"
                onClick={navigateToSignUp}
              >
                Sign Up
              </span>
            </p>
          </form>
          <ForgotPassword
            open={forgotPasswordOpen}
            onClose={() => setForgotPasswordOpen(false)}
          />
        </div>
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
};

const Header = ({ navigateToSignUp }) => (
  <div className="flex flex-col justify-center items-center">
    <img
      className="hidden md:flex w-1/3 mb-3"
      src={brandLogo}
      alt="Acad AI logo"
    />
    <img
      className="flex md:hidden w-1/2 justify-center items-center"
      src={logoMobile}
      alt="Acad AI logo"
    />
    <h3 className="hidden md:flex text-black font-medium text-[1.75rem]">
      Welcome Back!
    </h3>
    <h3 className="md:hidden flex text-black font-medium text-[1.5rem]">
      Welcome to Acad AI
    </h3>
    <p className="hidden md:flex text-black text-base font-normal text-center">
      Don't have an account?
      <span
        className="underline cursor-pointer ml-2"
        onClick={navigateToSignUp}
      >
        Sign Up
      </span>
    </p>
    <p className="md:hidden flex text-gray-500 text-sm italic font-light text-center">
      Turn Grading Hours into Minutes
    </p>
  </div>
);

const GoogleSignInDesktop = () => (
  <h3 className="hidden md:flex w-full justify-center text-[#666666] cursor-pointer">
    Or, continue with <u className="ml-2">Google</u>
  </h3>
);

const GoogleSignInMobile = () => (
  <button
    className="flex md:hidden hover:text-white border-[#666666] border-[1px] md:border-none justify-center gap-2 items-center w-full mt-4 h-12 font-normal md:font-extralight text-sm md:text-base rounded-full bg-white md:bg-[#c3c3c3] hover:bg-blue-800 text-gray-800 md:text-white py-1 px-3 transition-all"
    type="submit"
  >
    <img
      className="mr-1"
      width="25"
      height="20"
      src={googleLogo}
      alt="google-logo"
    />{" "}
    Sign in with Google
  </button>
);

export default Login;
