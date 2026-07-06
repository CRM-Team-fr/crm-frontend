import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";




function OTPVerify() {



    const [otp, setOtp] = useState("");



    const location = useLocation();


    const navigate = useNavigate();



    const type = location.state?.type;





    function verifyOTP() {



        console.log("Verifying OTP:", otp);



        console.log("User came from:", type);





        if (type === "login") {



            navigate("/customer/dashboard");



        }





        else if (type === "register") {



            navigate("/customer/pending-approval");



        }





        else {



            console.log("Unknown user type");



        }



    }







    return (

        <div>



            <h1>OTP Verification</h1>




            <input

                placeholder="Enter OTP"

                value={otp}

                onChange={(event) => setOtp(event.target.value)}

            />




            <button onClick={verifyOTP}>


                Verify OTP


            </button>



        </div>

    );


}




export default OTPVerify;