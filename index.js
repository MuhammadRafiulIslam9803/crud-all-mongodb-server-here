const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/' , (req ,res) =>{
    res.send('hello guys welcome to my server');
})

const uri = "mongodb+srv://rafiulislam1998:GJPhh74xJ1o2ruEU@cluster0.vivchso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
  
      const userCollection = client.db('nodeMongoCrud').collection('users')
      
      //create

      app.post('/users' , async(req ,res)=>{
        const user = req.body;
        const result= await userCollection.insertOne(user)
        res.send(result)
      })
      
      //read

      app.get('/users' ,async(req , res) =>{
        const query = {};
        const cursor = userCollection.find(query);
        const users = await cursor.toArray()
        res.send(users)
      })
      
      //delete 

     app.delete('/users/:id' , async(req ,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result);
      // console.log(id)
     })

    //  update

    //dynamic id nia astehbe tar por setake update kora lagbe
    app.get('/users/:id' , async(req ,res)=>{
      const id =req.params.id;
      const query = {_id : new ObjectId(id)}
      const user = await userCollection.findOne(query)
      res.send(user)
    })

    //je id ta niye asce oitake update korbo ekon

    app.put('/users/:id' ,async(req ,res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const user = req.body;
      const option = {upsert : true}
      const updateUser ={
        $set :{
          name : user.name,
          address : user.address,
          email : user.email
        }
      }
      const result = await userCollection.updateOne(filter , updateUser ,option)
      res.send(result)
    })
  
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);

app.listen(port , ()=>{
    console.log(`listening port : ${port}`);
})