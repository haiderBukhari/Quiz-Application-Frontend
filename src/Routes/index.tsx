import { Routes, Route } from "react-router-dom"
import { Register } from "../components"
export default function ReactRoutes() {
    return (
        <Routes>
            <Route path="*" element={<Register/>}/>
        </Routes>
    )
}
