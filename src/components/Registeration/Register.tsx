import { useEffect, useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import FacebookLogin from 'react-facebook-login-typed';
import FacebookIcon from '@mui/icons-material/Facebook';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReCAPTCHA from "react-google-recaptcha";
import { AuthProps } from "../../utils/helper";
import { OTPREQUEST } from "../../API/PostRequests";
import LoaderModal from "../Loader";
import CustomizedSnackbars from "../ToastNotifications";

export const Register: React.FC<AuthProps> = ({ otpModel, setOtpModel }) => {
    interface userRegisteration {
        name: string,
        email: string,
        password: string,
        confirmpassword: string
    }

    useEffect(() => {
        setOtpModel(otpModel);
    }, []);

    const inital = { status: false, display: "", current: "" };
    const [loading, setloading] = useState(false);
    const [verified, setVerified] = useState(true);
    const [toast, setToast] = useState(inital);
    const [userInfo, setUserInfo] = useState<userRegisteration>({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    });
    const [error, seterror] = useState({
        name: false,
        email: false,
        password: false,
        confirmpassword: false
    });

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
        });
    }

    const handleRegister = () => {
        setloading(true);
        OTPREQUEST(userInfo.email)
            .then((res) => {
                console.log(res);
                if (res.data) {
                    setloading(false);
                    setToast({ status: true, display: "OTP Sent Successfully", current: "success" })
                    setOtpModel(!otpModel)
                } else {
                    throw new Error();
                }
            })
            .catch(() => {
                setloading(false);
                setToast({ status: true, display: "Error during Registering, Try with different Email", current: "error" })
            });
    }
    useEffect(() => {
        if (toast.display) {
            setTimeout(() => {
                setToast(inital)
            }, 4000);
        }
    }, [toast.display, inital])

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
                                    setUserInfo({ ...userInfo, password: e.target.value })
                                }
                            }}
                            maxRows={4}
                            style={{ marginTop: "15px" }}
                        />
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
                                    setUserInfo({ ...userInfo, confirmpassword: e.target.value })
                                }
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
                {/* disabled={!verified || error.email || error.name || error.confirmpassword || error.password}  */}
                <button onClick={() => { handleRegister() }} className={`m-aut0 px-12 py-3 text-white mt-5 bg-sky-600 hover:bg-sky-500 flex justify-center items-center ${verified ? 'cursor-pointer' : 'cursor-not-allowed'}`} style={{ borderRadius: "4px" }}>Sign Up <ArrowForwardIcon style={{ marginLeft: "5px" }} /></button>
            </div>
            {
                loading && <LoaderModal />
            }
            {
                toast.status && <CustomizedSnackbars status={toast.current} str={toast.display} />
            }
        </div>
    )
}