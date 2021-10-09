const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const carSchema = new Schema({
    model : {
        type : String,
        required : true
    },
    registration : {
        type : String,
        required : true
    },
    imgPath : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    mark : {
        type : String,
        required : true
    },
    society : {
        type : String,
        required : true
    },
    gearbox : {
        type : String,
        required : true
    },
    speed : {
        type : Number,
        required : true
    },
    seats : {
        type : Number,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    location : {
        type : String,
    },
    price : {
        type : Number,
        required : true
    },
    likes : { 
        nb :{
            type : Number ,
            default :0
        },
        client: [{ 
            type :Schema.Types.ObjectId ,
            ref : 'User'
        }]
    },
    booking :[{ 
        date_debut :{ type: String,required :true},
        date_fin : { type:String, required :true}
    }]

});

module.exports = mongoose.model("Car", carSchema);