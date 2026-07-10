import { useState } from "react";



function ProductManagement() {


    const [products, setProducts] = useState([

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

    ]);





    const [newProduct, setNewProduct] = useState({

        name: "",

        price: "",

        stock: "",

        description: ""

    });





    function handleChange(event) {


        setNewProduct({

            ...newProduct,

            [event.target.name]: event.target.value

        });


    }






    function addProduct() {


        console.log(

            "Product sent to backend:",

            newProduct

        );



        setProducts([

            ...products,

            {

                id: Date.now(),

                ...newProduct

            }

        ]);




        setNewProduct({

            name: "",

            price: "",

            stock: "",

            description: ""

        });


    }






    return (

        <div>


            <h1>Product Management</h1>





            <h2>Add Product</h2>




            <input

                name="name"

                placeholder="Product Name"

                value={newProduct.name}

                onChange={handleChange}

            />




            <input

                name="price"

                placeholder="Price"

                value={newProduct.price}

                onChange={handleChange}

            />




            <input

                name="stock"

                placeholder="Stock"

                value={newProduct.stock}

                onChange={handleChange}

            />




            <input

                name="description"

                placeholder="Description"

                value={newProduct.description}

                onChange={handleChange}

            />





            <button onClick={addProduct}>


                Add Product


            </button>






            <hr />






            <h2>Products</h2>




            {

                products.map((product) => (


                    <div key={product.id}>


                        <h3>

                            {product.name}

                        </h3>



                        <p>

                            ₹{product.price}

                        </p>



                        <p>

                            Stock: {product.stock}

                        </p>



                        <p>

                            {product.description}

                        </p>


                    </div>


                ))

            }





        </div>

    );


}



export default ProductManagement;