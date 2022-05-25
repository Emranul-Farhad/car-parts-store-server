const express = require('express')
const app = express()
const port = process.env.PORT || 8000
var cors = require('cors')
require('dotenv').config()
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// cors midelware / express midelware
app.use(cors())
app.use(express.json())


// mpongodb cluster data


const uri = `mongodb+srv://${process.env.APAR_MOTORS}:${process.env.APAR_KEY}@cluster0.n9qny.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try {
        // mongodb collection
        await client.connect()
        const usercollection = client.db("customer").collection("users");
        const allproducts = client.db("products").collection("All products");
        const ordersproducts = client.db("Allorder").collection("order");
         
  
    // all products section wotking below

        // products get api
        app.get('/products' , async(req,res)=> {
            const myproducts = await allproducts.find().toArray()
            res.send(myproducts)
        } )

        // id wise infromation get for checkout page
        app.get('/products/:id',  async(req,res)=> {
            const id = req.params.id;   ;
            const query = {_id : ObjectId(id)}
            const idwiseonformation = await allproducts.findOne(query)
            res.send(idwiseonformation)
          })

        //   orders store in db
        app.post('/orders' , async(req,res)=> {
            const orders = req.body;
            console.log(orders)
            const orderget = await ordersproducts.insertOne(orders)
            res.send(orderget)
        } )

        // orders grt from db
        app.get('/orders' , async(req,res)=> {
        const email = req.query.email 
        console.log(email);
        const query = {email:email}
        console.log(query);
        const myorders = await ordersproducts.find(query).toArray()
            res.send(myorders)
        })

       




        // app.post('/doctors', verrifyjwt, verifyadmin, async(req,res)=> {
        //     const doctors = req.body;
        //     console.log(req.body)
        //     const getinfo = await doctorsformation.insertOne(doctors)
        //     res.send(getinfo)
        //   })






        // all user secyion working blow

        //  user collection make heree
        app.put('/users/:email', async(req,res)=> {
            const email = req.params.email;
            console.log(email);
            const info = req.body ;
            const filter = {email : email}
            const options = { upsert: true };
            const updateDoc = {
                $set:  info  
              };
              const updateuser = await usercollection.updateOne(filter, updateDoc, options)
              const token = jwt.sign({email : email },  process.env.JWT_KEY );
              res.send({updateuser, token })
        })

        //  user collection get fromdb
        app.get('/users' , async(req,res)=> {
            const users = await usercollection.find().toArray()
            res.send(users)
        } )
 

        // admin make api creation
         



    }

    // catch start from here
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