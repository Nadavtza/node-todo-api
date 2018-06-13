require('./config/config');


//library exports
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

//Local exports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');


var app = express();

const port = process.env.PORT ||3000 ; 

app.use(bodyParser.json());

//todos
//post route
app.post('/todos' , (req, res)=>{ 
                                
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

//get route
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

//delete route
app.delete('/todos/:id' , (req , res) => {
    var id = req.params.id ;

    if(!ObjectID.isValid(id)){
        return res.status(404).send({message:'ID not valid'});
    }

    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send({message:'ID not found'});
        }
        res.status(200).send({message: 'Todo removed:',
        todo});
    } , (e) =>{
        res.status(400).send();
    });
});

//patch (update) route
app.patch('/todos/:id' , (req , res) => {
    var id = req.params.id ; 
    var body = _.pick(req.body , ['text' , 'completed']); // pick only those we want to edit  

    if(!ObjectID.isValid(id)){
        return res.status(404).send({message:'ID not valid'});
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false ; 
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id , {$set: body} ,{new: true}).then((todo)=>{
        if(!todo){
            return res.status(404).send({message:'ID not found'});
        }
        res.send({message: 'Todo updated:',
        todo});
    } , (e) =>{
        res.status(400).send();
    });


});

//users
//POST route
app.post('/users' , (req, res)=>{ 
    var body = _.pick(req.body , ['name' , 'email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
      }).then((token) => {
        res.header('x-auth', token).send(user);
      }).catch((e) => {
        res.status(400).send(e);
      })
    });


//GET private route
app.get('/users/me' ,authenticate , (req ,res) =>{
   res.send(req.user);
});

app.listen(port , ()=>{
    console.log('Started on port ' , port);
});

module.exports = {
    app
};