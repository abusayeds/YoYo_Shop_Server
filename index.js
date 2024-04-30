const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId,  } = require('mongodb');
// yoyo-shop-server
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("YoYo shop server in raning ")
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@atlascluster.pwovdtc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });
  async function run() {
    try {
        const productCollection = client.db('shop').collection('products')
        const Collection = client.db('shop').collection('collection')
        app.get('/prodectcollection/:category',async (req, res) => {
            const requesID = req.params.category;
            const id = { category:requesID};
            const data = await productCollection.find(id).toArray()
            res.send(data)
        })
         app.get('/count', async(req,res) => {
            const query = {}
            const data = productCollection.find(query)
            const products = await data.toArray()
            res.send(products)
         })
        app.get('/products', async(req ,res) =>{
            const page = req.query.page;
            const size = parseInt(req.query.size);
            // console.log(page, size );
            const query = {}
            const data =  productCollection.find(query)
            const products = await data.skip(page*size).limit(size). toArray()
            res.send(products)
        })
        app.get('/products/:id', async (req, res) => {
            const requestID = req.params.id;
            const id = {_id: new ObjectId(requestID)}
            const data = await productCollection.findOne(id)
            res.send(data)

        })
      

        app.put('/products/:id', async (req, res) => {
            const requestID = req.params.id;
            const id = {_id: new ObjectId(requestID)}
            const data = req.body;
            const  options = {upsert : true}
            const dataDoc = {
                $set: {
                    name:data.name,
                    price:data.price,
                    quantity:data.quantity,
                    image:data.image,
                    category:data.category,                  
                },
               
            }
            const result = await productCollection.updateOne(id,dataDoc,options)
             res.send(result)
        })
        app.delete('/products/:id', async(req,res) => {
           const requesID = req.params.id;
           const id = {_id: new ObjectId(requesID)}
           const result = await productCollection.deleteOne(id)
           res.send(result)
        })
        app.post('/products', async(req,res) =>{
            const data =req.body;
            const query = await productCollection.insertOne(data)
            res.send(query)
            })
    // collection
    app.post('/collection', async (req, res) => {
         const data = req.body
         const query = await Collection.insertOne(data)
         res.send(query)
    })
    app.get('/collection', async(req ,res) =>{
        const query = {}
        const data =  Collection.find(query)
        const products = await data.toArray()
        res.send(products)
    })
    app.get('/collection/:id',async (req, res) => {
        const requesID = req.params.id;
        const id = {_id: new ObjectId(requesID)};
        const data = await Collection.findOne(id)
        res.send(data)        
    })
    app.put('/collection/:id', async (req, res) => {
        const requestID = req.params.id;
        const id = {_id: new ObjectId(requestID)}
        const data = req.body;
        const  options = {upsert : true}
        const dataDoc = {
            $set: {
                name:data.name,
                category:data.category,                  
            },
           
        }
        const result = await Collection.updateOne(id,dataDoc,options)
         res.send(result)
    })
    app.delete('/collection/:id', async (req,res) =>{
        const requesID = req.params.id;
        const id = {_id: new ObjectId(requesID)}
        const result = await Collection.deleteOne(id)
        res.send(result);
    })
   
    }
    finally {

    }


}

run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`yoyo server raning on port ${port}`)
})
        