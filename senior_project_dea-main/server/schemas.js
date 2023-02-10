 const mongoose = require("mongoose")

const userDBSchema = new mongoose.Schema(
    {
        fname:String,
        lname:String,
        email:{type:String, unique:true},
        password:String,
        learnscore:Array,
        gamescore: { type: Array, default: [0,0,0,0,0] },
        isAdmin:{type:Boolean, default:false},
    },
    {
        collection: "UserInfo",
    }
);

const traditionalQuestionDBSchema = new mongoose.Schema(
    {
		question:String,
		type:Number,
		topic:Number,
		options:Array,
		answer:String,
    },
    {
        collection: "TraditionalQuestionInfo",
    }
);

mongoose.model("UserInfo", userDBSchema);
mongoose.model("TraditionalQuestionInfo", traditionalQuestionDBSchema);