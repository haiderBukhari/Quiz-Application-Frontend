import { useCallback, useEffect, useState } from "react";
import VerificationBox from "../VerificationBox"
import { useParams } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { AuthenticateAccount } from "../../services/api/PostRequests";
import { ToastError, ToastInfo } from "../ToastNotifications";

export const ActivateAccount = () => {
    const [otpModel, setOtpModel] = useState(false)
    const [verify, setverify] = useState(false)
    const [otp, setOtp] = useState(new Array(8).fill(''));
    const [email, setemail] = useState('');
    const { id } = useParams();
    useEffect(() => {
        if (id && id.length === 8) {
            const otpArr = id.split('');
            setOtp(otpArr)
        }
    }, [])

    const AutheticateAccount = useCallback(async () => {
        console.log({ email, otp: otp.join("") });
        await AuthenticateAccount(email, otp.join("")).then(res => ToastInfo(res.response.data.message)).catch(err => { ToastError(err.response.data.message) });
        setverify(false)
    }, [])

    useEffect(() => {
        if (verify) {
            AutheticateAccount();
        }
    }, [verify])
    return (
        <div style={{ minHeight: '100vh', width: '100%' }} className="bg-slate-100">
            {
                otpModel && <VerificationBox otpModel={otpModel} setOtpModel={setOtpModel} verify={verify} setverify={setverify} otp={otp} setOtp={setOtp} VerificationLength={8} heading="Verify Activation Code" para="This Verification is a part of procedure so no one can spam your Quizzes" />
            }
            <Dialog
                open={true}
                onClose={() => { setOtpModel(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <p className='text-2xl font-semibold text-center my-2'>Activate Account</p>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Enter your <span className='font-semibold'>Email</span> Address for which you want to activate the account.
                    </DialogContentText>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Email Address"
                        multiline
                        maxRows={4}
                        style={{ marginTop: "15px", width: "100%" }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setemail(e.target.value); }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button className={`cursor: ${email.length === 0 || !email.includes('@') ? "cursor-not-allowed" : "cursor-pointer"} `} disabled={email.length === 0 || !email.includes('@') ? true : false} style={{ backgroundColor: `${email.length === 0 || !email.includes('@') ? 'red' : '#0d6efd'} `, color: '#fff', margin: '10px' }} onClick={() => { setOtpModel(true) }} autoFocus>
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}