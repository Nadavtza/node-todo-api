//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //take mongo from to obj we got

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{ //connect to database
    if(err){
       return console.log('Unable to connect to mongoDB server');
    }
    console.log('Connected to MongoDB server')
    const db  = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     text: 'something to do',
    //     completed: false
    // },(err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert Todo');
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2))
    // });
    db.collection('Users').insertOne({
        name: 'Nadav',
        age: 27,
        location: 'Israel'
    },(err,result)=>{
        if(err){
            return console.log('Unable to insert new User', err);
        }
        console.log(result.ops[0]._id.getTimestamp());
    });
    client.close();
});