import { useContext } from "react";

import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";



function ProtectedRoute({ children, allowedRole }) {


    const { user } = useContext(AuthContext);



    console.log("========== ROUTE CHECK ==========");

    console.log("Current user:", user);

    console.log("Required role:", allowedRole);

    console.log("===============================");




    if (!user) {


        console.log("BLOCKED: No user found");


        return <Navigate to="/" />;


    }




    if (user.role !== allowedRole) {


        console.log("BLOCKED: Role mismatch");


        return <Navigate to="/" />;


    }




    console.log("ACCESS ALLOWED");



    return children;


}



export default ProtectedRoute;