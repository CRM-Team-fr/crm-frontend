import { useNavigate } from "react-router-dom";



function CustomerDashboard() {


    const navigate = useNavigate();




    return (

        <div>


            <h1>Customer Dashboard</h1>




            <button onClick={() => navigate("/customer/products")}>

                Product Catalog

            </button>




            <br /><br />




            <button onClick={() => navigate("/customer/orders")}>

                My Orders

            </button>




            <br /><br />




            <button onClick={() => navigate("/customer/invoices")}>

                Invoices

            </button>




            <br /><br />





            <button onClick={() => navigate("/customer/queries")}>

                Queries

            </button>





        </div>

    );


}



export default CustomerDashboard;