import { Routes, Route } from "react-router-dom"
import { RegisterUser, LoginUser } from "../pages"
import { ActivateAccount } from "../components"

export default function ReactRoutes() {
    return (
        <Routes>
            <Route path="/auth/register" element={<RegisterUser/>}/>
            <Route path="/auth/login" element={<LoginUser/>}/>
            <Route path="/auth/activateaccount" element={<ActivateAccount/>}/>
            <Route path="*" element="Wrong Page"/>
        </Routes>
    )
}
