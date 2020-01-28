const mongoose = require('mongoose');
const { DB_USER, DB_PASS, DB_HOST } = require('./constants');
const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}`;
console.log(url)
const options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const connection = mongoose.connection;
mongoose
    .connect(url, options)
    .then(db => console.log(`connected to: ${db.connection.name}`))
    .catch(err => console.error('connection error: ', err));

module.exports = {
    connection
};