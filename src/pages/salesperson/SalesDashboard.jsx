import { useNavigate } from "react-router-dom";



function SalesDashboard() {


    const navigate = useNavigate();



    return (

        <div>


            <h1>Salesperson Dashboard</h1>




            <button onClick={() => navigate("/sales/customers")}>

                Assigned Customers

            </button>




            <br /><br />




            <button onClick={() => navigate("/sales/queries")}>

                Customer Queries

            </button>




            <br /><br />




            <button onClick={() => navigate("/sales/orders")}>

                Customer Orders

            </button>




        </div>

    );


}



export default SalesDashboard;