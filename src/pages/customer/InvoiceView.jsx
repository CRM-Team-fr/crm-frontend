function InvoiceView() {


    const invoices = [

        {

            id: "INV001",

            orderId: "ORD001",

            product: "Electric Guitar",

            amount: 250000,

            date: "10 July 2026",

            status: "Paid"

        },


        {

            id: "INV002",

            orderId: "ORD002",

            product: "Drum Set",

            amount: 80000,

            date: "12 July 2026",

            status: "Pending"

        }

    ];





    return (

        <div>


            <h1>Invoices</h1>





            {

                invoices.map((invoice) => (


                    <div key={invoice.id}>


                        <h3>

                            {invoice.id}

                        </h3>



                        <p>

                            Order: {invoice.orderId}

                        </p>



                        <p>

                            Product: {invoice.product}

                        </p>



                        <p>

                            Amount: ₹{invoice.amount}

                        </p>



                        <p>

                            Date: {invoice.date}

                        </p>



                        <p>

                            Status: {invoice.status}

                        </p>




                        <button

                            onClick={() =>

                                console.log(
                                    "Download invoice:",
                                    invoice.id
                                )

                            }

                        >

                            Download Invoice

                        </button>




                    </div>


                ))

            }



        </div>


    );


}



export default InvoiceView;