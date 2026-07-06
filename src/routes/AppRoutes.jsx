import { Routes, Route } from "react-router-dom";


import UserSelection from "../pages/auth/UserSelection";

import CustomerLogin from "../pages/auth/CustomerLogin";

import CustomerRegister from "../pages/auth/CustomerRegister";

import EmployeeLogin from "../pages/auth/EmployeeLogin";

import OTPVerify from "../pages/auth/OTPVerify";


import CustomerDashboard from "../pages/customer/CustomerDashboard";

import PendingApproval from "../pages/customer/PendingApproval";




function AppRoutes() {


    return (

        <Routes>



            <Route

                path="/"

                element={<UserSelection />}

            />



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



            <Route

                path="/employee/login"

                element={<EmployeeLogin />}

            />



        </Routes>

    );


}



export default AppRoutes;