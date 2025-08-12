import React, { useState, useCallback, Suspense, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth";
import "../styles/main.css";
import { SERVER_URL } from "../utils/constants.js";
import { Loader } from "../components/ui/Loader.jsx";
import { CustomButton } from "../components/ui/Button.jsx";
import { Input, Password } from "../components/ui/Input.jsx";
import { Label } from "../components/ui/Label.jsx";
import { FiHome } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setShowForgotPasswordDialog } from "../features/reducers/uiSlice.jsx";
import {
  CheckEmailDialog,
  ForgotPasswordDialog,
  ResetPasswordDialog,
  PasswordUpdatedDialog,
} from "../components/modals/AuthModals.jsx";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Toast = lazy(() => import("../components/modals/Toast"));

// Preload critical images
const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

// Constants for login timeout
const MAX_LOGIN_ATTEMPTS = 5;
const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const Login = ({ isMobile }) => {
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Login attempt tracking state
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  // Import images using dynamic import for code splitting
  const [images, setImages] = useState({
    brandLogo: null,
    googleLogo: null,
    logoMobile: null,
  });

  useEffect(() => {
    // Dynamic import images
    const loadImages = async () => {
      try {
        const imageModule = await import("../utils/images.js");
        setImages({
          brandLogo: imageModule.bannerTransparent,
          googleLogo: imageModule.googleLogo,
          logoMobile: imageModule.logoMobile,
        });

        // Preload background images
        preloadImage(imageModule.brandLogo);
        preloadImage(imageModule.logoMobile);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, []);

  // Check for existing lockout on component mount
  useEffect(() => {
    const checkExistingLockout = () => {
      const lockoutData = localStorage.getItem("loginLockout");
      if (lockoutData) {
        const { endTime, attempts } = JSON.parse(lockoutData);
        const now = Date.now();

        if (now < endTime) {
          // Still locked out
          setIsLockedOut(true);
          setLockoutEndTime(endTime);
          setLoginAttempts(attempts);
        } else {
          // Lockout expired, clear it
          localStorage.removeItem("loginLockout");
          setLoginAttempts(0);
        }
      }
    };

    checkExistingLockout();
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    let interval;

    if (isLockedOut && lockoutEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = lockoutEndTime - now;

        if (timeLeft <= 0) {
          // Lockout expired
          setIsLockedOut(false);
          setLockoutEndTime(null);
          setLoginAttempts(0);
          setRemainingTime(0);
          localStorage.removeItem("loginLockout");
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLockedOut, lockoutEndTime]);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Helper function to format remaining time
  const formatRemainingTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Helper function to handle failed login attempts
  const handleFailedLogin = useCallback(
    (errorMessage) => {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        // Lock out the user
        const endTime = Date.now() + TIMEOUT_DURATION;
        setIsLockedOut(true);
        setLockoutEndTime(endTime);

        // Store lockout data in localStorage
        localStorage.setItem(
          "loginLockout",
          JSON.stringify({
            endTime,
            attempts: newAttempts,
          })
        );

        showToast(
          "Too many failed login attempts. Please try again in 15 minutes.",
          "error"
        );
      } else {
        const attemptsLeft = MAX_LOGIN_ATTEMPTS - newAttempts;
        showToast(
          `${errorMessage} ${attemptsLeft} attempt${
            attemptsLeft !== 1 ? "s" : ""
          } remaining.`,
          "error"
        );
      }
    },
    [loginAttempts]
  );

  // Helper function to show toast and handle navigation
  const handleSuccessfulLogin = useCallback(
    (message = "Login successful!") => {
      // Clear any existing lockout data on successful login
      localStorage.removeItem("loginLockout");
      setLoginAttempts(0);
      setIsLockedOut(false);
      setLockoutEndTime(null);

      // Show toast on the login page
      showToast(message, "success");

      // Store the toast message for the dashboard
      try {
        localStorage.setItem(
          "toastMessage",
          JSON.stringify({
            message,
            severity: "success",
          })
        );
      } catch (error) {
        console.error("Error storing toast message:", error);
      }

      setLoader(true);
      // Delay navigation
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    },
    [navigate]
  );

  // Regular email/password login
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Check if user is locked out
      if (isLockedOut) {
        showToast(
          `Account temporarily locked. Try again in ${formatRemainingTime(
            remainingTime
          )}.`,
          "error"
        );
        return;
      }

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
          // Store tokens
          try {
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            localStorage.setItem("user", JSON.stringify(data));
          } catch (error) {
            console.error("Error storing tokens:", error);
          }

          // Login with complete user data
          login({
            email: formState.email,
            last_name: data.last_name,
            role: data.role,
            id: data.id,
            studentId: data.studentId,
            teacherId: data.teacher1d, // The type was necessary, that is how the backend sends it
            access: data.access,
            refresh: data.refresh,
            other_names: data.other_names,
            first_name: data.first_name,
          });

          handleSuccessfulLogin();
        } else {
          console.log("Login failed:", data);

          // Check if it's a password-related error
          const errorMessage = data.detail || data.email[0] || "Login failed. Please try again.";
          if (
            errorMessage.toLowerCase().includes("password") ||
            errorMessage.toLowerCase().includes("credentials") ||
            errorMessage.toLowerCase().includes("invalid")
          ) {
            handleFailedLogin("Incorrect username or password.");
          } else {
            showToast(errorMessage, "error");
          }

          // Handle email verification case
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
        setLoader(false);
      }
    },
    [
      formState,
      navigate,
      login,
      handleSuccessfulLogin,
      handleFailedLogin,
      isLockedOut,
      remainingTime,
    ]
  );

  // Google OAuth login handler
  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setIsLogging(true);

      try {
        // console.log("Google auth code received:", codeResponse.code);
        // console.log("code response", codeResponse);

        const response = await axios.post(`${SERVER_URL}/users/auth/google/`, {
          code: codeResponse.code,
        });
        // console.log("response", response);
        const data = response.data;
        // console.log("Google login success:", data);

        if (data.access && data.refresh) {
          // Store tokens
          try {
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
          } catch (error) {
            console.error("Error storing tokens:", error);
          }

          // Login with complete user data from Google response
          login({
            email: data.email,
            last_name: data.last_name,
            role: data.role,
            id: data.id,
            studentId: data.studentId,
            teacherId: data.teacher1d,
            access: data.access,
            refresh: data.refresh,
            other_names: data.other_names,
            first_name: data.first_name,
            picture: data.picture,
          });

          handleSuccessfulLogin("Google login successful!");
        } else {
          console.log("Google login failed - missing tokens:", data);
          showToast("Google login failed. Please try again.", "error");
        }
      } catch (error) {
        console.error("Error during Google login:", error);
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Google login failed. Please try again.";
        showToast(errorMessage, "error");
      } finally {
        setIsLogging(false);
        setLoader(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      showToast("Google login failed. Please try again.", "error");
      setIsLogging(false);
      setLoader(false);
    },
  });

  const navigateToSignUp = () => {
    navigate("/onboarding");
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
      <div className="sign-in flex flex-row max-lg:w-[90%] lg:w-3/5 lg:h-[90vh] my-6">
        <div className="signin-image lg:w-1/2 hidden lg:flex"></div>
        <div className="login hide-scrollbar flex overflow-y-scroll flex-col w-[90%] mx-auto max-w-96 lg:max-w-screen-lg lg:w-full lg:rounded-r-2xl bg-white text-black px-4 lg:px-3 border gap-4 2xl:gap-6 py-4">
          <Header
            navigateToSignUp={navigateToSignUp}
            brandLogo={images.brandLogo}
            logoMobile={images.logoMobile}
          />

          {/* Lockout Warning */}
          {isLockedOut && (
            <div className="w-[90%] md:w-4/5 mx-auto bg-red-50 border border-red-200 rounded-md p-3 mb-2">
              <div className="flex items-center">
                <div className="text-red-800 text-sm">
                  <strong>Account temporarily locked</strong>
                  <br />
                  Too many failed login attempts. Please try again in{" "}
                  {formatRemainingTime(remainingTime)}.
                </div>
              </div>
            </div>
          )}

          {/* Attempt Warning */}
          {!isLockedOut &&
            loginAttempts > 0 &&
            loginAttempts < MAX_LOGIN_ATTEMPTS && (
              <div className="w-[90%] md:w-4/5 mx-auto bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2">
                <div className="text-yellow-800 text-sm">
                  <strong>Warning:</strong> {loginAttempts} failed attempt
                  {loginAttempts !== 1 ? "s" : ""}. Account will be locked after{" "}
                  {MAX_LOGIN_ATTEMPTS} failed attempts.
                </div>
              </div>
            )}

          <form
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
                required
                disabled={isLockedOut}
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
                required
                disabled={isLockedOut}
              />
            </div>
            <h3
              className={`!p-0 ml-auto h-auto text-sm hover:text-blue-500 cursor-pointer ${
                isLockedOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                !isLockedOut && dispatch(setShowForgotPasswordDialog(true))
              }
            >
              Forgot password?
            </h3>
            <CustomButton
              size="lg"
              loading={isLogging}
              className="w-full"
              type="submit"
              disabled={isLogging || isLockedOut}
            >
              {isLockedOut
                ? `Locked (${formatRemainingTime(remainingTime)})`
                : "Login"}
            </CustomButton>

            {/* Google Login Section */}
            {/* <div className="w-full flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 w-full">
                <hr className="flex-1 border-gray-300" />
                <span className="text-gray-500 text-sm">or</span>
                <hr className="flex-1 border-gray-300" />
              </div>

              <div className="w-full">
                <CustomButton
                  size="lg"
                  loading={isLogging}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50"
                  type="button"
                  variant="clear"
                  onClick={handleGoogleLogin}
                  disabled={isLogging || isLockedOut}
                >
                  {images.googleLogo && (
                    <img
                      src={images.googleLogo}
                      alt="Google"
                      className="w-5 h-5"
                    />
                  )}
                  Continue with Google
                </CustomButton>
              </div>
            </div> */}

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
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {toast.open && (
          <Toast
            open={toast.open}
            message={toast.message}
            severity={toast.severity}
            onClose={closeToast}
          />
        )}
      </Suspense>

      <ForgotPasswordDialog type="forgot" />
      <CheckEmailDialog />
      <ResetPasswordDialog />
      <PasswordUpdatedDialog />
    </div>
  );
};

const Header = ({ navigateToSignUp, brandLogo, logoMobile }) => (
  <div className="flex flex-col justify-center items-center">
    <div className="w-60 h-20 flex justify-center">
      {brandLogo && (
        <img
          className="w-48 hidden lg:flex mb-3"
          src={brandLogo}
          alt="Acad AI logo"
          style={{ height: "inherit", objectFit: "contain" }}
          loading="eager"
        />
      )}
      {logoMobile && (
        <img
          className="w-16 flex lg:hidden justify-center items-center"
          src={logoMobile}
          alt="Acad AI logo"
          style={{ height: "inherit", objectFit: "contain" }}
          loading="eager"
        />
      )}
    </div>

    <h3 className="hidden lg:flex text-black font-medium text-[1.75rem]">
      Welcome Back!
    </h3>
    <h3 className="lg:hidden flex text-black font-medium text-[1.5rem]">
      Welcome to Acad AI
    </h3>
    <p className="hidden lg:flex text-black text-base font-normal text-center">
      Don't have an account?
      <span
        className="underline cursor-pointer ml-2"
        onClick={navigateToSignUp}
      >
        Sign Up
      </span>
    </p>
    <p className="lg:hidden flex text-gray-500 text-sm italic font-light text-center">
      Turn Grading Hours into Minutes
    </p>
  </div>
);

export default Login;
