//library exports
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

//Local exports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');



var app = express();

const port = process.env.PORT ||3000 ; 

app.use(bodyParser.json());

app.post('/todos' , (req, res)=>{ //send data to a server - to todos , save in DB and response
                                //using POSTMAN for debug
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc)=>{
        res.send({doc});
    }, (e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos' , (req , res) => {
    Todo.find().then((todos)=>{
        res.send({message: 'List of all todos:',
        todos});
    } , (e) =>{
        res.status(400).send(e);
    });
});

app.get('/todos/:id' , (req , res) => {
    var id = req.params.id ;

    if(!ObjectID.isValid(id)){
        return res.status(404).send({message:'ID not valid'});
    }

    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send({message:'ID not found'});
        }
        res.send({message: 'Todo:',
        todo});
    } , (e) =>{
        res.status(400).send();
    });
});




app.listen(port , ()=>{
    console.log('Started on port ' , port);
});

module.exports = {
    app
};