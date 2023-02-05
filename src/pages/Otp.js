import Buchi, {setBtnLoading, setBtnNotLoading, togglePasswordReveal, runValidation, showAlert} from '../plugins/Buchi';
import {useNavigate, Link} from 'react-router-dom';
import { useCookies } from "react-cookie"; 

const Otp = () => {
    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies();
    const urlParams = new URLSearchParams(window.location.search);
    
    const base_url = process.env.REACT_APP_BASE_URL;
    const email = urlParams.get("email");

    const validateOTPForm = () =>{
        const submitBtn = document.querySelector(".reg-btn");
        const oldBtnHTML = submitBtn.innerHTML;
        setBtnLoading(submitBtn);

        const validation = runValidation([
            {
                id:"otp",
                rules: {'required':true, 'min_length':6, 'max_length':6}
            },
            
        ]);

        if(validation === true){
            submitOtpForm(submitBtn, oldBtnHTML);
           
        }else{
            setBtnNotLoading(submitBtn, oldBtnHTML)
        }  
    }

    const submitOtpForm = async (submitBtn, oldBtnHTML) => {
        return await fetch(`${base_url}auth/verify-otp`, {
            method:"post",
            headers:{
                "Authorization": `Bearer ${process.env.REACT_APP_APP_TOKEN}`,
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                email: email,
                otp: document.querySelector("#otp").value,
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
            setBtnNotLoading(submitBtn, oldBtnHTML)
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
                            <label>Enter OTP</label>
                            <input type="number" className="form-control" id="otp" placeholder="Enter OTP" />
                        </div>
                        <div className="text-end">
                            <button className="btn btn-dark reg-btn" onClick={validateOTPForm}>Verify</button>  
                        </div>
                        
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Otp