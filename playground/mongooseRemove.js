const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');


// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

var todo_id = '5b1f81493c3f4321ecef595f';

Todo.findByIdAndRemove(todo_id)
.then((todo)=>{
    if(!todo){
        return console.log('todo not found');
    }
    console.log('todo removed: ' , JSON.stringify(todo , undefined , 2));
} , (e)=> {
    console.log(e);
});