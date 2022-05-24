const express = require('express')
const app = express()
const port = process.env.PORT || 8000
var cors = require('cors')
require('dotenv').config()

// cors midelware / express midelware
app.use(cors())
app.use(express.json())


// mpongodb cluster data

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.APAR_MOTORS}:${process.env.APAR_KEY}@cluster0.n9qny.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try {

        // mongodb collection
        await client.connect()
        const collection = client.db("customer").collection("users");

         


    }
    catch {

    }
}

run().catch(console.dir);




// mpongo db collection test
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log("connect from here");
//   client.close();
// });





// express ap hello world
app.get('/', (req, res) => {
    res.send('Hello kecha up logg late hua kew')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})