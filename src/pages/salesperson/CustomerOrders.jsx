function CustomerOrders() {


    const orders = [

        {

            id: "ORD001",

            customer: "ABC Traders",

            product: "Electric Guitar",

            quantity: 10,

            amount: 250000,

            status: "Processing"

        },


        {

            id: "ORD002",

            customer: "XYZ Stores",

            product: "Drum Set",

            quantity: 2,

            amount: 80000,

            status: "Shipped"

        }

    ];





    return (

        <div>


            <h1>Customer Orders</h1>



            {

                orders.map((order) => (


                    <div key={order.id}>


                        <h3>

                            {order.id}

                        </h3>



                        <p>

                            Customer: {order.customer}

                        </p>



                        <p>

                            Product: {order.product}

                        </p>




                        <p>

                            Quantity: {order.quantity}

                        </p>




                        <p>

                            Amount: ₹{order.amount}

                        </p>




                        <p>

                            Status: {order.status}

                        </p>




                        <hr />


                    </div>


                ))

            }




        </div>


    );


}



export default CustomerOrders;