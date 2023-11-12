import axios from "axios";
import Cookies from "universal-cookie";

export async function OTPREQUEST(email:string){
    return await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/send-otp`, {
        "email": email
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response)=>{return response}).catch(err=>{return err});
}

export function RegisterUser(name:string, email:string, password: string, confirmPassword:string, otp:string){
    const data = axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth`, {
        "name": name,
        "email": email,
        "password": password,
        "confirmPassword": confirmPassword,
        "otp": otp
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res)=>{return res}).catch(err=>{return err.response.data.data[0].msg});
    return data;
}


export function LoginUser(email:string, password: string){
    const cookie = new Cookies();
    return axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        "email": email,
        "password": password,
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res)=>{
        cookie.set("JWT_TOKEN", res.data.data.token);
        console.log(res);
        return res;
    }).catch(err=>{return err});
}