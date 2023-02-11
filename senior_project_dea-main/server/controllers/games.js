require("../schemas")

const mongoose = require("mongoose")
const GameQuestion = mongoose.model("GameQuestionInfo")
const CYOAQuestion = mongoose.model("CYOAQuestionInfo")
const DNDQuestion = mongoose.model("DNDQuestionInfo")
const User = mongoose.model("UserInfo")
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = "sfhgfhgefugefyfeyf63r36737288gssfgusducb@#$&fvdhfdgfuf76";
const questionTopicMap = {other: 0, input_validation: 1, encoding_escaping: 2, xss: 3, sql_injection: 4, crypto: 5, auth: 6};

//Overarching Game Question Routes ==================================================
const getGameCount = (async(req,res) =>{
    GameQuestion.count().then((count)=>{
        res.send({status:"ok", data:count});
    })
    .catch((error)=>{
        res.send({status: "error", data:error});
    });
})

const getGameByTopic = (async(req,res) =>{
    try{
        //If the topic is all
		if(req.params.topic === "all") {
            //Retrieve all question data in database and send it
			GameQuestion.find({}).then((data)=>{
				res.send({status:200, data:data});
			});
        //Else if the topic is a numerical id
		} else if(!isNaN(parseInt(req.params.topic))) {
            //Find specific question information in database and send it
			GameQuestion.find({topic: req.params.topic}).then((data)=>{
				res.send({status:200, data:data});
			});
        //Else the topic is a string identifier
		} else {
            //Find specific question information in database and send it
			GameQuestion.find({topic: questionTopicMap[req.params.topic]}).then((data)=>{
				res.send({status:200, data:data});
			});
		}
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const getGameByType = (async(req,res) =>{
    try{
        //Find the game question and send it
        GameQuestion.find({type: req.params.type}).then((data) =>{
            res.send({status:200, data:data});
        })
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const getGameById = (async(req,res) =>{
    try{
        var id = mongoose.Types.ObjectId(req.params.id);

        //Find the game question and send it
        GameQuestion.findOne({_id: id}).then((data) =>{
            res.send({status:200, data:data});
        })
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const deleteGameById = (async(req,res) =>{
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

    //Try these options
    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;
        //Set result to true or false depending on if the question 
        //was successfully found and deleted by its id
        const result = await GameQuestion.findByIdAndDelete(_id);
        
        //TODO: update this when the game score on the profile page is updated
        //Find all users with references to the old questions and delete the old questions
        /*const usersWithOldQuestions = await User.find({learnscore: _id});
        for(let i = 0; i < (await usersWithOldQuestions).length; i++) {
            var user = usersWithOldQuestions[i];
            var index = user.learnscore.indexOf(_id);
            if(index > -1) {
                user.learnscore.splice(index, 1);
                await User.findOneAndUpdate({_id: user._id}, {$set: {learnscore:user.learnscore}});
            }
        }*/

        //If True
        if (result) {
            //Send Status Code 202 (Accepted)
            res.sendStatus(202);
        //Else False
        } else {
            //Send Status Code 404 (Not Found)
            res.sendStatus(404);
        }
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

const updateGame = (async(req,res) =>{
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
        //Set _id to the value given in url under :id
        const _id = req.params.id;

        //Set result to true or false depending on if the question was 
        //successfully found by its id and updated
        const result = await GameQuestion.findByIdAndUpdate(_id, {
            //Dynamically changes values based on the JSON data in the PUT request
            topic: req.body.topic,
            name: req.body.name,
            //NOTE: do not ever allow for the update of type here. Instead, delete the question and remake it.
            //NOTE: do not ever allow for the direct update of questionData. Instead, let the CYOA, DND, etc. routes handle it.
        });

        //If True
        if (result) {
            //Send Status Code 202 (Accepted)
            res.sendStatus(202);
            return;
        //Else False
        } else {
            //Send Status Code 404 (Not Found)
            res.sendStatus(404);
            return;
        }
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
        return;
    }
})

//Requires a token, questionIds (for a CYOA question), type, and topic
const createGame = (async(req,res) =>{
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
        const question = new GameQuestion({
            //Dynamically changes values based on the JSON data in the POST request
            //CHOOSE YOUR OWN ADVENTURE QUESTION DATA FORMAT: questionData contains a list of IDs to CYOA questions
            questionData: [],
            type: req.body.type,
            name: req.body.name,
            topic: req.body.topic,
        })
        await question.save();
        res.sendStatus(201);

    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
        return;
    }
})

//CYOA Subquestion Routes ==================================================
const getCYOAById = (async(req,res) =>{

})

const deleteCYOAById = (async(req,res) =>{

})

const updateCYOA = (async(req,res) =>{

})

const createCYOA = (async(req,res) =>{

})

//DND Subquestion Routes ==================================================
const getDNDById = (async(req,res) =>{
    //TODO: implement
    res.sendStatus(501);
})

const deleteDNDById = (async(req,res) =>{
    //TODO: implement
    res.sendStatus(501);
})

const updateDND = (async(req,res) =>{
    //TODO: implement
    res.sendStatus(501);
})

const createDND = (async(req,res) =>{
    //TODO: implement
    res.sendStatus(501);
})

module.exports = {
    getGameCount,
    getGameByTopic,
    getGameByType,
    getGameById,
    deleteGameById,
    updateGame,
    createGame,
    getCYOAById,
    deleteCYOAById,
    updateCYOA,
    createCYOA,
    getDNDById,
    deleteDNDById,
    updateDND,
    createDND,
}