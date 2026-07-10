import { useNavigate } from "react-router-dom";



function ManagerDashboard() {


    const navigate = useNavigate();



    return (

        <div>


            <h1>Manager Dashboard</h1>




            <button onClick={() => navigate("/manager/products")}>

                Product Management

            </button>



            <br />

            <br />




            <button onClick={() => navigate("/manager/inventory")}>

                Inventory

            </button>




            <br />

            <br />




            <button onClick={() => navigate("/manager/orders")}>

                Orders

            </button>




        </div>

    );


}



export default ManagerDashboard;