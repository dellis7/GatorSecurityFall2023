//Imports
require("../schemas")
const privileges = require("../util/privileges")

const mongoose = require("mongoose")

//DB Models
const Class = mongoose.model("Classes")
const User = mongoose.model("UserInfo")

//ENV preparation
const dotenv = require("dotenv")
dotenv.config('./.env')

//JWT information
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = process.env.JWT_SECRET;

//create class endpoint controller
const createClass = (async (req, res) => {

    const className = req.body.cname.toString();
    const educatorEmail = req.body.educatorEmail.toString();

    //create the class as long as it has a unique name
    try{
        const existingClass = await Class.findOne({name: className})

        if (existingClass){
            console.log("Class already exists!\n")
            console.log(existingClass)
            return res.send({status: "classExists"})
        }


        await Class.create(
            {
                name:className,
                educator:educatorEmail
            }
        );
        return res.send({status:"ok"});
    } catch(error){
        res.send({status: error});
    }

})

//TODO test functionality and add to website
const removeClass = (async (req, res) => { //TODO allow admin to delete any class

    const className = req.body.cname.toString();
    const educatorEmail = req.body.educatorEmail.toString();

    //Remove class if class exists AND current user owns class
    try{
        const existingClass = await Class.findOne({name: className, educator: educatorEmail})

        if (!existingClass) {
            return res.send({status: "noSuchClass"})
        }
        else {
            await Class.findOneAndDelete({name: className})
            return res.send({status: "ok"})
        }
    }
    catch(error){
        res.send({status: "error"});
    }
})

const addStudent = (async (req, res) => {

    const studentEmail = req.body.studentEmail.toString();
    const className = req.body.className.toString();
    const educatorEmail = req.body.educatorEmail.toString()

    //Add student to class as long as class exists AND user email exists AND educator owns class
    try{
        const studentToAdd = await User.findOne({email: studentEmail})
        const classToAddTo = await Class.findOne({name: className, educator: educatorEmail})
        console.log(studentToAdd) //TODO

        if (studentToAdd == null){
            return res.send({status: "noSuchStudent"})
        }
        else if (classToAddTo == null){
            return res.send({status: "noSuchClass"})
        }
        else{
            await Class.updateOne(
                {name: className},
                {$push: {students: studentEmail}}
            )
            res.send({status:"ok"})
        }


        return res.send({status:"ok"});
    } catch(error){
    }

})

module.exports = {
    createClass,
    removeClass,
    addStudent,
    // removeStudent,
    // getAllStudents
}