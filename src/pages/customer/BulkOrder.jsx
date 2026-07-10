import { useState } from "react";

import { useLocation } from "react-router-dom";



function BulkOrder() {


    const location = useLocation();


    const product = location.state?.product;




    const [quantity, setQuantity] = useState("");




    function placeOrder() {


        const order = {


            productId: product.id,

            productName: product.name,

            quantity: quantity,

            totalAmount: product.price * quantity,

            status: "Pending"

        };



        console.log(

            "Order sent to backend:",

            order

        );


        alert("Order Placed Successfully");


    }








    return (

        <div>


            <h1>Place Bulk Order</h1>




            <h2>

                {product?.name}

            </h2>




            <p>

                Price: ₹{product?.price}

            </p>




            <input

                placeholder="Enter Quantity"

                value={quantity}

                onChange={(event) =>

                    setQuantity(event.target.value)

                }

            />




            <br />

            <br />




            <button onClick={placeOrder}>


                Place Order


            </button>




        </div>


    );


}




export default BulkOrder;