//library exports
var express = require('express');
var bodyParser = require('body-parser');

//Local exports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
app.use(bodyParser.json());

app.post('/todos' , (req, res)=>{ //send data to a server - to todos , save in DB and response
                                //using POSTMAN for debug
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send(e);
    });
});

app.listen(3000 , ()=>{
    console.log('Started on port 3000');
});
