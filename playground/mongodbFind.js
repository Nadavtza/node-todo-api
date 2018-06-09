//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //take mongo from to obj we got

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{ //connect to database
    if(err){
       return console.log('Unable to connect to mongoDB server');
    }
    console.log('Connected to MongoDB server')
    const db  = client.db('TodoApp');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5b1ae3427a9103414c1fd253')
        
    //     }).toArray().then((docs)=>{ //show only not completed
    //     console.log('Todos');
       
    //     console.log(JSON.stringify(docs , undefined, 2));
    // },(err)=>{
    //     console.log('Unable to fetch Todo',err);
    // });

    db.collection('Todos').find({
        }).count().then((count)=>{ //show only not completed
        console.log(`Todos counts ${count}`);
    },(err)=>{
        console.log('Unable to fetch Todo',err);
    });
   
  
   // client.close();
});