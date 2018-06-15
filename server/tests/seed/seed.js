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
            token: jwt.sign({_id: userOneID , access: 'auth'} , process.env.JWT_SECRET).toString()
        }]},
    {   _id: userTwoeID,
        name: 'nadava2222',
        email: 'nad222av@gmail.com',
        password: 'userTwoPassword',
        tokens: [{
            access : 'auth',
            token: jwt.sign({_id: userTwoeID , access: 'auth'} , process.env.JWT_SECRET).toString()
        }]},
];

const todos = [
    {   _id: new ObjectID(),
        text: 'First test todo',
        _creator: userOneID
    },
        
    { _id: new ObjectID(),
      text: 'Second test todo',
      completed: true , 
      completedAt: 22,
      _creator: userTwoeID
    }
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