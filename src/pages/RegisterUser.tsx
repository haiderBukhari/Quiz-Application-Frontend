import { useState } from "react"
import { Register, Login } from "../components"
export const RegisterUser = () => {
    const [isSignUp, setIsSignUp] = useState<boolean>(true)
    return (
        <div style={{ minHeight: '100vh', width: '100%' }} className="flex justify-center items-center">
            <div style={{ maxWidth: '520px', minWidth: '300px', width: "100%", height: 'auto', margin: '20px 20px' }} className="bg-white text-base rounded-md pb-20">
                <div style={{ width: '100%' }} className="flex flex-1 flex-wrap">
                    <button onClick={() => { setIsSignUp(true) }} className={`p-4 text text-slate-500 text-base font-semibold focus-within:ou-tline-none w-2/4 ${!isSignUp ? 'bg-slate-100 rounded-br-md' : 'text-black'}`}>Sign Up</button>
                    <button onClick={() => { setIsSignUp(false) }} className={`text text-slate-500 text-base font-semibold p-4 w-2/4 ${isSignUp ? 'bg-slate-100 rounded-bl-md focus-within:outline-none' : 'text-black'}`}>SIGN IN</button>
                </div>
                {
                    isSignUp ? <Register /> : <Login />
                }
            </div>
        </div>
    )
}