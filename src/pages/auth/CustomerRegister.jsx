import { useState } from "react";
import { useNavigate } from "react-router-dom";


function CustomerRegister() {


    const navigate = useNavigate();


    const [customer, setCustomer] = useState({

        businessName: "",

        ownerName: "",

        phone: "",

        address: ""

    });



    function handleChange(event) {


        setCustomer({

            ...customer,

            [event.target.name]: event.target.value

        });


    }




    function registerCustomer() {


        console.log("Customer Details:", customer);



        navigate("/customer/verify-otp", {

            state: {

                type: "register"

            }

        });


    }





    return (

        <div>


            <h1>Customer Registration</h1>



            <input

                name="businessName"

                placeholder="Business Name"

                value={customer.businessName}

                onChange={handleChange}

            />



            <input

                name="ownerName"

                placeholder="Owner Name"

                value={customer.ownerName}

                onChange={handleChange}

            />



            <input

                name="phone"

                placeholder="Phone Number"

                value={customer.phone}

                onChange={handleChange}

            />



            <input

                name="address"

                placeholder="Address"

                value={customer.address}

                onChange={handleChange}

            />



            <button onClick={registerCustomer}>

                Register

            </button>



        </div>

    );


}


export default CustomerRegister;