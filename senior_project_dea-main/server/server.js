const cors = require("cors")
const express = require("express")
const { body, validationResult } = require('express-validator')
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
dotenv.config()
const server = express()
server.use(cors());
server.use(express.json())
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = "sfhgfhgefugefyfeyf63r36737288gssfgusducb@#$&fvdhfdgfuf76";
//User and TraditionalQuestion Models for MongooseDB (see schemas.js for actual model definitions)
require("./schemas")
const User = mongoose.model("UserInfo")
const TraditionalQuestion = mongoose.model("TraditionalQuestionInfo")
//Database URL
const mongoUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pfxgixu.mongodb.net/?retryWrites=true&w=majority`
const questionTopicMap = {other: 0, input_validation: 1, encoding_escaping: 2, xss: 3, sql_injection: 4, crypto: 5, auth: 6};

mongoose.connect(mongoUrl, {
    useNewUrlParser:true
})
.then(()=>{console.log("Connnected to database");
})
.catch(e=>console.log(e));

//POSTing new user info into the database (User Registration)
server.post("/register", async(req, res)=>{
    const {fname, lname, email, password, score} = req.body;

    const encryptedPass = await bcrypt.hash(password, 10);

    try{
        const existingUser = await User.findOne({email});

        //If user information already exists in database, return error
        if (existingUser) {
            return res.send({error: "A GatorSecurity account already exists with this email address."})
        }

        await User.create({
            fname,
            lname,
            email,
            password:encryptedPass,
        });
        res.send({status:"ok"})
    } catch(error) {
        res.send({status: "error"});
    }
});

//POSTing (in functionality GETting) existing user info from database (User Login)
server.post("/login", async(req,res)=> {
    const {email, password} = req.body;
    const user=await User.findOne({email});

    //If user information was not found, return error
    if (!user) {
        return res.json({error: "User email not found."});
    }

    if (await bcrypt.compare(password, user.password)) {
        const tempToken = jwtObj.sign({email:user.email}, Jwt_secret_Obj);

        if (res.status(201)) {
            return res.json({status:"ok", data: tempToken});
        } else {
            return res.json({error:"error"});
        }
    }

    res.json({status:"error", error:"Invalid password."})
})

//POSTing existing user info
server.post("/userInfo", async(req,res)=>{
    //"Grab" token from request body (req.body)
    const {token} = req.body;
    try{
        //Decode token, get email
        const user = jwtObj.verify(token, Jwt_secret_Obj);
        //Set uEmail to email
        const uEmail = user.email;
        //Find a user based on email, then send the data
        User.findOne({email: uEmail}).then((data)=>{
            var allData = {dbUserData: data};
            res.send({status:"ok", data:allData});
        })
        .catch((error)=>{
            res.send({status: "error", data:error});
        });
    } catch(error) {
		res.sendStatus(500);
    }
})

//POSTing existing user info (Edit user profile)
server.put("/user/update/:id", async(req,res) => {
    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;

        if (req.body.password !== undefined) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        if (req.body.email !== undefined) {
            const email = req.body.email
            const existingUser = await User.findOne({email});

            //If another user besides the one we're updating has the same email
            if (existingUser && existingUser._id !== _id) {
                return res.sendStatus(422);
            }
        }

        const result = await User.findByIdAndUpdate(_id, {
            $set: req.body
        });
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

//POSTing (in functionality GETting) all user information in the database
server.post("/allUsers", async(req,res)=>{
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

    //console.log("/allUsers")
    try{
        User.find({}).then((data)=>{
            res.send(data);
        })
        .catch((error)=>{
            res.send({status: "error", data:error});
        });
    } catch(error) {
		res.sendStatus(500);
    }
})

//PUTting a user's updated Learn score in the database
server.put("/updatelearnscore", async(req,res)=>{
    try{
        //Retrieve the question being answered
        const questionData = await TraditionalQuestion.findById(req.body.qid)
        //Check to see if they answered it correctly
        if(questionData.answer === req.body.answer) {
            const user = jwtObj.verify(req.body.token, Jwt_secret_Obj);
            const uEmail = user.email;
            
            //Get existing scores
            User.findOne({email: uEmail}).then((dbUser) => {
                var existingRawScores = dbUser["learnscore"];

                var existingScores = [];
                if(existingRawScores !== undefined) {
                    existingScores = existingRawScores;
                }

                //If an existing entry for the question is not found, add it
                if(existingScores.find(element => element === req.body.qid) === undefined) {
                    existingScores.push(req.body.qid);
                    User.updateOne({email: uEmail}, {$set: {"learnscore": existingScores}});
                }
            });
            
            res.send({status: 200, data:{correct:true}});
        } else {
            res.send({status: 200, data:{correct:false}});
        }
    } catch(error) {
		res.sendStatus(500);
    }
})

//PUTting a user's updated score in the database (now used only for the Game section)
server.put("/updatescore", async(req,res)=>{
    const {token,section,index} = req.body;
    if(section === "learn"){
        res.sendStatus(301);
        return;
    }
     //console.log("/updatescore put called in server.js")
    try{
        const user = jwtObj.verify(token, Jwt_secret_Obj);
        const uEmail = user.email;
        let field = section + "score." + index;
        let updateQuery= {};
        updateQuery[field] = 1
        const result = await User.updateOne({email: uEmail}, {$set: updateQuery});
        //console.log("result: ");
        //console.log(result);
		res.sendStatus(200);
    } catch(error) {
		res.sendStatus(500);
    }
})

server.post("/questions/getCount", async(req,res) =>{
    TraditionalQuestion.count().then((count)=>{
        res.send({status:"ok", data:count});
    })
    .catch((error)=>{
        res.send({status: "error", data:error});
    });
})

//POSTing (in functionality GETting) questions in database based on :topic value
server.post("/questions/get/:topic", async(req,res)=>{
    //Check administrative status
    var isAdmin = false;

    try {
        if(req.body.token !== null && req.body.token !== undefined) {
            const adminFromToken = jwtObj.verify(req.body.token, Jwt_secret_Obj);
            const adminEmail = adminFromToken.email;
            var admin = await User.findOne({email: adminEmail});
            if(admin.isAdmin === true) {
                isAdmin = true;
            }
        }
    }
    catch(error) {
        res.send({status: 500, error:error});
        return;
    }
    
    try{
        //If url is /questions/get/all (more literally if :topic is equal to all)
		if(req.params.topic === "all") {
            //Retrieve all question data in database and send it
			TraditionalQuestion.find({}).then((data)=>{
                //Ensure answers aren't sent to the frontend unless you are an admin
                if(!isAdmin) {
                    for(let i = 0; i < data.length; i++) {
                        data[i].answer = "The answer is available only as an administrator.";
                    }
                }
				res.send({status:200, data:data});
			});
        //Else if the topic is a numerical id
		} else if(!isNaN(parseInt(req.params.topic))) {
            //Find specific question information in database and send it
			TraditionalQuestion.find({topic: req.params.topic}).then((data)=>{
                //Ensure answers aren't sent to the frontend unless you are an admin
                if(!isAdmin) {
                    for(let i = 0; i < data.length; i++) {
                        data[i].answer = "The answer is available only as an administrator.";
                    }
                }
				res.send({status:200, data:data});
			});
        //Else the topic is a string identifier
		} else {
            //Find specific question information in database and send it
			TraditionalQuestion.find({topic: questionTopicMap[req.params.topic]}).then((data)=>{
                //Ensure answers aren't sent to the frontend unless you are an admin
                if(!isAdmin) {
                    for(let i = 0; i < data.length; i++) {
                        data[i].answer = "The answer is available only as an administrator.";
                    }
                }
				res.send({status:200, data:data});
			});
		}
        //Catch any errors
        } catch(error) {
            //Send Status Code 500 (Internal Server Error)
            res.sendStatus(500);
        }
})

//DELETE a question in the database based on its id
server.delete("/questions/delete/:id", async(req,res) => {
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
        const result = await TraditionalQuestion.findByIdAndDelete(_id);
        
        //Find all users with references to the old questions and delete the old questions
        const usersWithOldQuestions = await User.find({learnscore: _id});
        for(let i = 0; i < (await usersWithOldQuestions).length; i++) {
            var user = usersWithOldQuestions[i];
            var index = user.learnscore.indexOf(_id);
            if(index > -1) {
                user.learnscore.splice(index, 1);
                await User.findOneAndUpdate({_id: user._id}, {$set: {learnscore:user.learnscore}});
            }
        }

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

//POST a new question in the database
server.post("/questions/create",
body('question').notEmpty().withMessage("Question cannot be empty"),
body('type').notEmpty().withMessage("Type cannot be empty"),
body('topic').notEmpty().withMessage("Topic cannot be empty"),
body('topic').isFloat({ min:0, max:6 }).withMessage("The topic must be a numeric identifier between 0 and 6"),
body('options').notEmpty().withMessage("Options cannot be empty"),
body('answer').notEmpty().withMessage("Answer cannot be empty"),
body('options').custom((value, {req}) => {
    if (!value.includes(req.body.answer))
    {
        throw new Error("The correct answer must be present in the answer options")
    } else {
        return value
    }
}),
async(req,res)=>{
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        const question = new TraditionalQuestion({
            //Dynamically changes values based on the JSON data in the POST request
            question: req.body.question,
            type: req.body.type,
            topic: req.body.topic,
            options: req.body.options,
            answer: req.body.answer,
        })
        await question.save();
        res.sendStatus(201);
    //Catch any errors
    } catch(error) {
        //Send Status Code 500 (Internal Server Error)
        res.sendStatus(500);
    }
})

//PUT updated information for a question already in the database based on its id
server.put("/questions/update/:id", async(req,res) => {
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
        const result = await TraditionalQuestion.findByIdAndUpdate(_id, {
            //Dynamically changes values based on the JSON data in the PUT request
            question: req.body.question,
            type: req.body.type,
            topic: req.body.topic,
            options: req.body.options,
            answer: req.body.answer
        });
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

//POSTing (in functionality GETting) whether a user is an administrator
server.post("/checkPrivileges", async(req,res) => {
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
        else {
            res.send({status: 200});
            return;
        }
    }
    catch(error) {
        res.send({status: 500, error:error});
        return;
    }
})

//Tell server to listen on port 5000
server.listen(5000, ()=>{
    console.log("Server started on port 5000");
})
