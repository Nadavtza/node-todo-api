// const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!'; 

// bcrypt.genSalt(10, (err , salt)=>{
//     bcrypt.hash(password , salt , (err , hash) =>{
//         console.log(hash);
//     })
// });

var hashPassword = '$2a$10$iIwKshPbnXoCIGlia6FC7.zL0NirkwF0.SxXgGa.qvbr8A6RqDUwa';

bcrypt.compare(password , hashPassword , (err , res)=>{
    console.log(res);
});


var data = {
        id: 4
    };
var token =jwt.sign(data , '1234');
var decoded = jwt.verify(token , '1234');

console.log('decoded' , decoded);










// var message = 'I am user number';
// var hash = SHA256(message).toString();

// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secret').toString()
// };
// var resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();

// if(resultHash === token.hash)
// {
//     console.log(`Data was not changed`);
// }
// else{
//     console.log(`Data was  changed. Do not trust!`);
// }