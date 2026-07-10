import { useState } from "react";



function QueryPage() {


    const [queries, setQueries] = useState([

        {

            id: 1,

            message: "Need delivery update for ORD001",

            reply: "Your order will be delivered soon.",

            status: "Answered"

        }

    ]);




    const [message, setMessage] = useState("");




    function sendQuery() {


        const newQuery = {

            id: Date.now(),

            message: message,

            reply: "",

            status: "Pending"

        };



        console.log(

            "Query sent to salesperson:",

            newQuery

        );




        setQueries([

            ...queries,

            newQuery

        ]);



        setMessage("");


    }







    return (

        <div>


            <h1>Customer Queries</h1>




            <textarea

                placeholder="Enter your query"

                value={message}

                onChange={(event) =>

                    setMessage(event.target.value)

                }

            />




            <br />



            <button onClick={sendQuery}>


                Send Query


            </button>





            <hr />





            <h2>Previous Queries</h2>





            {

                queries.map((query) => (


                    <div key={query.id}>


                        <p>

                            Query: {query.message}

                        </p>



                        <p>

                            Status: {query.status}

                        </p>




                        <p>

                            Reply:

                            {" "}

                            {

                                query.reply ||

                                "Waiting for salesperson"

                            }

                        </p>



                    </div>


                ))

            }





        </div>

    );


}




export default QueryPage;