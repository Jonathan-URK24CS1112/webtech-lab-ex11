const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');

    const db = client.db('FitnessStoreDB');
    const products = db.collection('equipmentDemo');

    // MongoDB creates the database and collection on the first insert.
    const result = await products.insertOne({
      name: 'Dumbbell Set',
      category: 'Strength',
      price: 2499,
      stock: 12
    });
    const filter = { _id: result.insertedId };
    console.log('\nCREATE');
    console.log('Inserted ID:', result.insertedId.toHexString());

    console.log('\nREAD');
    const records = await products.find({}).toArray();
    console.log(JSON.stringify(records, null, 2));

    const update = await products.updateOne(filter, {
      $set: { price: 2299 }
    });
    console.log('\nUPDATE');
    console.log('Updated documents:', update.modifiedCount);
    const updated = await products.findOne(filter);
    console.log(JSON.stringify(updated, null, 2));

    const deletion = await products.deleteOne(filter);
    console.log('\nDELETE');
    console.log('Deleted documents:', deletion.deletedCount);
    const remaining = await products.countDocuments(filter);
    console.log('Matching records after deletion:', remaining);
  } catch (error) {
    console.error('Database error:', error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

main();
