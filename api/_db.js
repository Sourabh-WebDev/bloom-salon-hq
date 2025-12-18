import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
let client;
let clientPromise;

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
}

if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;
