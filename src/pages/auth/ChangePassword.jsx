import { useState, useContext } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import api from "../../api/axiosInstance";

import { AuthContext } from "../../context/AuthContext";



function ChangePassword() {


    const navigate = useNavigate();


    const location = useLocation();


    const { login } = useContext(AuthContext);



    const employeeId = location.state?.employeeId;



    const [passwords, setPasswords] = useState({

        currentPassword: "",

        newPassword: ""

    });




    function handleChange(event) {


        setPasswords({

            ...passwords,

            [event.target.name]: event.target.value

        });


    }




    async function changePassword() {


        try {


            const response = await api.post(

                "/auth/employee/change-password",

                {

                    employeeId,

                    currentPassword: passwords.currentPassword,

                    newPassword: passwords.newPassword

                }

            );




            console.log(response.data);




            login(

                response.data.user,

                response.data.token

            );




            const role = response.data.user.role;




            if (role === "admin") {


                navigate("/admin/dashboard");


            }



            else if (role === "manager") {


                navigate("/manager/dashboard");


            }



            else if (role === "salesperson") {


                navigate("/sales/dashboard");


            }



        }



        catch (error) {


            console.log(

                error.response?.data?.message

                ||

                "Password change failed"

            );


        }


    }





    return (

        <div>


            <h1>Change Temporary Password</h1>




            <input

                name="currentPassword"

                placeholder="Current Password"

                type="password"

                value={passwords.currentPassword}

                onChange={handleChange}

            />





            <input

                name="newPassword"

                placeholder="New Password"

                type="password"

                value={passwords.newPassword}

                onChange={handleChange}

            />





            <button onClick={changePassword}>


                Change Password


            </button>



        </div>

    );


}



export default ChangePassword;