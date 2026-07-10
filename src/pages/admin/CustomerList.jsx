function CustomerList() {


    const customers = [

        {

            id: 1,

            businessName: "ABC Traders",

            ownerName: "Rahul",

            phone: "9999999999",

            status: "Approved",

            salesperson: "Rahul Sharma"

        },


        {

            id: 2,

            businessName: "XYZ Stores",

            ownerName: "Amit",

            phone: "8888888888",

            status: "Approved",

            salesperson: "Aman Verma"

        }

    ];





    return (

        <div>


            <h1>All Customers</h1>



            {

                customers.map((customer) => (


                    <div key={customer.id}>


                        <h2>

                            {customer.businessName}

                        </h2>


                        <p>

                            Owner: {customer.ownerName}

                        </p>


                        <p>

                            Phone: {customer.phone}

                        </p>


                        <p>

                            Status: {customer.status}

                        </p>


                        <p>

                            Assigned Salesperson: {customer.salesperson}

                        </p>


                        <hr />


                    </div>


                ))

            }


        </div>

    );


}



export default CustomerList;