import { useNavigate } from "react-router-dom";


function UserSelection() {


    const navigate = useNavigate();


    return (

        <div>


            <h1>HII CUTIE!</h1>


            <h2>Who are you?</h2>



            <button 
            
                onClick={() => navigate("/customer/login")}
            
            >

                Customer

            </button>



            <button 
            
                onClick={() => navigate("/employee/login")}
            
            >

                Employee

            </button>


        </div>

    );

}


export default UserSelection;