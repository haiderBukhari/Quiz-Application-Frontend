import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoaderModal from './Loader';

type AuthProps = {
    otpModel: boolean,
    setOtpModel: (otpModel: boolean) => void,
    verify: boolean,
    setverify: (verify: boolean) => void,
    otp: Array<string>,
    setOtp: (otp: Array<string>) => void
}

const VerifyOtp = ({ otpModel, setOtpModel, verify, setverify, otp, setOtp }: AuthProps) => {
    const referenceInput = useRef(new Array(6).fill(null));
    const [current, setcurrent] = useState(0);

    useEffect(() => {
        referenceInput.current[0]?.focus();
    }, [referenceInput])

    function handleDelete() {
        const otpArray = [...otp];
        if (otpArray[current] !== '') {
            otpArray[current] = '';
        } else if (current > 0) {
            const prevIndex = current - 1;
            otpArray[prevIndex] = '';
            setcurrent(prevIndex);
            referenceInput.current[prevIndex].focus();
        }
        setOtp(otpArray);
    }

    function addOtp(e:any) {
        const value = e.target.value;

        if (!value) {
            return;
        }

        const otpArray = [...otp];
        otpArray[current] = value;
        setOtp(otpArray);

        if (current + 1 == 6) {
            setverify(true)
        }
        const index = current + 1 >= 6 ? current : current + 1;
        setcurrent(index);

        if (index < 6) {
            referenceInput.current[index].focus();
            index < 5 && (referenceInput.current[index].value = "")
        }
    }

    return (
        <>
            <Dialog
                open={otpModel}
                onClose={() => { setOtpModel(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <p className='text-2xl font-semibold text-center my-2'>Verify OTP</p>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Check your <span className='font-semibold'>Email</span> for the OTP and verify it below. This verification is only for the first time. You can login without OTP next time.
                    </DialogContentText>
                    <div className='flex justify-center my-6'>
                        {
                            new Array(6).fill(22).map((val, index) => (
                                <input
                                    key={val * 1022}
                                    type="text"
                                    style={{
                                        border: `2px solid #333`,
                                        height: "40px",
                                        width: "40px",
                                        borderRadius: "3px",
                                        fontSize: "19px",
                                        textAlign: "center",
                                        marginRight: "9px"
                                    }}
                                    onClick={() => { setcurrent(index) }}
                                    maxLength={1}
                                    ref={(el) => { referenceInput.current[index] = el }}
                                    onInput={addOtp}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace') {
                                            handleDelete()
                                        }
                                    }}
                                />
                            ))
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOtpModel(false) }}>Cancel</Button>
                    <Button onClick={() => { setverify(true) }} autoFocus>
                        Verify
                    </Button>
                </DialogActions>
                {verify && <LoaderModal />}
            </Dialog>
        </>
    )
}
export default VerifyOtp;