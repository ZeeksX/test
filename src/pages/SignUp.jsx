import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../components/Auth";
import "../styles/main.css";
import ForgotPassword from "../components/modals/ForgotPassword";
import Toast from "../components/modals/Toast";
import { brandLogo } from "../utils/images.js";
import { SERVER_URL } from "../utils/constants.js";
import { Input, Password } from "../components/ui/Input.jsx";
import { Label } from "../components/ui/Label.jsx";
import OTPPage from "./OTPPage.jsx";
import { Loader } from "../components/ui/Loader.jsx";
import { CustomButton } from "../components/ui/Button.jsx";
import axios from "axios";

const SignUp = () => {
  const [lastName, setLastName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [errors, setErrors] = useState({
    lastName: "",
    otherNames: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loader, setLoader] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const auth = useAuth();
  const { login } = auth;
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setRole(parsedData.role);
    }
  }, []);

  // Validation functions
  const validateLastName = (value) => {
    if (!value.trim()) {
      return "Last name is required";
    }
    if (value.length < 2) {
      return "Last name must be at least 2 characters long";
    }
    if (!/^[A-Za-z\s'-]+$/.test(value)) {
      return "Last name can only contain letters, spaces, apostrophes, and hyphens";
    }
    return "";
  };

  const validateOtherNames = (value) => {
    if (!value.trim()) {
      return "Other names are required";
    }
    if (value.length < 2) {
      return "Other names must be at least 2 characters long";
    }
    if (!/^[A-Za-z\s'-]+$/.test(value)) {
      return "Other names can only contain letters, spaces, apostrophes, and hyphens";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
        value
      )
    ) {
      return "Password must include uppercase, lowercase, number, and special character";
    }
    return "";
  };

  const validateConfirmPassword = (value, originalPassword) => {
    if (!value.trim()) {
      return "Please confirm your password";
    }
    if (value !== originalPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {
      lastName: validateLastName(lastName),
      otherNames: validateOtherNames(otherNames),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
    };

    setErrors(newErrors);

    // Check if any errors exist
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoader(true);

    try {
      const res = await fetch(`${SERVER_URL}/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          last_name: lastName,
          other_names: otherNames,
          email: email,
          role: role,
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();

      console.log("Response from backend:", data);
      if (
        data.error ==
        "User already exists but is not verified. Please check your email for the OTP or request a new one."
      ) {
        showToast(data.error, "error");
        navigate("/users/verify-otp", { state: { email: email } });
        try {
          const response = await axios.post(`${SERVER_URL}/users/resend-otp/`, {
            email,
          });
          if (response.status === 200) {
            showToast("OTP resent successfully!", "success");
          }
        } catch (error) {
          showToast(
            error.response?.data?.error ||
            "Failed to resend OTP. Please try again.",
            "error"
          );
        } finally {
          setLoader(false);
        }
        return;
      }

      if (res.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.removeItem("user");

        login({
          email: email,
          last_name: lastName,
          role: role,
        });

        showToast("Sign up successful!", "success");

        localStorage.setItem(
          "toastMessage",
          JSON.stringify({
            message: "Sign up successful!",
            severity: "success",
          })
        );
        setLoader(true);

        setHasSignedUp(true);
      } else {
        setLoader(false);
        showToast(data.email || "Sign up failed. Please try again.", "error");
      }
    } catch (error) {
      setLoader(false);
      console.error("Error during sign up:", error);
      showToast("An error occurred. Please try again later.", "error");
    } finally {
      setLoader(false);
    }
  };

  // Update input change handlers to validate on change
  const handleLastNameChange = (event) => {
    const value = event.target.value;
    setLastName(value);
    setErrors((prev) => ({
      ...prev,
      lastName: validateLastName(value),
    }));
  };

  const handleOtherNamesChange = (event) => {
    const value = event.target.value;
    setOtherNames(value);
    setErrors((prev) => ({
      ...prev,
      otherNames: validateOtherNames(value),
    }));
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value),
    }));
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
      confirmPassword: validateConfirmPassword(confirmPassword, value),
    }));
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(value, password),
    }));
  };

  // Rest of the component remains the same (showToast, closeToast, etc.)
  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };

  const handleSignInClick = () => {
    navigate("/login");
  };

  return (
    <>
      {!hasSignedUp ? (
        <div className="landing flex flex-col items-center lg:justify-center justify-center gap-4 md:gap-2 lg:gap-0 w-full min-h-screen">
          {loader && <Loader />}
          <div className="sign-in flex flex-row w-[80%] max-md:w-[90%] lg:w-3/5 md:h-[60vh] lg:h-[90vh]">
            <div className="signin-image w-1/2 md:flex hidden"></div>
            <div className="login flex flex-col lg:max-w-screen-lg w-full overflow-scroll md:rounded-r-2xl bg-[white] text-black px-2 md:px-4 lg:px-3 border gap-4 py-4">
              <div className="flex flex-col justify-center items-center gap-1 lg:gap-2">
                <img
                  className="w-1/4 max-sm:w-1/2 max-2xl:w-1/3"
                  src={brandLogo}
                  alt="Acad AI logo"
                />
                <h3 className="text-black mt-3 font-medium text-[1.75rem] max-sm:text-[1.65rem] max-sm:font-semibold leading-[1rem]">
                  Create an account
                </h3>
                <p className="text-[#666666] text-base mt-3 font-normal leading-[19.36px] text-center">
                  Already have an account?
                  <a
                    className="underline cursor-pointer ml-1"
                    onClick={handleSignInClick}
                  >
                    Log in
                  </a>
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="form flex flex-col gap-2 2xl:gap-3 items-start justify-center w-[85%] mx-auto h-auto"
              >
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Label htmlFor="last_name" className="text-[#666666]">
                      Last Name
                    </Label>
                    <Input
                      name="last_name"
                      id="last_name"
                      value={lastName}
                      placeholder="E.g Doe"
                      autoComplete="last_name"
                      onChange={handleLastNameChange}
                      error={errors.lastName}
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="other_names" className="text-[#666666]">
                      Other Names
                    </Label>
                    <Input
                      name="other_names"
                      id="other_names"
                      value={otherNames}
                      placeholder="E.g John"
                      autoComplete="other_names"
                      onChange={handleOtherNamesChange}
                      error={errors.otherNames}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <Label htmlFor="email" className="text-[#666666]">
                    Email address
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    placeholder="E.g email@example.com"
                    autoComplete="email"
                    onChange={handleEmailChange}
                    error={errors.email}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="password" className="text-[#666666]">
                    Password
                  </Label>
                  <Password
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    error={errors.password}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="confirm-password" className="text-[#666666]">
                    Confirm password
                  </Label>
                  <Password
                    id="confirm-password"
                    name="confirm-password"
                    value={confirmPassword}
                    placeholder="Confirm your password"
                    onChange={handleConfirmPasswordChange}
                    error={errors.confirmPassword}
                  />
                </div>
                <div className="flex flex-col justify-between w-full items-center mt-6 md:mt-4 gap-2">
                  <CustomButton
                    size="lg"
                    loading={loader}
                    className="w-full"
                    type="submit"
                  >
                    Create an account
                  </CustomButton>
                  <h3 className="flex w-full mt-1 mb-2 justify-center text-[#666666] hover:text-gray-600 text-center cursor-pointer">
                    Or, continue with <u className="ml-2">Google</u>
                  </h3>
                </div>
              </form>
              <ForgotPassword
                open={forgotPasswordOpen}
                onClose={handleForgotPasswordClose}
              />
            </div>
          </div>
        </div>
      ) : (
        <OTPPage email={email} />
      )}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </>
  );
};

export default SignUp;
