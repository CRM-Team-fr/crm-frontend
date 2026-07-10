function OrderStatus() {


    const orders = [

        {

            id: "ORD001",

            productName: "Electric Guitar",

            quantity: 10,

            amount: 250000,

            status: "Processing"

        },


        {

            id: "ORD002",

            productName: "Drum Set",

            quantity: 2,

            amount: 80000,

            status: "Shipped"

        }

    ];





    return (

        <div>


            <h1>My Orders</h1>



            {


                orders.map((order) => (


                    <div key={order.id}>


                        <h3>

                            {order.id}

                        </h3>



                        <p>

                            Product: {order.productName}

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



                    </div>


                ))

            }




        </div>

    );


}



export default OrderStatus;