import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "../styles/main.css";
import ForgotPassword from "../components/modals/ForgotPassword";
import Toast from "../components/modals/Toast";
import logo from "../assets/Acad AI logo.jpg";

const Login = () => {
    const [formState, setFormState] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({
        open: false,
        message: "",
    });
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3000/api/v1/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });

            const data = await res.json();
            if (res.ok) {
                setUser({ id: data.user.id, email: data.user.email, role: data.user.role });
                showToast(data.message);
                navigate("/dashboard");
            } else {
                showToast(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            showToast("An error occurred. Please try again later.");
            console.error("Error during login:", error.message);
        }
    };

    const showToast = (message) => {
        setToast({ open: true, message });
    };

    const closeToast = () => {
        setToast({ open: false, message: "" });
    };

    const navigateToSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="landing flex flex-col items-center justify-center w-full min-h-screen">
            <div className="sign-in flex flex-row lg:w-3/5 lg:h-[90vh]">
                {/* Left Side */}
                <div className="signin-image w-1/2"></div>

                {/* Right Side */}
                <div className="login flex flex-col max-w-96 lg:max-w-screen-lg w-full rounded-r-md bg-white text-black px-4 lg:px-3 border gap-4 py-4">
                    <div className="flex flex-col justify-center items-center gap-1">
                        <img className="w-1/2 h-24" src={logo} alt="Acad AI logo" />
                        <h3 className="text-black font-medium text-[2rem]">Welcome Back!</h3>
                        <p className="text-black text-base font-normal text-center">
                            Don't have an account?{" "}
                            <span className="underline cursor-pointer" onClick={navigateToSignUp}>
                                Sign Up
                            </span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-start w-4/5 mx-auto">
                        <label htmlFor="email" className="text-[#666666]">
                            Email
                        </label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="email@example.com"
                            name="email"
                            value={formState.email}
                            onChange={handleInputChange}
                            sx={{ "& .MuiOutlinedInput-root": { height: "3rem" } }}
                        />

                        <label htmlFor="password" className="text-[#666666]">
                            Password
                        </label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Enter your password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formState.password}
                            onChange={handleInputChange}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                            sx={{ "& .MuiOutlinedInput-root": { height: "3rem" } }}
                        />

                        <button
                            className="w-full mt-4 h-12 font-extralight text-base rounded-full bg-[#c3c3c3] hover:bg-blue-800 text-white py-1 px-3 transition-all"
                            type="submit"
                        >
                            Log in
                        </button>

                        <h3 className="flex w-full justify-center text-[#666666] cursor-pointer">
                            Or, continue with
                            <img className="ml-1" width="25" height="20"
                                src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />
                        </h3>
                    </form>

                    <ForgotPassword open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
                </div>
            </div>

            <Toast open={toast.open} message={toast.message} onClose={closeToast} />
        </div>
    );
};

export default Login;
