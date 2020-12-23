const mongo = require('mongodb').MongoClient;
const config = require('./../config.json');

module.exports = class Database {

  constructor() {
    
  }

  async establishDatabaseConnection() {
    try {
      console.log('Attempting to connect to mongodb server ' + config.mongodb.hostname);
      const connection = await mongo.connect(this.generateConnectionURI());
      const database = await connection.db(config.mongodb.database);

      console.log('Connected to mongodb server ' + config.mongodb.hostname);
      return database;

    }
    catch(error) {
      throw error;
    }
  }

  generateConnectionURI() {
    if(config.mongodb && config.mongodb.database && config.mongodb.hostname) {
      const conf = config.mongodb;

      let mongoConnectionString = `mongodb://${conf.hostname}/${conf.database}`;
      return mongoConnectionString;
    }
  }

}