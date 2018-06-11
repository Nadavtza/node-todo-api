const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');


// var id = 'b1eb5c2ae330d552cbc8f4c';
// if(!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }
// Todo.find({ 
//     _id: id
// }).then((todos)=>{
//     console.log('Todos' , todos);
// });

// Todo.findOne({ 
//     _id: id
// }).then((todo)=>{
//     console.log('Todo' , todo);
// });

// Todo.findById(id)
// .then((todo)=>{
//     if(!todo){
//         return console.log('ID not found');
//     }
//     console.log('Todo by id' , todo);
// }).catch((e)=> {
//     console.log(e);
// });

var user_id = '5b1ebe6bbeb466fa174790fb';

User.findById(user_id)
.then((user)=>{
    if(!user){
        return console.log('user not found');
    }
    console.log('user by id' , JSON.stringify(user , undefined , 2));
} , (e)=> {
    console.log(e);
});