import { useState } from "react";
import VerificationBox from "../VerificationBox"

export const ActivateAccount = () => {
    const [otpModel, setOtpModel] = useState(true)
    const [verify, setverify] = useState(false)
    const [otp, setOtp] = useState(new Array(8).fill(''));
    return (
        <div style={{ minHeight: '100vh', width: '100%' }} className="bg-slate-100">
            {
                otpModel && <VerificationBox otpModel={otpModel} setOtpModel={setOtpModel} verify={verify} setverify={setverify} otp={otp} setOtp={setOtp} VerificationLength={8} />
            }
        </div>
    )
}