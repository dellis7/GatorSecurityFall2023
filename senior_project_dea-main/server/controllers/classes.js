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

/**
 * create class endpoint controller
 * @function
 * @async
 * @param {string} req.body.cname class name
 * @param {string} req.body.educatorEmail email of educator for class
 * @memberof /classes
 */
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
/**
 * delete class endpoint controller
 * @function
 * @async
 * @param {string} req.body.cname class name
 * @param {string} req.body.educatorEmail email of educator for class
 * @memberof /classes
 */
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

/**
 * add student to class endpoint controller
 * @function
 * @async
 * @param {string} req.body.studentEmail email of student to add
 * @param {string} req.body.className class to add student to
 * @param {string} req.body.educatorEmail email of educator for class
 * @memberof /classes
 */
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

// const removeStudent = (async (req, res) => {
//
// })
//
// const getAllStudents = (async (req, res) => {
//
// })
//
/**
 * get all classes controller
 * @function
 * @async
 * @returns {Class[]} list of classes
 * @memberof /classes
 */
const getAllClasses = (async (req, res) => {
    //Only allow access if the request has a valid admin token
    const admin = await privileges.isAdmin(req);
    const user = req.headers.authorization;
    const educatorEmail = user.email;

    if(Number(admin) === Number(1)) {
        //Fetch all users and send them back in the response
        try{
            Class.find({educator: educatorEmail}).then((data)=>{
                res.send(data);
            })
                .catch((error)=>{
                    res.send({status: "error", data:error});
                });
        } catch(error) {
            res.sendStatus(500);
            return;
        }
    }
    else if(Number(admin) === Number(2)) {
        res.sendStatus(500);
        return;
    }
    else {
        res.sendStatus(403);
        return;
    }
})

module.exports = {
    createClass,
    removeClass,
    addStudent,
    // removeStudent,
    // getAllStudents,
    getAllClasses
}