import { useState } from "react";



function OrderManagement() {


    const [orders, setOrders] = useState([

        {

            id: "ORD001",

            customer: "ABC Traders",

            product: "Electric Guitar",

            quantity: 5,

            amount: 125000,

            status: "Pending"

        },


        {

            id: "ORD002",

            customer: "XYZ Stores",

            product: "Drum Set",

            quantity: 2,

            amount: 80000,

            status: "Processing"

        }

    ]);






    function updateStatus(id, newStatus) {


        const updatedOrders = orders.map(

            (order) => {


                if (order.id === id) {


                    return {

                        ...order,

                        status: newStatus

                    };


                }


                return order;


            }

        );



        setOrders(updatedOrders);


    }








    return (

        <div>


            <h1>Order Management</h1>





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





                        <button

                            onClick={() =>

                                updateStatus(

                                    order.id,

                                    "Processing"

                                )

                            }

                        >


                            Process


                        </button>





                        <button

                            onClick={() =>

                                updateStatus(

                                    order.id,

                                    "Shipped"

                                )

                            }

                        >


                            Ship


                        </button>





                    </div>


                ))

            }




        </div>


    );


}




export default OrderManagement;