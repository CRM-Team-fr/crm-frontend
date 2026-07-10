import { Routes, Route } from "react-router-dom";


// Auth Pages

import UserSelection from "../pages/auth/UserSelection";
import CustomerLogin from "../pages/auth/CustomerLogin";
import CustomerRegister from "../pages/auth/CustomerRegister";
import EmployeeLogin from "../pages/auth/EmployeeLogin";
import OTPVerify from "../pages/auth/OTPVerify";
import ChangePassword from "../pages/auth/ChangePassword";



// Customer Pages

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import PendingApproval from "../pages/customer/PendingApproval";



// Admin Pages

import AdminDashboard from "../pages/admin/AdminDashboard";
import PendingCustomers from "../pages/admin/PendingCustomers";
import AssignSalesperson from "../pages/admin/AssignSalesperson";
import CustomerList from "../pages/admin/CustomerList";
import EmployeeManagement from "../pages/admin/EmployeeManagement";



// Manager Pages

import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ProductManagement from "../pages/manager/ProductManagement";
import Inventory from "../pages/manager/Inventory";
import OrderManagement from "../pages/manager/OrderManagement";



// Salesperson Pages

import SalesDashboard from "../pages/salesperson/SalesDashboard";



// Protected Route

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

                path="/customer/dashboard"

                element={<CustomerDashboard />}

            />



            <Route

                path="/customer/pending-approval"

                element={<PendingApproval />}

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




        </Routes>


    );


}



export default AppRoutes;