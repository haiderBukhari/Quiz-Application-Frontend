import { useEffect, useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import FacebookLogin from 'react-facebook-login-typed';
import FacebookIcon from '@mui/icons-material/Facebook';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReCAPTCHA from "react-google-recaptcha";
import { OTPREQUEST, RegisterUser } from "../../services/api/PostRequests";
import LoaderModal from "../Loader";
import { ToastSuccess, ToastError } from "../ToastNotifications";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";

export type AuthProps = {
    setOtpModel: (otpModel: boolean) => void
    verify: boolean
    setverify: (otpModel: boolean) => void
    otp: string[]
    setOtp: (otp: string[]) => void
}
export const Register: React.FC<AuthProps> = ({ setOtpModel, verify, setverify, otp, setOtp }) => {
    interface userRegisteration {
        name: string,
        email: string,
        password: string,
        confirmpassword: string
    }
    const Navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [submit, setsubmit] = useState(false);
    const [userInfo, setUserInfo] = useState<userRegisteration>({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    });

    useEffect(() => {
        function verifyAll(password: string) {
            const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@!#*]).{8,}$/.test(password);
            return isValid;
        }
        setsubmit(verifyAll(userInfo.password));
    }, [userInfo.password])

    const [error, seterror] = useState({
        name: false,
        email: false,
        password: false,
        confirmpassword: false
    });

    function onChange() {
        setVerified(true);
    }

    type ObjectType = {
        name: string,
        email: string,
        password: string,
        confirmpassword: string
    }
    const handleRegister = async (Userdata: ObjectType) => {
        setloading(true);
        await OTPREQUEST(Userdata?.email)
            .then((res) => {
                if (res && res != 'string' && res.data) {
                    ToastSuccess("OTP Sent Successfully")
                    setOtpModel(true)
                } else {
                    console.log(res);
                    ToastError(res.response.data.message)
                }
                setloading(false);
            })
            .catch((err) => {
                console.log(err)
                setloading(false);
                ToastError(err)
            });
    }

    const handletoken = async (credentialResponse: string) => {
        const decoded: userRegisteration = await jwtDecode(credentialResponse);
        const userdata = {
            name: decoded.name ?? 'Anonymous',
            email: decoded.email ?? 'anonymous@quizapp.com',
            password: import.meta.env.VITE_Special_Password,
            confirmpassword: import.meta.env.VITE_Special_Password,
        };
        setUserInfo(userdata);
        handleRegister(userdata);
    }
    useEffect(() => {
        if (verify === true) {
            RegisterUser(userInfo.name, userInfo.email, userInfo.password, userInfo.confirmpassword, otp.join('')).then((res) => {
                setOtpModel(false);
                if (res != 'string' && res.data) {
                    ToastSuccess("Registered Successfully! Please Login")
                    Navigate('/auth/login')
                }
                else {
                    ToastError(res)
                }
                setverify(false)
                setloading(false);
            }).catch((err) => {
                alert(err)
                setOtp(new Array(6).fill(''))
                setverify(false)
                setloading(false);
            })
        }
    }, [verify])
    return (
        <div className="my-3 mx-2 px-4">
            <h1 style={{ fontSize: "27px" }} className="font-semibold text-center mt-10">Create your account.</h1>
            <p className="text-center mt-6 font-sans">Build Skill for today, tomorrow, and beyond</p>
            <p className="text-center font-sans">Education to future-proof your career</p>
            <div className="flex justify-center items-center mt-3 flex-wrap">
                <div className="mt-4 mr-2" style={{ width: 'auto' }}>
                    <GoogleLogin onSuccess={credentialResponse => {
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
                        <div className="flex justify-center items-center text-sm font-semibold mt-4 p-2 mr-2 text-gray-700" style={{ border: "1px solid #ccc", paddingTop: "6.5px", paddingBottom: "6.5px", borderRadius: "3px", width: "auto", marginRight: "10px" }}>
                            <FacebookIcon style={{ color: "#4267B2", marginRight: "10px" }} />
                            <button onClick={renderProps.onClick}>Sign up with Facebook</button>
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
                            type="password"
                            error={error.password}
                            onChange={(e) => {
                                if (e.target.value.length < 5) {
                                    seterror({ ...error, password: true })
                                }
                                else {
                                    seterror({ ...error, password: false })
                                }
                                setUserInfo({ ...userInfo, password: e.target.value })
                            }}
                            style={{ marginTop: "15px" }}
                        />
                        <div style={{ width: '100%', padding: '20px', border: '1px solid #ccc', boxShadow: "1px 1px 1px 1px #f4f4f4, -2px -2px 1px #f4f4f4" }} className="bg-slate-100 rounded-md my-3 flex flex-col justify-center">
                            <div className="flex">
                                {
                                    /[a-z]/.test(userInfo.password ?? "") ? <CheckCircleOutlineOutlinedIcon style={{ color: 'green', marginRight: "10px" }} /> : <ErrorOutlineOutlinedIcon style={{ color: 'red', marginRight: "10px" }} />
                                }
                                <p>Lower case letters (abc)</p>
                            </div>
                            <div className="flex mt-2">
                                {
                                    /[A-Z]/.test(userInfo.password) ? <CheckCircleOutlineOutlinedIcon style={{ color: 'green', marginRight: "10px" }} /> : <ErrorOutlineOutlinedIcon style={{ color: 'red', marginRight: "10px" }} />
                                }
                                <p>Upper case letters (ABC)</p>
                            </div>
                            <div className="flex mt-2">
                                {
                                    /[0-9]/.test(userInfo.password) ? <CheckCircleOutlineOutlinedIcon style={{ color: 'green', marginRight: "10px" }} /> : <ErrorOutlineOutlinedIcon style={{ color: 'red', marginRight: "10px" }} />
                                }
                                <p>Numbers (123)</p>
                            </div>
                            <div className="flex mt-2">
                                {
                                    /[$@!#*]/.test(userInfo.password) ? <CheckCircleOutlineOutlinedIcon style={{ color: 'green', marginRight: "10px" }} /> : <ErrorOutlineOutlinedIcon style={{ color: 'red', marginRight: "10px" }} />
                                }
                                <p>Special Character ($,@,!,#,*)</p>
                            </div>
                            <div className="flex mt-2">
                                {
                                    userInfo.password.length >= 8 ? <CheckCircleOutlineOutlinedIcon style={{ color: 'green', marginRight: "10px" }} /> : <ErrorOutlineOutlinedIcon style={{ color: 'red', marginRight: "10px" }} />
                                }
                                <p>Minimum 8 characters</p>
                            </div>
                            <div className="flex mt-2">
                                {
                                    userInfo.password === userInfo.confirmpassword && userInfo.password != "" ? <CheckCircleOutlineOutlinedIcon style={{ color: 'green', marginRight: "10px" }} /> : <ErrorOutlineOutlinedIcon style={{ color: 'red', marginRight: "10px" }} />
                                }
                                <p>Password Match</p>
                            </div>
                        </div>
                        <TextField
                            id="outlined-password-input"
                            label="Confirm Password"
                            type="password"
                            error={error.confirmpassword}
                            onChange={(e) => {
                                if (userInfo.password !== e.target.value) {
                                    seterror({ ...error, confirmpassword: true })
                                }
                                else {
                                    seterror({ ...error, confirmpassword: false })
                                }
                                setUserInfo({ ...userInfo, confirmpassword: e.target.value })
                            }}
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
                    style={{ marginTop: "14px" }}
                />
                <button disabled={!verified || error.password || error.email || error.name || error.confirmpassword || !submit} onClick={() => { handleRegister(userInfo) }} className={`m-aut0 px-12 py-3 text-white mt-5 bg-sky-600 hover:bg-sky-500 flex justify-center items-center ${(verified && !error.password && !error.email && !error.name && !error.email && !error.confirmpassword && submit) ? 'cursor-pointer' : 'cursor-not-allowed'}`} style={{ borderRadius: "4px" }}>Sign Up <ArrowForwardIcon style={{ marginLeft: "5px" }} /></button>
            </div>
            {
                loading && <LoaderModal />
            }
        </div>
    )
}