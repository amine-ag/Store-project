const {Client} = require('pg')


const portnumber = process.env.port || 5555;
const client = new Client({
    port : portnumber,
    database : process.env.db_name,
    user : process.env.db_user,
    password : process.env.db_password
});

client.connect().then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err);
})

module.exports = client;
