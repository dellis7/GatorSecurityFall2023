const mongoose = require("mongoose")

const userDBSchema = new mongoose.Schema(
    {
        fname:String,
        lname:String,
        email:{type:String, unique:true},
        password:String,
        learnscore: { type: Array, default: [0,0,0,0,0,0] },
        gamescore: { type: Array, default: [0,0,0,0,0] },
    },
    {
        collection: "UserInfo",
    }
);

const traditionalQuestionDBSchema = new mongoose.Schema(
    {
		qid:{type:Number, unique:true},
		qbody:String,
		qtype:Number,
		qtopic:Number,
		answers:Array,
		correctans:String,
    },
    {
        collection: "TraditionalQuestionInfo",
    }
);

mongoose.model("UserInfo", userDBSchema);
mongoose.model("TraditionalQuestionInfo", traditionalQuestionDBSchema);