import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/Auth";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { TextField, InputAdornment, IconButton } from "@mui/material";
import "../styles/main.css";
import ForgotPassword from '../components/modals/ForgotPassword';
import logo from "../assets/brand.jpg";
import Toast from '../components/modals/Toast';
import Loader from "../components/ui/Loader";

const SignUp = () => {
    const [lastName, setLastName] = useState("");
    const [otherNames, setOtherNames] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

    const auth = useAuth();
    const { login } = auth;
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setConfirmShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords don't match");
            return;
        }

        setLoader(true); // Show loader during signup

        try {
            const formData = new FormData();
            formData.append("last_name", lastName);
            formData.append("other_names", otherNames);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("confirm_password", confirmPassword);

            const res = await fetch("http://127.0.0.1:8000/users/register/", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            console.log("Response from backend:", data);

            if (res.ok) {
                if (data.message && data.access && data.refresh) {
                    localStorage.setItem("access_token", data.access);
                    localStorage.setItem("refresh_token", data.refresh);

                    // Pass user data including last_name to login function
                    login({
                        email: email,
                        last_name: lastName,
                        role: "student",
                    });

                    // Show toast on the signup page
                    showToast("Sign up successful!", "success");

                    // Store the toast message in local storage for the dashboard
                    localStorage.setItem("toastMessage", JSON.stringify({
                        message: "Sign up successful!",
                        severity: "success",
                    }));
                    setLoader(true);
                    // Delay navigation by 3 seconds
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 3000);
                } else {
                    setLoader(false)
                    showToast("Invalid response from server.", "error");
                }
            } else {
                setLoader(false)
                showToast(data.non_field_errors || "Sign up failed. Please try again.", "error");
            }
        } catch (error) {
            setLoader(false)
            console.error("Error during sign up:", error.message);
            showToast("An error occurred. Please try again later.", "error");
        }
    };

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
            <div className="landing flex flex-col items-center lg:justify-center justify-center gap-4 md:gap-2 lg:gap-0 w-full min-h-screen">
                {loader && <Loader />}
                <div className="sign-in flex flex-row w-[80%] md:w-auto lg:w-3/5 max-lg:h-[90vh] lg:h-[93vh]">
                    <div className="signin-image w-1/2 md:flex hidden"></div>
                    <div className="login flex flex-col lg:max-w-screen-lg w-full md:rounded-r-md bg-[white] text-black px-2 md:px-4 lg:px-3 border gap-4 py-4">
                        <div className="flex flex-col justify-center items-center gap-1 lg:gap-2">
                            <img className="w-1/3" src={logo} alt="Acad AI logo" />
                            <h3 className="text-black font-medium text-[1.25rem] leading-[1rem]">Create an account</h3>
                            <p className="text-[#666666] text-[12px] font-normal leading-[19.36px] text-center">Already have an account?
                                <a className="underline cursor-pointer ml-1" onClick={handleSignInClick}>Log in</a>
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="form flex flex-col gap-1 2xl:gap-3 items-start justify-center w-[85%] mx-auto h-auto">
                            <label htmlFor="last_name" className="text-[#666666]">Last Name</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="last_name"
                                id="last_name"
                                value={lastName}
                                autoComplete="last_name"
                                onChange={(event) => setLastName(event.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '2rem',
                                        fontSize: "12px"
                                    }
                                }}
                            />
                            <label htmlFor="other_names" className="text-[#666666]">Other Names</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="other_names"
                                id="other_names"
                                value={otherNames}
                                autoComplete="other_names"
                                onChange={(event) => setOtherNames(event.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '2rem',
                                        fontSize: "12px"
                                    }
                                }}
                            />
                            <label htmlFor="email" className="text-[#666666]">School email address</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="email"
                                id="email"
                                value={email}
                                autoComplete="email"
                                onChange={(event) => setEmail(event.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '2rem',
                                        fontSize: "12px"
                                    }
                                }}
                            />
                            <label htmlFor="password" className="text-[#666666]">Password</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '2rem',
                                        fontSize: "12px"
                                    }
                                }}
                            />
                            <div className="flex flex-row justify-between w-full">
                                <label htmlFor="confirm-password" className="text-[#666666]">Confirm password</label>
                                <div className="error-message text-[0.7rem] text-[#7b142e]">{errorMessage}</div>
                            </div>
                            <TextField
                                fullWidth
                                variant="outlined"
                                id="confirm-password"
                                name="confirm-password"
                                type={confirmShowPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(event) => {
                                    setConfirmPassword(event.target.value);
                                    if (event.target.value !== password) {
                                        setErrorMessage("Passwords don't match");
                                    } else {
                                        setErrorMessage("");
                                    }
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {confirmShowPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '2rem',
                                        fontSize: "12px"
                                    }
                                }}
                            />
                            <div className="flex flex-row justify-between w-full items-center mt-6 md:mt-4 gap-2">
                                <button
                                    className="w-full flex justify-center items-center h-12 md:h-10 lg:h-12 font-light text-base leading-[24.2px] rounded-full bg-[#1836B2] text-white hover:outline hover:outline-blue-300 hover:text-[#1836B2] hover:bg-[#DDE4FF] py-1 px-3 lg:py-4 border border-transparent transition-all focus:outline-none"
                                    type="submit"
                                >
                                    Create an account
                                </button>
                                <h3 className="flex w-full mt-2 mb-2 justify-center text-[#666666] hover:text-gray-600 text-center cursor-pointer">Or, continue with
                                    <img className="ml-1" width="25" height="20" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />
                                </h3>
                            </div>
                        </form>
                        <ForgotPassword open={forgotPasswordOpen} onClose={handleForgotPasswordClose} />
                    </div>
                </div>
            </div>
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