import { useState } from "react";



function CustomerQueries() {


    const [queries, setQueries] = useState([

        {

            id: 1,

            customer: "ABC Traders",

            message: "When will my order arrive?",

            reply: "",

            status: "Pending"

        },


        {

            id: 2,

            customer: "XYZ Stores",

            message: "Need discount on bulk order",

            reply: "Manager will review your request",

            status: "Answered"

        }

    ]);





    const [reply, setReply] = useState("");





    function sendReply(id) {


        const updatedQueries = queries.map(

            (query) => {


                if (query.id === id) {


                    return {

                        ...query,

                        reply: reply,

                        status: "Answered"

                    };


                }



                return query;


            }


        );




        console.log(
            "Reply sent:",
            reply
        );



        setQueries(updatedQueries);



        setReply("");


    }








    return (

        <div>


            <h1>Customer Queries</h1>




            {

                queries.map((query) => (


                    <div key={query.id}>


                        <h3>

                            {query.customer}

                        </h3>




                        <p>

                            Query: {query.message}

                        </p>




                        <p>

                            Status: {query.status}

                        </p>




                        <p>

                            Reply: {

                                query.reply ||

                                "No reply yet"

                            }

                        </p>




                        {

                            query.status === "Pending"

                            &&


                            <>


                                <input

                                    placeholder="Enter reply"

                                    value={reply}

                                    onChange={(event) =>

                                        setReply(event.target.value)

                                    }

                                />




                                <button

                                    onClick={() =>

                                        sendReply(query.id)

                                    }

                                >

                                    Send Reply

                                </button>


                            </>

                        }



                        <hr />



                    </div>


                ))

            }



        </div>


    );


}



export default CustomerQueries;