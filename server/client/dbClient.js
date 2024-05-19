const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
const config = require("../config");
const { warn } = require("console");


const caFilePath = path.join(__dirname, "..", "global-bundle.pem");

var docDbInstance;
const dbName = config.getMongoDbName();

/**
 * Create AWS Document DB connection
 */
async function createDocDBConnection() {
  if (docDbInstance) return docDbInstance;

  var client = MongoClient.connect(config.getMongoDbUrl(), {
    tlsCAFile: [caFilePath],
  });

  docDbInstance = client;
  return client;
}

/**
 *
 * @returns Load all the Products
 */
async function getAllProducts() {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);
    const col = db.collection("Products");

    const products = await col.find({}).toArray();
    return products;
  } catch (err) {
    console.error("Error fetching products: ", err);
    throw err;
  }
}

module.exports = {
  getAllProducts
};
