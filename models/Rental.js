const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rentalSchema =new Schema({
 car : {
     type :Schema.Types.ObjectId ,
     required : true,
     ref : 'Car'
 },
 start_rental : {
     type: String,
     required : true
 },
 end_rental : {
    type: String,
    required : true
},
durations : {
    type: Number,
    required : true
},
price : {
    type: Number,
    required : true
},
user : { type : Schema.Types.ObjectId ,  ref : 'User' },

pay : { type : Boolean, default : false},
token : String

})

module.exports= mongoose.model('Rental',rentalSchema);