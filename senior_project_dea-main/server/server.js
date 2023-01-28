const cors = require("cors")
const express = require("express")
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

const questionTypeMap = {xss: 0};

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
            score
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

//POSTing existing user info (Information that appears on /myprofile)
server.post("/userInfo", async(req,res)=>{
    const {token} = req.body;
    //console.log("hello")
    try{
        const user = jwtObj.verify(token, Jwt_secret_Obj);
        //console.log(user)
        const uEmail = user.email;
        User.findOne({email: uEmail}).then((data)=>{
            res.send({status:"ok", data: data});
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
        //Set result to true or false depending on if the question was
        //successfully found by its id and updated
        const result = await User.findByIdAndUpdate(_id, {
            //Dynamically changes values based on the JSON data in the PUT request
            fname: req.body.fname,
            lname: req.body.lname//,
            //email: req.body.email,
            //password: req.body.password
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

//PUTting a user's updated score in the database
server.put("/updatescore", async(req,res)=>{
    const {token,section,index} = req.body;
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

//POSTing (in functionality GETting) questions in database based on :topic value
server.post("/questions/get/:topic", async(req,res)=>{
	try{
        //If url is /questions/get/all (more literally if :topic is equal to all)
		if(req.params.topic === "all") {
            //Retrieve all question data in database
			TraditionalQuestion.find({}).then((data)=>{
                //Display all question data
				res.send({status:200, data:data});
			});
        //Else if is not not a number, parse :topic into an integer
		} else if(!isNaN(parseInt(req.params.topic))) {
            //Find specific question information in database
			TraditionalQuestion.find({topic: req.params.topic}).then((data)=>{
                //Display the question data
				res.send({status:200, data:data});
			});
		} else {
			TraditionalQuestion.find({topic: questionTypeMap[req.params.topic]}).then((data)=>{
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
    //Try these options
    try{
        //Set _id to the value given in url under :id
        const _id = req.params.id;
        //Set result to true or false depending on if the question 
        //was successfully found and deleted by its id
        const result = await TraditionalQuestion.findByIdAndDelete(_id);
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
server.post("/questions/create", async(req,res)=>{
    try{
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

//Tell server to listen on port 5000
server.listen(5000, ()=>{
    console.log("Server started on port 5000");
})