import { createContext, useState } from "react";


export const AuthContext = createContext();



function AuthProvider({ children }) {



    const savedUser = localStorage.getItem("user");



    const [user, setUser] = useState(

        savedUser

            ? JSON.parse(savedUser)

            : null

    );




    function login(userData, token) {


        setUser(userData);



        localStorage.setItem(

            "user",

            JSON.stringify(userData)

        );



        localStorage.setItem(

            "token",

            token

        );


    }





    function logout() {


        setUser(null);



        localStorage.removeItem("user");


        localStorage.removeItem("token");


    }





    return (

        <AuthContext.Provider

            value={{

                user,

                login,

                logout

            }}

        >


            {children}


        </AuthContext.Provider>

    );


}



export default AuthProvider;