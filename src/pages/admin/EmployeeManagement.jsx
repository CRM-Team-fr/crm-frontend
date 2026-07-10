import { useState } from "react";


function EmployeeManagement() {


    const [employees, setEmployees] = useState([

        {

            id: "688f001",

            Name: "Rahul Sharma",

            email: "rahul@crm.com",

            phoneNumber: "9876543211",

            role: "salesperson"

        },


        {

            id: "688f002",

            Name: "Aman Verma",

            email: "aman@crm.com",

            phoneNumber: "9876543212",

            role: "manager"

        }

    ]);





    const [newEmployee, setNewEmployee] = useState({

        Name: "",

        email: "",

        phoneNumber: "",

        role: ""

    });





    function handleChange(event) {


        setNewEmployee({

            ...newEmployee,

            [event.target.name]: event.target.value

        });


    }






    function createEmployee() {


        console.log(

            "Employee sent to backend:",

            newEmployee

        );



        setEmployees([

            ...employees,

            {

                id: Date.now(),

                ...newEmployee

            }

        ]);





        setNewEmployee({

            Name: "",

            email: "",

            phoneNumber: "",

            role: ""

        });


    }








    return (

        <div>


            <h1>Employee Management</h1>





            <h2>Create Employee</h2>




            <input

                name="Name"

                placeholder="Name"

                value={newEmployee.Name}

                onChange={handleChange}

            />




            <input

                name="email"

                placeholder="Email"

                value={newEmployee.email}

                onChange={handleChange}

            />





            <input

                name="phoneNumber"

                placeholder="Phone Number"

                value={newEmployee.phoneNumber}

                onChange={handleChange}

            />





            <select

                name="role"

                value={newEmployee.role}

                onChange={handleChange}

            >


                <option value="">

                    Select Role

                </option>


                <option value="manager">

                    Manager

                </option>



                <option value="salesperson">

                    Salesperson

                </option>



            </select>





            <br />

            <br />




            <button onClick={createEmployee}>


                Create Employee


            </button>





            <hr />





            <h2>Employees</h2>





            {


                employees.map((employee) => (



                    <div key={employee.id}>


                        <h3>

                            {employee.Name}

                        </h3>



                        <p>

                            Email: {employee.email}

                        </p>



                        <p>

                            Phone: {employee.phoneNumber}

                        </p>



                        <p>

                            Role: {employee.role}

                        </p>



                    </div>


                ))


            }




        </div>


    );


}




export default EmployeeManagement;