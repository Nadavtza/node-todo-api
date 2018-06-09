var mongoose = require('mongoose');

//create Todo model 
var Todo = mongoose.model('Todo' , {
    text:{
        type: String,
        required: true,
        minlength: 1,
        trim: true  //remove spaces 
    },
    completed:{
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        default: null
    }
});

module.exports = {
    Todo
};