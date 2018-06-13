// const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

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