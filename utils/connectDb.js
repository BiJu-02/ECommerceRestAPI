const { MongoClient } = require('mongodb');
const dbInfo = require('./dbInfo');
const pass = encodeURIComponent()
// node's internal caching helps with not creating a new object everytime this module is required.
module.exports = new MongoClient(process.env.MONGO_URI).db(dbInfo.dbName);