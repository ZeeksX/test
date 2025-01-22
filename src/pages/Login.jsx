// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { TextField, InputAdornment, IconButton } from "@mui/material";
import "../styles/main.css";
import ForgotPassword from '../components/modals/ForgotPassword';
import logo from "../assets/Acad AI logo.jpg";
import Toast from '../components/modals/Toast'; // Import the Toast component

const Login = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false); // State for toast visibility
    const [toastMessage, setToastMessage] = useState(""); // State for toast message

    const auth = useAuth();
    const { setUser } = auth;
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3000/api/v1/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            console.log("API Response:", data);
            console.log("User  email: ", data.user);

            if (res.ok) {
                // Set the user in the Auth context
                setUser({ id: data.user.id, email: data.user.email, role: data.user.role });

                setToastMessage(data.message); // Set the toast message
                setToastOpen(true); // Show the toast
                navigate("/dashboard");
            } else {
                console.error("Login failed:", data.message || res.statusText);
                setToastMessage(data.message || "Login failed. Please try again.");
                setToastOpen(true); // Show the toast
            }
        } catch (error) {
            console.error("Error during login:", error.message);
        }
    };

    const handleToastClose = () => {
        setToastOpen(false);
    };

    const handleForgotPasswordOpen = () => {
        setForgotPasswordOpen(true);
    };

    const handleForgotPasswordClose = () => {
        setForgotPasswordOpen(false);
    };

    // New function to handle navigation to the Sign Up page
    const handleSignUpClick = () => {
        navigate("/signup");
    };

    return (
        <>
            <div className="landing flex flex-col items-center lg:justify-center justify-center gap-2 lg:gap-0 w-full min-h-screen">
                <div className="sign-in flex flex-row lg:w-3/5 lg:h-[90vh]">
                    <div className="signin-image w-1/2">
                    </div>
                    <div className="login flex flex-col max-w-96 lg:max-w-screen-lg w-full rounded-r-md bg-[white] text-black px-4 lg:px-3 border gap-4 py-4">
                        <div className="flex flex-col justify-center items-center gap-1">
                            <img className="w-1/ h-24" src={logo} alt="Acad AI logo" />
                            <h3 className="text-black font-medium text-[2rem] leading-[38.73px]">Welcome Back!</h3>
                            <p className="text-black text-base font-normal leading-[19.36px] text-center">
                                Don't have an account?
                                <a
                                    className="underline cursor-pointer ml-1"
                                    onClick={handleSignUpClick} // Add click handler here
                                >
                                    Sign Up
                                </a>
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-start justify-center w-4/5 mx-auto h-auto">
                            <label htmlFor="email" className="text-[#666666]">Email</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="email@example.com"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '3rem', // Set the height of the TextField
                                    }
                                }}
                            />
                            <div className="flex flex-row justify-between w-full">
                                <label htmlFor="password" className="text-[#666666]">Password</label>
                                <div className="error-message text-[0.7rem] text-[#7b142e]">{errorMessage}</div>
                            </div>

                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter your password"
                                name="password"
                                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                                value={password}
                                onChange={(event) => setPassword(event.target.value)} // change later after doing backend authentication
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
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '3rem', // Set the height of the TextField
                                    }
                                }}
                            />

                            <div className="flex flex-row justify-between gap-4 lg:gap-0 items-center w-full">
                                <button
                                    className="w-full mt-4 h-12 font-extralight text-base leading-[24.2px] rounded-full bg-[#c3c3c3] hover:bg-blue-800 text-white py-1 px-3 border border-transparent transition-all focus:outline-none"
                                    type="submit"
                                >
                                    Log in
                                </button>
                            </div>
                            <h3 className="flex w-full justify-center text-[#666666] hover:text-gray-600 text-center cursor-pointer">
                                Or, continue with
                                <img className="ml-1" width="25" height="20" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />
                            </h3>
                        </form>
                        <ForgotPassword open={forgotPasswordOpen} onClose={handleForgotPasswordClose} />
                    </div>
                </div>
            </div>
            <Toast open={toastOpen} message={toastMessage} onClose={handleToastClose} /> {/* Add the Toast component here */}
        </>
    );
};

export default Login;