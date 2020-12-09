const {Client} = require('pg')

const portnumber = process.env.port || 5555;
const client = new Client({
    port : portnumber,
    database : 'store',
    user : 'postgres',
    password : 'root'
});

module.exports = client;
