import { useState } from "react";
import { useNavigate } from "react-router-dom";


function CustomerLogin() {


    const [phone, setPhone] = useState("");


    const navigate = useNavigate();



    function sendOTP() {


        console.log("Sending OTP to:", phone);


        navigate("/customer/verify-otp", {

            state: {

                type: "login"

            }

        });


    }



    return (

        <div>


            <h1>Customer Login</h1>



            <input

                placeholder="Enter Phone Number"

                value={phone}

                onChange={(event) => setPhone(event.target.value)}

            />



            <button onClick={sendOTP}>

                Send OTP

            </button>



            <p>

                New Customer?

            </p>



            <button

                onClick={() => navigate("/customer/register")}

            >

                Register

            </button>



        </div>

    );


}


export default CustomerLogin;