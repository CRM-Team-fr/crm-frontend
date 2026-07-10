import { useState } from "react";



function Inventory() {


    const [items, setItems] = useState([

        {

            id: 1,

            name: "Electric Guitar",

            stock: 10,

            status: "Available"

        },


        {

            id: 2,

            name: "Drum Set",

            stock: 2,

            status: "Low Stock"

        }

    ]);





    function updateStock(id) {


        const updatedItems = items.map(

            (item) => {


                if (item.id === id) {


                    return {

                        ...item,

                        stock: item.stock + 5,

                        status: "Available"

                    };


                }



                return item;


            }

        );




        setItems(updatedItems);


    }








    return (

        <div>


            <h1>Inventory</h1>





            {

                items.map((item) => (



                    <div key={item.id}>


                        <h3>

                            {item.name}

                        </h3>



                        <p>

                            Stock: {item.stock}

                        </p>



                        <p>

                            Status: {item.status}

                        </p>




                        <button

                            onClick={() => updateStock(item.id)}

                        >


                            Add Stock +5


                        </button>



                    </div>


                ))

            }




        </div>

    );


}



export default Inventory;