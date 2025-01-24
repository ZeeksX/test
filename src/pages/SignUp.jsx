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
        navigate("/login");
    };

    return (
        <>
            <div className="landing flex flex-col items-center lg:justify-center justify-center gap-4 md:gap-2 lg:gap-0 w-full min-h-screen">
                <div className="sign-in flex flex-row w-[80%] md:w-auto lg:w-3/5 lg:h-[90vh]">
                    <div className="signin-image w-1/2 md:flex hidden"></div>
                    <div className="login flex flex-col lg:max-w-screen-lg w-full rounded-md md:rounded-r-md  bg-[white] text-black px-2 md:px-4 lg:px-3 border gap-4 py-4">
                        <div className="flex flex-col justify-center items-center gap-1 lg:gap-2">
                            <img className="w-1/2 h-16" src={logo} alt="Acad AI logo" />
                            <h3 className="text-black font-medium text-[1.25rem] leading-[1rem]">Create an account</h3>
                            <p className="text-[#666666] text-[12px] font-normal leading-[19.36px] text-center">Already have an account?
                                <a className="underline cursor-pointer ml-1" onClick={handleSignInClick}>Log in</a>
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="form flex flex-col gap-1 2xl:gap-3 items-start justify-center w-4/5 mx-auto h-auto">
                            <label htmlFor="name" className="text-[#666666]">Full name (Surname first)</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="name"
                                id="name"
                                value={name}
                                autoComplete="name"
                                onChange={(event) => setName(event.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '2rem', // Set the height of the TextField
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
                                        height: '2rem', // Set the height of the TextField
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
                                        height: '2rem', // Set the height of the TextField
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
                                        height: '2rem', // Set the height of the TextField
                                        fontSize: "12px"
                                    }
                                }}
                            />
                            <button
                                className="w-full flex justify-center items-center mt-6 md:mt-4 h-12 md:h-10 lg:h-12 font-light text-base leading-[24.2px] rounded-full bg-[#c3c3c3] hover:bg-blue-800 text-white py-1 px-3 lg:py-4 border border-transparent transition-all focus:outline-none"
                                type="submit"
                            >
                                Create an account
                            </button>
                            <h3 className="flex w-full mt-2 mb-2 justify-center text-[#666666] hover:text-gray-600 text-center cursor-pointer">Or, continue with
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
