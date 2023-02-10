require("../schemas")

const mongoose = require("mongoose")
const GameQuestion = mongoose.model("GameQuestionInfo")
const User = mongoose.model("UserInfo")
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = "sfhgfhgefugefyfeyf63r36737288gssfgusducb@#$&fvdhfdgfuf76";
const questionTopicMap = {other: 0, input_validation: 1, encoding_escaping: 2, xss: 3, sql_injection: 4, crypto: 5, auth: 6};

const getCount = (async(req,res) =>{
    GameQuestion.count().then((count)=>{
        res.send({status:"ok", data:count});
    })
    .catch((error)=>{
        res.send({status: "error", data:error});
    });
})

const getByTopic = (async(req,res) =>{

})

const getById = (async(req,res) =>{

})

const deleteById = (async(req,res) =>{

})

const create = (async(req,res) =>{
    //Check administrative status
    try {
        if(req.body.token === null || req.body.token === undefined) {
            res.send({status: 403});
            return;
        }
        const adminFromToken = jwtObj.verify(req.body.token, Jwt_secret_Obj);
        const adminEmail = adminFromToken.email;
        var admin = await User.findOne({email: adminEmail});
        if(admin.isAdmin !== true) {
            res.send({status: 403});
            return;
        }
    }
    catch(error) {
        res.send({status: 500, error:error});
        return;
    }
    try{
        //If the question type is "choose your own adventure"
        if(req.body.type === 1) {
            const question = new GameQuestion({
                //Dynamically changes values based on the JSON data in the POST request
                //CHOOSE YOUR OWN ADVENTURE QUESTION DATA FORMAT
                //questionData: {
                //  questionnumber: Integer
                //  question: String
                //  options: Array
                //  answer: String
                //}
                questionData: req.body.questionData,
                type: req.body.type,
                topic: req.body.topic,
            })
            await question.save();
            res.sendStatus(201);
        }
        //Else if the question type is "drag and drop"
        else if(req.body.type === 2) {
        }
        else {
            res.sendStatus(400);
        }
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const update = (async(req,res) =>{

})

module.exports = {
    getCount,
    getByTopic,
    getById,
    deleteById,
    create,
    update
}