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
        stimulus: Buffer,
    },
    {
        collection: "CYOAQuestionInfo"
    }
)

const DNDQuestionDBSchema = new mongoose.Schema(
    {
        parentQuestionId:mongoose.Schema.Types.ObjectId,
        question:String,
        anchoredMatrix:Array, //This should be a 2D array that contains the correct ordering of text that should be displayed that cannot be moved by the user. Format: [["x", "a"], ["", "y"]]
        answerMatrix:Array, //This should be a 2D array that contains the correct ordering of the unique image ids or text. Format: [[{image: id}, {text: "some text"}], [{text: "this is the next row"}, {image: id}]]
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