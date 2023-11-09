import { Routes, Route } from "react-router-dom"
import { RegisterUser } from "../pages"
export default function ReactRoutes() {
    return (
        <Routes>
            <Route path="*" element={<RegisterUser/>}/>
        </Routes>
    )
}
