import { useNavigate } from "react-router-dom";



function AdminDashboard() {


    const navigate = useNavigate();




    return (

        <div>


            <h1>Admin Dashboard</h1>




            <button

                onClick={() => navigate("/admin/pending-customers")}

            >

                Pending Customer Approvals

            </button>





            <br />

            <br />





            <button

                onClick={() => navigate("/admin/customers")}

            >

                All Customers

            </button>






            <br />

            <br />






            <button

                onClick={() => navigate("/admin/employees")}

            >

                Employee Management

            </button>





        </div>


    );


}



export default AdminDashboard;