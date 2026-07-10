import { Routes, Route } from "react-router-dom";


// Auth

import UserSelection from "../pages/auth/UserSelection";
import CustomerLogin from "../pages/auth/CustomerLogin";
import CustomerRegister from "../pages/auth/CustomerRegister";
import EmployeeLogin from "../pages/auth/EmployeeLogin";
import OTPVerify from "../pages/auth/OTPVerify";
import ChangePassword from "../pages/auth/ChangePassword";



// Customer

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import PendingApproval from "../pages/customer/PendingApproval";
import ProductCatalog from "../pages/customer/ProductCatalog";
import BulkOrder from "../pages/customer/BulkOrder";
import OrderStatus from "../pages/customer/OrderStatus";
import InvoiceView from "../pages/customer/InvoiceView";
import QueryPage from "../pages/customer/QueryPage";



// Admin

import AdminDashboard from "../pages/admin/AdminDashboard";
import PendingCustomers from "../pages/admin/PendingCustomers";
import AssignSalesperson from "../pages/admin/AssignSalesperson";
import CustomerList from "../pages/admin/CustomerList";
import EmployeeManagement from "../pages/admin/EmployeeManagement";



// Manager

import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ProductManagement from "../pages/manager/ProductManagement";
import Inventory from "../pages/manager/Inventory";
import OrderManagement from "../pages/manager/OrderManagement";



// Salesperson

import SalesDashboard from "../pages/salesperson/SalesDashboard";
import AssignedCustomers from "../pages/salesperson/AssignedCustomers";
import CustomerQueries from "../pages/salesperson/CustomerQueries";
import CustomerOrders from "../pages/salesperson/CustomerOrders";



// Protected

import ProtectedRoute from "./ProtectedRoute";





function AppRoutes() {


    return (

        <Routes>



            {/* HOME */}

            <Route 
                path="/" 
                element={<UserSelection />} 
            />






            {/* CUSTOMER */}


            <Route 
                path="/customer/login" 
                element={<CustomerLogin />} 
            />


            <Route 
                path="/customer/register" 
                element={<CustomerRegister />} 
            />


            <Route 
                path="/customer/verify-otp" 
                element={<OTPVerify />} 
            />


            <Route 
                path="/customer/pending-approval" 
                element={<PendingApproval />} 
            />


            <Route 
                path="/customer/dashboard" 
                element={<CustomerDashboard />} 
            />


            <Route 
                path="/customer/products" 
                element={<ProductCatalog />} 
            />


            <Route 
                path="/customer/order" 
                element={<BulkOrder />} 
            />


            <Route 
                path="/customer/orders" 
                element={<OrderStatus />} 
            />


            <Route 
                path="/customer/invoices" 
                element={<InvoiceView />} 
            />


            <Route 
                path="/customer/queries" 
                element={<QueryPage />} 
            />








            {/* EMPLOYEE AUTH */}


            <Route 
                path="/employee/login" 
                element={<EmployeeLogin />} 
            />


            <Route 
                path="/employee/change-password" 
                element={<ChangePassword />} 
            />








            {/* ADMIN */}


            <Route 
                path="/admin/dashboard"

                element={

                    <ProtectedRoute allowedRole="admin">

                        <AdminDashboard />

                    </ProtectedRoute>

                }

            />



            <Route 
                path="/admin/pending-customers"

                element={

                    <ProtectedRoute allowedRole="admin">

                        <PendingCustomers />

                    </ProtectedRoute>

                }

            />



            <Route 
                path="/admin/assign-salesperson"

                element={

                    <ProtectedRoute allowedRole="admin">

                        <AssignSalesperson />

                    </ProtectedRoute>

                }

            />



            <Route 
                path="/admin/customers"

                element={

                    <ProtectedRoute allowedRole="admin">

                        <CustomerList />

                    </ProtectedRoute>

                }

            />



            <Route 
                path="/admin/employees"

                element={

                    <ProtectedRoute allowedRole="admin">

                        <EmployeeManagement />

                    </ProtectedRoute>

                }

            />









            {/* MANAGER */}


            <Route 
                path="/manager/dashboard"

                element={

                    <ProtectedRoute allowedRole="manager">

                        <ManagerDashboard />

                    </ProtectedRoute>

                }

            />



            <Route 
                path="/manager/products"

                element={

                    <ProtectedRoute allowedRole="manager">

                        <ProductManagement />

                    </ProtectedRoute>

                }

            />



            <Route 
                path="/manager/inventory"

                element={

                    <ProtectedRoute allowedRole="manager">

                        <Inventory />

                    </ProtectedRoute>

                }

            />



            <Route 
                path="/manager/orders"

                element={

                    <ProtectedRoute allowedRole="manager">

                        <OrderManagement />

                    </ProtectedRoute>

                }

            />










            {/* SALESPERSON */}


            <Route

                path="/sales/dashboard"

                element={

                    <ProtectedRoute allowedRole="salesperson">

                        <SalesDashboard />

                    </ProtectedRoute>

                }

            />




            <Route

                path="/sales/customers"

                element={

                    <ProtectedRoute allowedRole="salesperson">

                        <AssignedCustomers />

                    </ProtectedRoute>

                }

            />




            <Route

                path="/sales/queries"

                element={

                    <ProtectedRoute allowedRole="salesperson">

                        <CustomerQueries />

                    </ProtectedRoute>

                }

            />





            <Route

                path="/sales/orders"

                element={

                    <ProtectedRoute allowedRole="salesperson">

                        <CustomerOrders />

                    </ProtectedRoute>

                }

            />




        </Routes>

    );


}



export default AppRoutes;