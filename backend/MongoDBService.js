const util = require('util');
const mongoClient = require('mongodb').MongoClient;

class MongoDBService {
    constructor(url, databaseName) {
        this.url = url;
        this.databaseName = databaseName;
    }

    async connect() {
        try {
            const connect = util.promisify(mongoClient.connect);

            this.client = await connect(this.url, { useUnifiedTopology: true });
            this.database = this.client.db(this.databaseName);
        } catch (err) {

        }
    }

    disconnect() {
        this.client.close();
    }

    find(collection, parameters = {}, sort = {}, limit = 5) {
        return new Promise((resolve, reject) => {
            this.database.collection(collection).find(parameters).sort(sort).limit(limit).toArray(function (error, data) {
                if (error) reject();
                resolve(data);
            })
        });
    }

    insert(collection, parameters) {
        return new Promise((resolve, reject) => {
            this.database.collection(collection).insertOne(parameters, function (error) {
                if (error) reject();
                resolve();
            });
        });
    }


}

module.exports = MongoDBService;