const { MongoClient } = require('mongodb');
require('dotenv').config();

const dbConnection = async() => {
    const client = new MongoClient(process.env.MONGODB_CNN);

    try {
        return await client.connect();
    } catch (e) {
        console.error(e);
        throw e;
    } 
}

module.exports = {
    dbConnection
}
