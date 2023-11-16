//Imports
require("../schemas")
const privileges = require("../util/privileges")

const mongoose = require("mongoose")

//DB Models
const Class = mongoose.model("Classes")

//ENV preparation
const dotenv = require("dotenv")
dotenv.config('./.env')

//JWT information
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = process.env.JWT_SECRET;

//create class endpoint controller
const createClass = (async (req, res) => {

    const className = req.body.cname.toString();
    console.log(className);
    return res.send({status:"ok"});

    }
)

module.exports = {
    createClass,
    // removeClass,
    // addStudent,
    // removeStudent,
    // getAllStudents
}