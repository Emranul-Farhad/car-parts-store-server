const express = require('express')
const app = express()
const port = process.env.PORT || 8000
var cors = require('cors')
require('dotenv').config()
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId, Admin } = require('mongodb');

// cors midelware / express midelware
app.use(cors())
app.use(express.json())


// mpongodb cluster data


const uri = `mongodb+srv://${process.env.APAR_MOTORS}:${process.env.APAR_KEY}@cluster0.n9qny.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// verify jwt midelware

const verrifyjwt = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(403).send({ Message: "unathorized access" })
    }
    const token = auth.split(" ")[1]
    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: "forbidden access" })
        }
        console.log("decoded", decoded);
        req.decoded = decoded
    })

    next()
}



async function run() {

    try {
        // mongodb collection
        await client.connect()
        const usercollection = client.db("customer").collection("users");
        const allproducts = client.db("products").collection("All products");
        const ordersproducts = client.db("Allorder").collection("order");
        const reviewscollection = client.db("Reviews").collection("Review");


        // all products section wotking below

        // products get api
        app.get('/products', async (req, res) => {
            const myproducts = await allproducts.find().toArray()
            res.send(myproducts)
        })

        // id wise infromation get for checkout page
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;;
            const query = { _id: ObjectId(id) }
            const idwiseonformation = await allproducts.findOne(query)
            res.send(idwiseonformation)
        })

        //   orders store in db
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            console.log(orders)
            const orderget = await ordersproducts.insertOne(orders)
            res.send(orderget)
        })

        // orders get from db email wise user 
        app.get('/orders', verrifyjwt, async (req, res) => {
            const email = req.query.email
            const decoded = req.decoded.email;
            if (email === decoded) {
                const query = { email: email }
                console.log(query);
                const myorders = await ordersproducts.find(query).toArray()
                res.send(myorders)
            }
            else {
                return res.status(403).send({ message: "foirbidden access" })
            }

        })






        // app.post('/doctors', verrifyjwt, verifyadmin, async(req,res)=> {
        //     const doctors = req.body;
        //     console.log(req.body)
        //     const getinfo = await doctorsformation.insertOne(doctors)
        //     res.send(getinfo)
        //   })






        // all user secyion working blow

        //  user collection make heree
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
        
            const info = req.body;
            const filter = { email: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: info
            };
            const updateuser = await usercollection.updateOne(filter, updateDoc, options)
            const token = jwt.sign({ email: email }, process.env.JWT_KEY, { expiresIn: '2d' });
            res.send({ updateuser, token })
        })

        //  user collection get fromdb
        app.get('/users', async (req, res) => {
            const users = await usercollection.find().toArray()
            res.send(users)
        })

        // admin make api creation
        app.put('/users/admin/:email',   verrifyjwt, async(req, res) => {
            const email = req.params.email;
            const requester = req.decoded.email ;
            const adminsrequester = await usercollection.findOne({email : requester})
            if (adminsrequester.role === "admin" ){
                const filter = { email: email}
                const updateDoc = {
                    $set: { role: "admin" }
                }
                const makeuser = await usercollection.updateOne(filter , updateDoc)
                res.send(makeuser)
            }
           else {
               return res.status(403).send({message: "unaucthorized access"})
           }
        })

        // admin privatre route only admin can access this api's route
        app.get('/users/:email', async(req,res)=> {
            const email = req.params.email ;
            console.log(email, "admin check");
            const checkemail = await usercollection.findOne({email : email})
            const aftercheck = checkemail.role === 'admin'
            res.send({admin : aftercheck})
        } )

        // review api make
        app.post('/reviews', async(req,res)=> {
            const reviews = req.body ;
            console.log(reviews, "reviews got from here");
            const reviewcollections = await  reviewscollection.insertOne(reviews)
            res.send(reviewcollections)
        } )

        // get review api from data base
        app.get('/reviews', async(req,res)=> {
            const getreviews = await reviewscollection.find().toArray()
            res.send(getreviews)
        } )


        






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