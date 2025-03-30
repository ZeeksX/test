import { useRef, useState } from "react";
import { featuredIcon } from "../utils/images";
import { CustomButton } from "../components/ui/Button";
import { Link } from "react-router";
import axios from "axios";
import { SERVER_URL } from "../utils/constants";
import Toast from "../components/modals/Toast";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";

const OTPPage = ({ email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const emailFromState = location.state?.email || "";
  const currentEmail = email || emailFromState;
  const inputRefs = useRef([]);
  const [isVerified, setIsVerified] = useState(false);
  const [loader, setLoader] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  const handleChange = (index, value) => {
    // Only allow empty string or a single digit (0-9)
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Automatically submit when all 6 digits are entered
    if (newOtp.every((digit) => /^\d$/.test(digit))) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handleClick = async () => {
    setLoader(true);
    try {
      const response = await axios.post(`${SERVER_URL}/users/resend-otp/`, {
        email: currentEmail,
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
  };

  const handleSubmit = async (otpValue) => {
    // If no otpValue is provided, join the current OTP state
    const submitOtp = otpValue || otp.join("");

    // Validate that each field contains exactly one digit
    if (submitOtp.length !== 6 || !/^\d{6}$/.test(submitOtp)) {
      showToast("Please fill all the fields with valid digits", "error");
      return;
    }

    setLoader(true);

    try {
      const response = await axios.post(`${SERVER_URL}/users/verify-otp/`, {
        email: currentEmail,
        otp: submitOtp,
      });

      if (response.status === 200) {
        showToast("Sign up successful!", "success");
        setIsVerified(true);
        // Reset the OTP fields for future attempts
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
        navigate("/login", { replace: true });
      }
    } catch (error) {
      showToast(
        error.response?.data?.error || "Sign up failed. Please try again.",
        "error"
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="landing flex flex-col items-center lg:justify-center justify-center gap-4 md:gap-2 lg:gap-0 w-full min-h-screen">
      <div className="sign-in flex flex-row w-[90%] sm:w-3/5 lg:w-3/5 max-lg:h-[90vh] lg:h-[93vh]">
        <div className="login flex flex-col lg:max-w-screen-lg w-full md:rounded-2xl bg-[white] text-black px-2 md:px-4 lg:px-3 border gap-4 py-2 items-center justify-center">
          {!isVerified ? (
            <div className="flex flex-col items-center space-y-4 p-6 max-md:p-0">
              <img src={featuredIcon} className="w-12" alt="featured icon" />
              <h2 className="text-xl font-semibold">Check your email</h2>
              <p className="text-gray-600 text-center text-sm">
                We sent a verification code to <br />
                <span className="font-medium">
                  {currentEmail || "your email"}
                </span>
              </p>
              <div className="flex space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength="1"
                    className="w-12 h-12 max-md:w-10 max-md:h-10 max-[330px]:w-1/6 max-[330px]:h-auto text-xl text-center border-2 rounded-md focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-main"
                  />
                ))}
              </div>
              <CustomButton
                type="button"
                size="lg"
                loading={loader}
                onClick={() => handleSubmit()}
                className="w-full py-2 bg-gray-400 text-white rounded-md mt-4"
              >
                Verify Email
              </CustomButton>
              <p className="text-sm text-gray-500">
                Didn't receive the email?{" "}
                <span
                  onClick={handleClick}
                  className="text-primary-main cursor-pointer"
                >
                  Click to resend
                </span>
              </p>
              <a href="/signup" className="text-sm text-gray-500">
                &larr; Back to sign up
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 p-6">
              <img src={featuredIcon} className="w-12" alt="featured icon" />
              <h2 className="text-xl font-semibold">Email Verified</h2>
              <p className="text-gray-600 text-center text-sm">
                Your email has been successfully verified.
                <br />
                Click below to log in manually.
              </p>
              <Link
                to={"/login"}
                type="button"
                className="w-full bg-primary-main text-white mt-4 hover:ring-2 px-5 py-2.5 text-base font-semibold rounded-md flex items-center justify-center relative"
              >
                Continue
              </Link>
              <a href="/signup" className="text-sm text-gray-500">
                &larr; Back to sign up
              </a>
            </div>
          )}
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

export default OTPPage;
