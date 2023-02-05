import React, {useEffect} from "react";
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

const UserAuth = ({user_cookies}) =>{
    // const [cookies, setCookies] = useCookies(['user']);
    // const cookies = user_cookies;
    const navigate = useNavigate();

    useEffect(() => {
        if(!user_cookies?.token){
            navigate('/login')
        }
        
    }, [user_cookies]);
    return(
            !user_cookies?.token
            ?
            <Navigate to={'/login'}/>
            : 
            <Outlet />
    )

    
 
}


export default UserAuth;