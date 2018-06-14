const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

//local
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneID = new ObjectID(); 
const userTwoeID = new ObjectID(); 

const users =[
    {   _id: userOneID,
        email: 'nadaddddv@gmail.com',
        name: 'nadavavav',
        password: 'userOnePassword',
        tokens: [{
            access : 'auth',
            token: jwt.sign({_id: userOneID , access: 'auth'} , 'abc123').toString()
        }]},
    {   _id: userTwoeID,
        name: 'nadava2222',
        email: 'nad222av@gmail.com',
        password: 'userTwoPassword'
    }
];

const todos = [
    {   _id: new ObjectID(),
        text: 'First test todo'},
    { _id: new ObjectID(),
    text: 'Second test todo',
     completed: true , 
     completedAt: 22}
];

const populateToods = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then( () => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();
  
      return Promise.all([userOne, userTwo])
    }).then(() => done());
  };

module.exports = {
    todos,
    populateToods,
    users,
    populateUsers
};