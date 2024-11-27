
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;
if(!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
}
const client = new MongoClient(uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})
client.connect()
let db = client.db("cluster")
const mongodb =  require("mongodb");
const bucket = new mongodb.GridFSBucket(db, {
   "bucketName": "JobFiles"
});
export  default db;
export {client, bucket }