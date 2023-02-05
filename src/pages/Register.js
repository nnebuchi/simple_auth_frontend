import Buchi, {setBtnLoading, setBtnNotLoading, togglePasswordReveal, runValidation, showAlert} from '../plugins/Buchi';
import {useNavigate, Link} from 'react-router-dom';
import { useCookies } from "react-cookie";
const Register = () => {

    const base_url = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const validateRegisterForm = () => {
        const submitBtn = document.querySelector(".reg-btn");
       
        const oldBtnHTML = submitBtn.innerHTML;
        setBtnLoading(submitBtn);
        // console.log((submitBtn));
        // return;
        const validation = runValidation([
            {
                id:"username",
                rules: {'required':true}
            },
            {
                id:"email",
                rules: {'required':true, 'email':true}
            },

            {
                id:'password',
                rules:{'required':true, min_length:8}
            }
            
        ]);
        // console.log(validation)
        if(validation === true){
            submitRegisterForm(submitBtn, oldBtnHTML);
        }else{
            setBtnNotLoading(submitBtn, oldBtnHTML)
        }

    }


    const submitRegisterForm = async (submitBtn, oldBtnHTML) => {
        return await fetch(`${base_url}auth/register`, {
            method:"post",
            headers:{
                "Authorization": `Bearer ${process.env.REACT_APP_APP_TOKEN}`,
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                username:  document.querySelector("#username").value,
                email: document.querySelector("#email").value,
                password: document.querySelector("#password").value,
            })
        })
        .then((response)=>{
            return response.json();
        })
        .then((feedback)=>{
            if(feedback.status === 'success'){
                // showAlert('success', feedback.message);
                navigate(`/enter-otp?email=${feedback.email}`);
            }else{
                console.log(feedback)
                if(typeof(feedback?.errors)=='object'){
                    for(let field in feedback.errors){
                        showAlert('danger', feedback.errors[field][0]);
                    }
                }
                // showAlert('danger', feedback.error)
            }
            setBtnNotLoading(submitBtn, oldBtnHTML);
        })
        .catch((err)=>{
            console.log(err)
            setBtnNotLoading(submitBtn, oldBtnHTML)
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
                        <div className="form-group mb-2">
                            <label>Username</label>
                            <input type="text" className="form-control" id="username" placeholder="Enter usernamer" />
                        </div>
                        <div className="text-end">
                        <span className='me-3'>Already Registered? <Link to={'/login'}>Login</Link></span>    
                        <button className="btn btn-dark reg-btn" onClick={validateRegisterForm}>Register</button>  
                        </div>
                        
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Register;