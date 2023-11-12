import { Routes, Route } from "react-router-dom"
import { RegisterUser, LoginUser } from "../pages"

export default function ReactRoutes() {
    return (
        <Routes>
            <Route path="/auth/register" element={<RegisterUser/>}/>
            <Route path="/auth/login" element={<LoginUser/>}/>
            <Route path="*" element="Wrong Page"/>
        </Routes>
    )
}
