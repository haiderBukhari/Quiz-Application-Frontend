import { useEffect, useState } from "react"
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import FacebookLogin from 'react-facebook-login-typed';
import FacebookIcon from '@mui/icons-material/Facebook';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReCAPTCHA from "react-google-recaptcha";

export const Register = () => {
    interface userRegisteration {
        name: string,
        email: string,
        password: string,
        confirmpassword: string
    }

    
    const [verified, setVerified] = useState(false)
    const [isSignUp, setIsSignUp] = useState<boolean>(true)
    const [userInfo, setUserInfo] = useState<userRegisteration>({ name: "", email: "", password: "", confirmpassword: "" })
    const [error, seterror] = useState({ name: false, email: false, password: false, confirmpassword: false });
    function onChange() {
        setVerified(true);
    }
    const handletoken = (credentialResponse: string) => {
        const decoded: userRegisteration = jwtDecode(credentialResponse);
        setUserInfo({
            name: decoded.name ?? 'Anonymous',
            email: decoded.email ?? 'anonymous@quizapp.com',
            password: import.meta.env.VITE_Special_Password,
            confirmpassword: import.meta.env.VITE_Special_Password,
        })
    }
    useEffect(() => {
        console.log(userInfo);
    }, [userInfo])
    return (
        <div style={{ minHeight: '100vh', width: '100%' }} className="flex justify-center items-center">
            <div style={{ maxWidth: '520px', minWidth: '300px', width: "100%", height: 'auto', margin: '20px 20px' }} className="bg-white text-base rounded-md pb-20">
                <div style={{ width: '100%' }} className="flex flex-1 flex-wrap">
                    <button onClick={() => { setIsSignUp(true) }} className={`p-4 text text-slate-500 text-base font-semibold focus-within:ou-tline-none w-2/4 ${!isSignUp ? 'bg-slate-100 rounded-br-md' : 'text-black'}`}>Sign Up</button>
                    <button onClick={() => { setIsSignUp(false) }} className={`text text-slate-500 text-base font-semibold p-4 w-2/4 ${isSignUp ? 'bg-slate-100 rounded-bl-md focus-within:outline-none' : 'text-black'}`}>SIGN IN</button>
                </div>
                <div className="my-3 mx-2 px-4">
                    <h1 style={{ fontSize: "27px" }} className="font-semibold text-center mt-10">Create your account.</h1>
                    <p className="text-center mt-6 font-sans">Build Skill for today, tomorrow, and beyond</p>
                    <p className="text-center font-sans">Education to future-proof your career</p>
                    <div className="flex justify-center mt-3 flex-wrap">
                        <div className="mt-4 mr-2">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    handletoken(credentialResponse.credential || '')
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </div>
                        <FacebookLogin
                            appId={import.meta.env.VITE_FB_APP_ID}
                            autoLoad={false}
                            fields="name,email,picture"
                            scope="email"
                            callback={(responseFacebook) => {
                                setUserInfo({
                                    name: responseFacebook.name || "Anonymous",
                                    email: responseFacebook.email || "anonymous@quizapp.com",
                                    password: import.meta.env.VITE_Special_Password,
                                    confirmpassword: import.meta.env.VITE_Special_Password,
                                })
                            }}
                            render={renderProps => (
                                <div className="flex justify-center items-center text-sm font-semibold mt-4 p-2 mr-2" style={{ border: "1px solid #ccc", borderRadius: "3px", width: "217px" }}>
                                    <FacebookIcon style={{ color: "#4267B2", marginRight: "10px" }} />
                                    <button onClick={renderProps.onClick}>Sign in with Facebook</button>
                                </div>
                            )}
                        />
                    </div>
                    <div className="mt-6 flex flex-1 items-center justify-center">
                        <hr style={{ width: "41%" }} />
                        <p className="text-base font-semibold text-slate-600 mx-4" style={{ width: "4%", textAlign: "center" }}>or</p>
                        <hr style={{ width: "41%" }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: "center", width: "100%" }}>
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { width: '100%' },
                            }}
                            noValidate
                            autoComplete="off"
                            style={{ width: "94%" }}
                        >
                            <div style={{ width: "100%", marginTop: "15px" }}>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Full Name"
                                    error={error.name}
                                    onChange={(e) => {
                                        if (e.target.value.length < 2) {
                                            seterror({ ...error, name: true })
                                        }
                                        else {
                                            seterror({ ...error, name: false })
                                            setUserInfo({ ...userInfo, name: e.target.value })
                                        }
                                    }}
                                    multiline
                                    maxRows={4}
                                    style={{ marginTop: "15px" }}
                                />
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Email Address"
                                    error={error.email}
                                    onChange={(e) => {
                                        if (e.target.value.length < 5 || !e.target.value.includes('@')) {
                                            seterror({ ...error, email: true })
                                        }
                                        else {
                                            seterror({ ...error, email: false })
                                            setUserInfo({ ...userInfo, email: e.target.value })
                                        }
                                    }}
                                    multiline
                                    maxRows={4}
                                    style={{ marginTop: "15px" }}
                                />
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Password"
                                    error={error.password}
                                    onChange={(e) => {
                                        if (e.target.value.length < 5) {
                                            seterror({ ...error, password: true })
                                        }
                                        else {
                                            seterror({ ...error, password: false })
                                            setUserInfo({ ...userInfo, password: e.target.value })
                                        }
                                    }}
                                    multiline
                                    maxRows={4}
                                    style={{ marginTop: "15px" }}
                                />
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Confirm Password"
                                    error={error.confirmpassword}
                                    onChange={(e) => {
                                        if (userInfo.password !== e.target.value) {
                                            seterror({ ...error, confirmpassword: true })
                                        }
                                        else {
                                            seterror({ ...error, confirmpassword: false })
                                            setUserInfo({ ...userInfo, confirmpassword: e.target.value })
                                        }
                                    }}
                                    multiline
                                    maxRows={4}
                                    style={{ marginTop: "15px", marginBottom: "20px" }}
                                />
                            </div>
                        </Box>
                        <div style={{ width: "90%", textAlign: "center" }}>
                            <p style={{ fontSize: "12px", fontWeight: "500", lineHeight: "1.3rem" }}>By clicking "Sign up," you agree to our <span style={{ textDecoration: "underline" }}>Term of Use</span> and our <span style={{ textDecoration: "underline" }}>Privacy Policy</span>.</p>
                        </div>
                        <ReCAPTCHA
                            sitekey={import.meta.env.VITE_Site_Key}
                            onChange={onChange}
                        />
                        <button disabled={!verified} className="m-aut0 px-12 py-3 text-white mt-5 bg-sky-600 hover:bg-sky-500 flex justify-center items-center" style={{ borderRadius: "4px" }}>Submit <ArrowForwardIcon style={{ marginLeft: "5px" }} /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}