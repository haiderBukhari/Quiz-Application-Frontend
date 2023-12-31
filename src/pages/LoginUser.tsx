import { Login } from "../components"
import { useNavigate } from "react-router-dom"
export const LoginUser = () => {
    const Navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', width: '100%' }} className="flex flex-col justify-center items-center">
            <div style={{ maxWidth: '520px', minWidth: '300px', width: "100%", height: 'auto', margin: '20px 20px 0 20px' }} className=" text-base">
                <button style={{ border: 'none', borderBottom: '0px solid #ccc' }} onClick={() => { Navigate('/auth/register') }} className={`bg-slate-100 p-4 text text-slate-500 text-base font-semibold focus-within:outline-none w-2/4`}>Sign Up</button>
                <button style={{ border: '1px solid #ccc', borderBottom: 'none', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }} onClick={() => { Navigate('/auth/login') }} className={`bg-white text text-slate-500 text-base font-semibold p-4 w-2/4 `}>SIGN IN</button>
            </div>
            <div style={{ maxWidth: '520px', minWidth: '300px', width: "100%", height: 'auto', margin: '0 20px 20px 20px', border: '1px solid #ccc', borderTop: 'none', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }} className="bg-white text-base pb-20">
                {
                    <Login />
                }
            </div>
        </div>
    )
}