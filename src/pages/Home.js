import { useCookies } from "react-cookie";

const Home = ({logout}) => {
    const [cookies, setCookies] = useCookies(['user']);
    // console.log(props)
    return(
        <section>
            <div className="row justify-content-center mt-5">
                <div className="col-md-6 col-sm-8 bg-primary py-5 rounded">
                   <div className="d-flex justify-content-center">
                       <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-4 " style={{height: "100px", width:" 100px"}}>
                           <i className="fa fa-user fa-4x text-dark align-self-center"></i>
                       </div>
                   </div>
                   <div className="row">
                       <div className="col-12 text-center">
                           <h1 className="display-5">Welcome {cookies?.user?.data.username}</h1>
                           <br />
                           <p className="text-light">Email: {cookies?.user?.data.email}</p>
                           <button className="btn btn-danger" onClick={logout}>Logout</button>
                       </div>
                   </div>
                </div>
            </div>
        </section>
    );
}
export default Home