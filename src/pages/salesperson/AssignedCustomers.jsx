function AssignedCustomers() {


    const customers = [

        {

            id: "688f001",

            Name: "Rahul Gupta",

            businessName: "ABC Traders",

            phoneNumber: "9876543210",

            address: "Punjab"

        },


        {

            id: "688f002",

            Name: "Amit Sharma",

            businessName: "XYZ Stores",

            phoneNumber: "9876543211",

            address: "Delhi"

        }

    ];





    return (

        <div>


            <h1>Assigned Customers</h1>



            {

                customers.map((customer) => (


                    <div key={customer.id}>


                        <h3>

                            {customer.businessName}

                        </h3>


                        <p>

                            Owner: {customer.Name}

                        </p>


                        <p>

                            Phone: {customer.phoneNumber}

                        </p>


                        <p>

                            Address: {customer.address}

                        </p>


                    </div>


                ))

            }


        </div>

    );


}



export default AssignedCustomers;