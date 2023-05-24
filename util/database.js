const {mongoose} = require('mongoose');
const password = 'k3DNW706u9lIcABX';
const uri = `mongodb+srv://chiho:${password}@cluster0.swnckh2.mongodb.net/shop?retryWrites=true&w=majority`;

let _db;
const mongooseConnect = () => {
    return mongoose.connect(uri)
}


exports.mongooseConnect = mongooseConnect;


//kk3DNW706u9lIcABX