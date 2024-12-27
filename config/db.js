const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://hanarar:jf87Y9XhaOyUk8uP@cluster0.vyyyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    autoSelectFamily: false // required for node version over v18
});

async function connectToDatabase() {
    console.log('Connecting to MongoDB...');
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        return client.db('blog');
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

module.exports = connectToDatabase;

