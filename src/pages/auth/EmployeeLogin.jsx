import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";



function EmployeeLogin() {


    const navigate = useNavigate();


    const { login } = useContext(AuthContext);



    const [employee, setEmployee] = useState({

        email: "",

        password: ""

    });




    function handleChange(event) {


        setEmployee({

            ...employee,

            [event.target.name]: event.target.value

        });


    }





    function loginEmployee() {


        console.log("Employee Login:", employee);




        let fakeResponse = null;




        if (

            employee.email === "admin@gmail.com"

            &&

            employee.password === "1234"

        ) {


            fakeResponse = {

                token: "fake-admin-token",

                user: {

                    id: 1,

                    Name: "Admin User",

                    role: "admin"

                }

            };


        }




        else if (

            employee.email === "manager@gmail.com"

            &&

            employee.password === "1234"

        ) {


            fakeResponse = {

                token: "fake-manager-token",

                user: {

                    id: 2,

                    Name: "Manager User",

                    role: "manager"

                }

            };


        }





        else if (

            employee.email === "sales@gmail.com"

            &&

            employee.password === "1234"

        ) {


            fakeResponse = {

                token: "fake-sales-token",

                user: {

                    id: 3,

                    Name: "Sales User",

                    role: "salesperson"

                }

            };


        }




        else {


            console.log("Invalid Credentials");

            return;


        }







        login(

            fakeResponse.user,

            fakeResponse.token

        );






        if (fakeResponse.user.role === "admin") {


            navigate("/admin/dashboard");


        }



        else if (fakeResponse.user.role === "manager") {


            navigate("/manager/dashboard");


        }



        else if (fakeResponse.user.role === "salesperson") {


            navigate("/sales/dashboard");


        }


    }







    return (

        <div>


            <h1>Employee Login</h1>



            <input

                name="email"

                placeholder="Email"

                value={employee.email}

                onChange={handleChange}

            />




            <input

                name="password"

                placeholder="Password"

                type="password"

                value={employee.password}

                onChange={handleChange}

            />




            <button onClick={loginEmployee}>


                Login


            </button>



        </div>

    );


}



export default EmployeeLogin;