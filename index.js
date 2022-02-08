const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//middle were
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wehqx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("onlineCarShop");
    const offerCollection = database.collection("bmw");
    const assToCardCollection = database.collection("card");
    const saveUsersCollection = database.collection("users");
    // const bookingCollection = database.collection("booking");

    //get api
    app.get("/bmw", async (req, res) => {
      const cursor = offerCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //post api
    app.post("/bmw", async (req, res) => {
      const cursor = req.body;
      console.log(cursor, "this is ");
      const result = await offerCollection.insertOne(cursor);

      res.json(result);
    });

    app.get("/bmw/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await offerCollection.findOne(query);
      res.json(result);
    });
    // --------------------------------------------------------------
    //Add to card collection
    app.post("/card", async (req, res) => {
      const cursor = req.body;
      console.log(cursor, "this is ");
      const result = await assToCardCollection.insertOne(cursor);
      res.json(result);
    });
    app.get("/card", async (req, res) => {
      const cursor = assToCardCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/card/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await assToCardCollection.findOne(query);
      res.json(result);
    });
    app.delete("/card/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      console.log(query);
      const result = await assToCardCollection.deleteOne(query);
      res.json(result);
    });

    // ------------------------------------------------------------------------
    // Show details and dynamic route
    // app.get("/bmw/:id", async (req, res) => {
    //   const productDetail = await productCollection.findOne({ _id: req.params.id });
    //   res.send(productDetail);
    // });
    //get single api

    //user collection
    app.post("/users", async (req, res) => {
      const users = await saveUsersCollection.insertOne(req.body);
      console.log(users);
      res.json(users);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await saveUsersCollection.deleteOne(query);
      res.json(result);
    });
    // //-------------------------------------------------
    // app.get("/booking", async (req, res) => {
    //   const cursor = bookingCollection.find({});
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    // app.post("/booking", async (req, res) => {
    //   const cursor = req.body;
    //   const result = await bookingCollection.insertOne(cursor);
    //   res.json(result);
    // });
    // //-------------- Delete Api ------------------

    // app.delete("/booking/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: id };
    //   const result = await bookingCollection.deleteOne(query);
    //   res.json(result);
    // });
    //single api
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
