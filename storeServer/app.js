const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config({path: __dirname + '/.env'})
const db_query = require('../db_mngt/db_query');
const { json } = require('body-parser');
const port = process.env.port || 8080;
const app = express();
app.use(express.static('storeServer'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




app.get('/getmenu', (req, res) => {
    //a comment test
    db_query.selectAllMenu(res, "menu_items")
    .then(results => {
        res.send(JSON.stringify(results));
    })
    .catch(() => {
        res.send('error occured !');
    })

})

app.get('/getorders', (req, res) => {

    db_query.selectAllOrders(res)
        .then(results =>{
            res.send(JSON.stringify(results))
    }).catch(err =>{
        console.log(err.stack);
        res.send('error occured');
    })

})

app.get('/', (req, res) => {

    res.sendFile('client.html', { root: '.' }, (err) => {
        if (err)
            console.log(err.stack);

        console.log('file sent client.html');
    });

})

app.post('/setmenuitemsstatus', (req, res) => {

    let st = req.body;
    console.log(st);
    db_query.setMenuItemsStatus(st)
    .then(results => {
        res.send('' + results)
    })
    .catch(error => {
        console.log("erreuuur : ", error);
        res.sendStatus(500);
    })
});

app.post('/addmenuitem', (req, res) => {

    let st = req.body;
    
    db_query.addToMenu(st)
    .then(results => {
        res.send('menu items added : ' + results)
    })
    .catch(error => {
        console.log("erreur : menu item already exists !");
        res.send('menu item already exists !');
    })
});


let server = app.listen(port, () => {
    console.log("Server listening on port " + port);
})