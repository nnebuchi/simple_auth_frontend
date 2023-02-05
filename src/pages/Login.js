import React from 'react';
import Buchi, {setBtnLoading, setBtnNotLoading, togglePasswordReveal, runValidation, showAlert} from '../plugins/Buchi';
import {Link, useNavigate} from 'react-router-dom';
import { useCookies } from "react-cookie";

const Login = () => {

    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies();
    const base_url = process.env.REACT_APP_BASE_URL;

    const validateLoginForm = () => {
        const submitBtn = document.querySelector(".reg-btn");
        const oldBtnHTML = submitBtn.innerHTML;
        setBtnLoading(submitBtn);

        const validation = runValidation([
            {
                id:"email",
                rules: {'required':true, 'email':true}
            },

            {
                id:'password',
                rules:{'required':true}
            }
            
        ]);
        
        if(validation === true){
            submitLoginForm(submitBtn, oldBtnHTML);
           setBtnNotLoading(submitBtn, oldBtnHTML)
        }else{
            setBtnNotLoading(submitBtn, oldBtnHTML)
        }

    }


    const submitLoginForm = async (submitBtn, oldBtnHTML) => {
        return await fetch(`${base_url}auth/login`, {
            method:"post",
            headers:{
                "Authorization": `Bearer ${process.env.REACT_APP_APP_TOKEN}`,
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                email: document.querySelector("#email").value,
                password: document.querySelector("#password").value,
            })
        })
        .then((response)=>{
            return response.json();
        })
        .then((feedback)=>{
            if(feedback.status === 'success'){
                setCookies(
                    'user',
                    {
                        token: feedback.token,
                        data: feedback.user,
                        isVerified: feedback.is_verified
    
                    }, 
                    {
                        path: "/", // available accross this application
                        maxAge: 86400 //1 day
                    }
                );
                navigate('/');
            }else{
                showAlert('danger', feedback.error)
            }
            submitBtn.innerHTML = oldBtnHTML
            submitBtn.removeAttribute('disabled');
        })
        .catch((err)=>{
            console.log(err)
            submitBtn.innerHTML = oldBtnHTML
            submitBtn.removeAttribute('disabled');
        })
    }

    return(
        <section>
            <div className="row justify-content-center mt-5">
                <div className="col-md-6 col-sm-8 bg-primary py-5 rounded">
                    <div className='d-flex justify-content-center'>
                        <div className='alert-holder w-75'></div>
                    </div>
                    <form action="" method="post" onSubmit={(event)=>{event.preventDefault()}}>
                        <div className="form-group mb-2">
                            <label>Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Email" />
                        </div>
                        <div className="form-group mb-2">
                            <label>Password</label>
                            <div className="input-group">
                                
                                <input type="password" className="form-control" id="password" placeholder="Create Password" />
                                <span className="input-group-text" id="eye"onClick={()=>{
                                    togglePasswordReveal('eye', 'password')
                                }}> <i className="fa fa-eye"></i></span>
                            </div>
                        </div>
                        
                        <div className="justify-content-between d-flex">
                            <p className='text-white'>Click <strong><Link to={'/register'}>Here</Link></strong>  to register </p>
                            <button className="btn btn-dark reg-btn" onClick={validateLoginForm}>Login</button>  
                        </div>
                        
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Login;