import { useEffect, useState } from "react"
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import FacebookLogin from 'react-facebook-login-typed';
import FacebookIcon from '@mui/icons-material/Facebook';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReCAPTCHA from "react-google-recaptcha";
import { LoginUser } from "../../services/api/PostRequests";
import LoaderModal from "../Loader";
import { ToastSuccess, ToastError } from "../ToastNotifications";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

export const Login = () => {
    interface userRegisteration {
        email: string,
        password: string,
    }
    const [verified, setVerified] = useState(false)
    const [userInfo, setUserInfo] = useState<userRegisteration>({ email: "", password: "" })
    const [error, seterror] = useState({ name: false, email: false, password: false, confirmpassword: false });
    const [loading, setLoading] = useState(false);
    const [submit, setsubmit] = useState(false)
    function onChange() {
        setVerified(true);
    }
    const handletoken = (credentialResponse: string) => {
        const decoded: userRegisteration = jwtDecode(credentialResponse);
        const userdata = {
            email: decoded.email ?? 'anonymous@quizapp.com',
            password: import.meta.env.VITE_Special_Password,
        }
        setUserInfo(userdata)
        handlesubmit(userdata)
    }

    type userDataType = {
        email: string,
        password: string
    };
    const handlesubmit = async (userData: userDataType) => {
        setLoading(true);
        await LoginUser(userData.email, userData.password).then((res) => {
            console.log(res)
            if(res && typeof(res)!='string' && res.data){
                ToastSuccess("Logged in Successfully")
            }
            else{
                ToastError(res.response.data.message)
            }
            setLoading(false)
        }).catch((err) => {
            ToastError(err.response.data.message)
            setLoading(false)
        })
    }

    useEffect(() => {
        function verifyAll(password:string){
            const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@!#*]).{8,}$/.test(password);
            return isValid;      
        }
        setsubmit(verifyAll(userInfo.password));
    }, [userInfo.password])

    return (
        <div className="my-3 mx-2 px-4">
            <h1 style={{ fontSize: "27px" }} className="font-semibold text-center mt-10">Sign in to your account.</h1>
            <p className="text-center mt-6 font-sans">Build Skill for today, tomorrow, and beyond</p>
            <p className="text-center font-sans">Education to future-proof your career</p>
            <div className="flex justify-center items-center mt-3 flex-wrap">
                <div className="mt-4 mr-2" style={{ width: "auto" }}>
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
                            email: responseFacebook.email || "anonymous@quizapp.com",
                            password: import.meta.env.VITE_Special_Password,
                        })
                    }}
                    render={renderProps => (
                        <div className="flex justify-center items-center text-sm font-semibold mt-4 p-2 mr-2 text-gray-700" style={{ border: "1px solid #ccc", paddingTop: "6.5px", paddingBottom: "6.5px", borderRadius: "3px", width: "auto" }}>
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
                            id="outlined-password-input"
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
                            maxRows={4}
                            style={{ marginTop: "15px" }}
                        />
                    </div>
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
                    </div>
                </Box>

                <div style={{ width: "90%", textAlign: "center", marginTop: "15px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "500", lineHeight: "1.3rem" }}>By clicking "Sign in," you agree to our <span style={{ textDecoration: "underline" }}>Term of Use</span> and our <span style={{ textDecoration: "underline" }}>Privacy Policy</span>.</p>
                </div>
                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_Site_Key}
                    onChange={onChange}
                    style={{ marginTop: "14px" }}
                />
                <button onClick={()=>{handlesubmit(userInfo)}} disabled={!verified || error.email || error.password || !submit} className={`m-aut0 px-12 py-3 text-white mt-5 bg-sky-600 hover:bg-sky-500 flex justify-center items-center ${(verified && submit) ? 'cursor-pointer' : 'cursor-not-allowed'}`} style={{ borderRadius: "4px" }}>Sign In <ArrowForwardIcon style={{ marginLeft: "5px" }} /></button>
            </div>
            {
                loading && <LoaderModal />
            }
        </div>
    )
}