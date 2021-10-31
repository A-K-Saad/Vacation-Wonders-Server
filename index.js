const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8dmqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const run = async () => {
  try {
    await client.connect();
    const database = client.db("VacationWonders");
    const packageCollection = database.collection("packages");
    const orderCollection = database.collection("orders");
    const serviceCollection = database.collection("services");
    const blogCollection = database.collection("blogs");

    app.get("/packages", async (req, res) => {
      const result = await packageCollection.find({}).toArray();
      res.json(result);
    });
    //Post Packages
    app.post("/packages", async (req, res) => {
      const result = await packageCollection.insertOne(req.body);
      res.send(result);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    });
    app.get("/packages/:packageId", async (req, res) => {
      const id = req.params.packageId;
      const query = { _id: ObjectId(id) };
      const result = await packageCollection.findOne(query);
      res.send(result);
    });
    //Post Order
    app.post("/orders", async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.send(result);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    });
    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.json(result);
    });
    //Update Order
    app.put("/orders", async (req, res) => {
      const filter = { _id: ObjectId(req.body._id) };
      const updateDoc = { $set: { status: req.body.status } };
      const options = { upsert: true };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );
    });
    //Delete Orders
    app.delete("/orders", async (req, res) => {
      const query = { _id: ObjectId(req.body._id) };
      const result = await orderCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
    });
    //Get User Orders
    app.get("/my-orders", async (req, res) => {
      const searchTerm = req.query.search;
      if (searchTerm) {
        const result = await orderCollection
          .find({
            email: { $regex: searchTerm },
          })
          .toArray();
        res.send(result);
      } else {
        res.send("Search Your Orders");
      }
    });
    //Get Services
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.json(result);
    });
    //Get Blogs
    app.get("/blogs", async (req, res) => {
      const result = await blogCollection.find({}).toArray();
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
run();

app.get("/", (req, res) => {
  res.send("200. Everything is OK.");
});
app.listen(port, () => {
  console.log("200. Everything is OK.");
});

// packageIDs.map((id) =>
//   data.find((signleData) => signleData._id === id)
// )
