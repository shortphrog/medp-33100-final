const { MongoClient } = require('mongodb');

const connectToDatabase = async () => {
  const uri = process.env.MONGO_URI; // Load from environment variables
  const dbName = process.env.DB_NAME; // Database name

  if (!uri || !dbName) {
    throw new Error('MongoDB URI or Database Name is missing in environment variables');
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName); // Return the database instance
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

module.exports = connectToDatabase;
