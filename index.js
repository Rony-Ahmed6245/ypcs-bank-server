const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
const { ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

// mongodb code here ===============================

const uri = "mongodb+srv://ypcsbank:O9QUUWpc1kHRS9SU@cluster0.eehyjj4.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });


    // operation start ====>
    const userBankAccountCollection = client.db("ypcsBankDB").collection("userBankAccounts");
    const amountCollection = client.db("ypcsBankDB").collection("userAmounts");

    //user bank account  data post operation
    app.post("/v1/userBankAccount", async (req, res) => {
      const userAccount = req.body;
      //   console.log(user);
      const result = await userBankAccountCollection.insertOne(userAccount);
      console.log(result);
      res.send(result);
    });
    app.post("/v1/userAmounts", async (req, res) => {
      const amount = req.body;
      //   console.log(user);
      const result = await amountCollection.insertOne(amount);
      console.log(result);
      res.send(result);
    });

    // get data 
    app.get("/v1/userBankAccounts", async (req, res) => {
      try {
        const result = await userBankAccountCollection.find().toArray();
        console.log(result);
        res.send(result);
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
    });
    // get data 
    app.get("/v1/userAmounts", async (req, res) => {
      try {
        const result = await amountCollection.find().toArray();
        console.log(result);
        res.send(result);
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
    });

    // Delete user by ID
    // delete operation 
    app.delete("/v1/userBankAccounts/:id", async (req, res) => {
      const mealId = req.params.id;

      try {
        const result = await userBankAccountCollection.deleteOne({ _id: new ObjectId(mealId) });

        if (result.deletedCount === 1) {
          res.json({ success: true, message: "acc deleted successfully." });
        } else {
          res.status(404).json({ success: false, message: "acc not found." });
        }
      } catch (error) {
        console.error('Error deleting meal:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    });
    // delete operation 
    app.delete("/v1/userAmounts/:id", async (req, res) => {
      const mealId = req.params.id;

      try {
        const result = await amountCollection.deleteOne({ _id: new ObjectId(mealId) });

        if (result.deletedCount === 1) {
          res.json({ success: true, message: "payment deleted successfully." });
        } else {
          res.status(404).json({ success: false, message: "payment not found." });
        }
      } catch (error) {
        console.error('Error deleting meal:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    });


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// server running code 
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})