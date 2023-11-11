import axios from "axios";

export function OTPREQUEST(email:string){
    console.log(import.meta.env.VITE_BACKEND_URL);
    const data = axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/send-otp`, {
        email
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response)=>response.data).catch(err=>err);
    return data;
}