import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/Auth";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { TextField, InputAdornment, IconButton } from "@mui/material";
import "../styles/main.css";
import ForgotPassword from '../components/modals/ForgotPassword';
import logo from "../assets/Acad AI logo.jpg";
import Toast from '../components/modals/Toast';

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const auth = useAuth();
    const { setUser } = auth;
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

        try {
            const res = await fetch("http://localhost:3000/api/v1/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setUser({ id: data.user.id, email: data.user.email, role: data.user.role });
                setToastMessage(data.message);
                setToastOpen(true);
                navigate("/dashboard");
            } else {
                setToastMessage(data.message || "Sign up failed. Please try again.");
                setToastOpen(true);
            }
        } catch (error) {
            console.error("Error during sign up:", error.message);
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

    const handleSignInClick = () => {
        navigate("/");
    };

    return (
        <>
            <div className="landing flex flex-col items-center lg:justify-center justify-center gap-2 lg:gap-0 w-full min-h-screen">
                <div className="sign-in flex flex-row lg:w-3/5 lg:h-[90vh]">
                    <div className="signin-image w-1/2"></div>
                    <div className="login flex flex-col max-w-96 lg:max-w-screen-lg w-full rounded-r-md bg-[white] text-black px-4 lg:px-3 border gap-4 py-4">
                        <div className="flex flex-col justify-center items-center gap-1">
                            <img className="w-2/5 h-12" src={logo} alt="Acad AI logo" />
                            <h3 className="text-black font-medium text-[1.5rem] leading-[2rem]">Create an account</h3>
                            <p className="text-black text-base font-normal leading-[19.36px] text-center">Already have an account?
                                <a className="underline cursor-pointer ml-1" onClick={handleSignInClick}>Log in</a>
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="form flex flex-col gap-2 items-start justify-center w-4/5 mx-auto h-auto">
                            <label htmlFor="name" className="text-[#666666]">Full name (Surname first)</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="name"
                                id="name"
                                value={name}
                                autoComplete="name"
                                onChange={(event) => setName(event.target.value)}
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
                            />
                            <button
                                className="w-full mt-2 h-10 font-extralight text-base leading-[24.2px] rounded-full bg-[#c3c3c3] hover:bg-blue-800 text-white py-1 px-3 border border-transparent transition-all focus:outline-none"
                                type="submit"
                            >
                                Create an account
                            </button>
                            <h3 className="flex w-full justify-center text-[#666666] hover:text-gray-600 text-center cursor-pointer">Or, continue with
                                <img className="ml-1" width="25" height="20" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />
                            </h3>
                        </form>
                        <ForgotPassword open={forgotPasswordOpen} onClose={handleForgotPasswordClose} />
                    </div>
                </div>
            </div>
            <Toast open={toastOpen} message={toastMessage} onClose={handleToastClose} />
        </>
    );
};

export default SignUp;
