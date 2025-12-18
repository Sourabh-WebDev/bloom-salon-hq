import clientPromise from "./_db.js";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("customerDB");
    const customers = db.collection("customers");

    if (req.method === "POST") {
        const customer = req.body;
        const result = await customers.insertOne(customer);
        return res.status(201).json(result);
    }

    if (req.method === "GET") {
        const data = await customers.find({}).toArray();
        return res.status(200).json(data);
    }

    res.status(405).json({ message: "Method Not Allowed" });
}
