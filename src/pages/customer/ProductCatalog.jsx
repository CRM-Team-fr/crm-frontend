import { useNavigate } from "react-router-dom";



function ProductCatalog() {


    const navigate = useNavigate();



    const products = [

        {

            id: 1,

            name: "Electric Guitar",

            price: 25000,

            stock: 10,

            description: "Premium electric guitar"

        },


        {

            id: 2,

            name: "Drum Set",

            price: 40000,

            stock: 5,

            description: "Professional drum kit"

        }

    ];






    function orderProduct(product) {


        navigate(

            "/customer/order",

            {

                state: {

                    product: product

                }

            }

        );


    }








    return (

        <div>


            <h1>Product Catalog</h1>





            {


                products.map((product) => (



                    <div key={product.id}>


                        <h3>

                            {product.name}

                        </h3>



                        <p>

                            {product.description}

                        </p>




                        <p>

                            Price: ₹{product.price}

                        </p>




                        <p>

                            Available Stock: {product.stock}

                        </p>




                        <button

                            onClick={() => orderProduct(product)}

                        >


                            Order


                        </button>



                    </div>


                ))

            }



        </div>


    );


}




export default ProductCatalog;