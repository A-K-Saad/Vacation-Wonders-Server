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

    app.get("/packages", async (req, res) => {
      const result = await packageCollection.find({}).toArray();
      res.send(result);
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
      res.send(result);
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
