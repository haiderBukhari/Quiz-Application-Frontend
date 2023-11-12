import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop(){
    const Location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [Location.pathname]);

    return (<></>);
}