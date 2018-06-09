//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //take mongo from to obj we got

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{ //connect to database
    if(err){
       return console.log('Unable to connect to mongoDB server');
    }
    console.log('Connected to MongoDB server')
    const db  = client.db('TodoApp');
    //deleteMany

    // db.collection('Todos').deleteMany({text:'delete'}).then((result)=>{
    //     console.log(result);
    // });

    //deleteOne

    // db.collection('Todos').deleteOne({text:'delete'}).then((result)=>{
    //     console.log(result);
    // });

    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
        console.log(result);
    });
   
  
   // client.close();
});