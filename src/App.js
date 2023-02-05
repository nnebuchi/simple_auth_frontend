import React from 'react';
import './App.css';
import { Route, Routes, useNavigate} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Otp from './pages/Otp';
import Home from './pages/Home';
import UserAuth from './utils/UserAuth';
import { useCookies } from "react-cookie";

function App() {

  const [cookies, setCookies] = useCookies(['user']);
  const navigate = useNavigate();
  const logout = async () => {
    const base_url = process.env.REACT_APP_BASE_URL;
    return await fetch(`${base_url}logout`, {
        method:"post",
        headers:{
            "Authorization": `Bearer ${cookies?.user?.token}`,
            "Content-Type": "application/json"
        }
    })
    .then((response)=>{
        return response.json();
    })
    .then((feedback)=>{
        if(feedback?.status === 'success'){
            document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate('/login')
        }
    })    
}

  return (
    <Routes>
        <Route element={<UserAuth user_cookies = {cookies.user} />}>
          <Route path='/' element={<Home logout = {logout}/>}/>
        </Route>
       
       <Route path='/register' element={<Register />}/>
       <Route path='/enter-otp' element={<Otp />}/>
       <Route path='/login' element={<Login />}/>
    </Routes>
   
  );
}

export default App;
