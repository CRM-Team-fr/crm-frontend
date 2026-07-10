import { useNavigate } from "react-router-dom";



function PendingCustomers() {


    const navigate = useNavigate();




    const customers = [

        {

            id: 1,

            businessName: "ABC Traders",

            ownerName: "Rahul",

            phone: "9999999999"

        },



        {

            id: 2,

            businessName: "XYZ Stores",

            ownerName: "Amit",

            phone: "8888888888"

        }

    ];





    function approveCustomer(customer) {



        navigate(

            "/admin/assign-salesperson",

            {

                state: {

                    customer: customer

                }

            }

        );


    }





    function rejectCustomer(customer) {


        console.log(

            "Rejected:",

            customer

        );


    }







    return (

        <div>


            <h1>Pending Customer Approvals</h1>




            {

                customers.map(

                    (customer) => (



                        <div key={customer.id}>


                            <h3>

                                {customer.businessName}

                            </h3>



                            <p>

                                Owner: {customer.ownerName}

                            </p>




                            <p>

                                Phone: {customer.phone}

                            </p>




                            <button

                                onClick={() =>

                                    approveCustomer(customer)

                                }

                            >


                                Approve


                            </button>




                            <button

                                onClick={() =>

                                    rejectCustomer(customer)

                                }

                            >


                                Reject


                            </button>




                        </div>


                    )

                )

            }




        </div>

    );


}




export default PendingCustomers;