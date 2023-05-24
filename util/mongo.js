const {MongoClient} = require('mongodb');
const password = '';
const uri = `mongodb+srv://chiho:${password}@cluster0.swnckh2.mongodb.net/shop?retryWrites=true&w=majority`;

let _db;
const mongoConnect = (callback) => {
    MongoClient.connect(uri)
        .then(client => {
            console.log("Connected!");
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err)
            throw err;
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No dataBase found !'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;