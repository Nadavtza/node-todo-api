const {MongoClient, ObjectID} = require('mongodb'); //take mongo from to obj we got

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{ //connect to database
    if(err){
       return console.log('Unable to connect to mongoDB server');
    }
    console.log('Connected to MongoDB server')
    const db  = client.db('TodoApp');
    
    //update todo

    // db.collection('Todos').findOneAndUpdate({
    //     _id: '123'},{
    //         $set: {
    //             completed:true
    //         }
    //     },{
    //         returnOriginal:false
    //     }
    // ).then((result)=>{
    //     console.log(result);
    // });

    //update user
   db.collection('Users').findOneAndUpdate(
    { name:'avi'},
    {
        $set:{name: 'ani'},
        $inc:{ age: 1}
    },{
        returnOriginal:false
    }
   ).then((result)=>{
         console.log(result);
     });
  
   // client.close();
});