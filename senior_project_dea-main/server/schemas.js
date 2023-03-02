 const mongoose = require("mongoose")

const userDBSchema = new mongoose.Schema(
    {
        fname:String,
        lname:String,
        email:{type:String, unique:true},
        password:String,
        learnscore:Array,
        gamescore:Array,
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
        displayType: { 
            type: String, 
            enum: ['learn','game']
        }
    },
    {
        collection: "TraditionalQuestionInfo",
    }
);

const gameQuestionDBSchema = new mongoose.Schema(
    {
        name:String,
        questionData:Array,
        topic:Number,
        type:Number,
    },
    {
        collection: "GameQuestionInfo",
    }
)

const CYOAQuestionDBSchema = new mongoose.Schema(
    {
        parentQuestionId:mongoose.Schema.Types.ObjectId,
        questionNumber:Number,
        question:String,
        type:Number,
        options:Array,
        answer:String,
        stimulus:String,
        explanation:String,
    },
    {
        collection: "CYOAQuestionInfo"
    }
)

const DNDQuestionDBSchema = new mongoose.Schema(
    {
        parentQuestionId:mongoose.Schema.Types.ObjectId,
        question:String,
        answer:Array, // this should always be in the correct order
        stimulus:String,
        explanation:String, 
    },
    {
        collection: "DNDQuestionInfo"
    }
)

mongoose.model("UserInfo", userDBSchema);
mongoose.model("TraditionalQuestionInfo", traditionalQuestionDBSchema);
mongoose.model("GameQuestionInfo", gameQuestionDBSchema);
mongoose.model("CYOAQuestionInfo", CYOAQuestionDBSchema);
mongoose.model("DNDQuestionInfo", DNDQuestionDBSchema);