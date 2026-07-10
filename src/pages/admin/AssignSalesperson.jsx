import { useState } from "react";

import { useLocation } from "react-router-dom";



function AssignSalesperson() {


    const location = useLocation();


    const customer = location.state?.customer;



    const [selectedSalesperson, setSelectedSalesperson] = useState("");



    const salespersons = [

        {
            id: 1,
            name: "Rahul Sharma"
        },

        {
            id: 2,
            name: "Aman Verma"
        }

    ];




    function assignSalesperson() {


        console.log("Customer:", customer);


        console.log(
            "Assigned Salesperson:",
            selectedSalesperson
        );


    }






    return (

        <div>


            <h1>Assign Salesperson</h1>




            <h3>

                Customer:

                {" "}

                {customer?.businessName}

            </h3>




            <select

                value={selectedSalesperson}

                onChange={(event) =>
                    setSelectedSalesperson(event.target.value)
                }

            >


                <option value="">

                    Select Salesperson

                </option>




                {

                    salespersons.map(

                        (salesperson) => (


                            <option

                                key={salesperson.id}

                                value={salesperson.name}

                            >


                                {salesperson.name}


                            </option>


                        )

                    )

                }


            </select>





            <br />

            <br />





            <button onClick={assignSalesperson}>


                Assign


            </button>




        </div>


    );


}



export default AssignSalesperson;