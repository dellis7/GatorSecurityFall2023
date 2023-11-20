//ENV preparation
const dotenv = require("dotenv")
dotenv.config('./.env')

//JWT information
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = process.env.JWT_SECRET;
const { header } = require('express-validator')

const parseToken = (value) => {
    console.log(value)
    return value.split(' ')[1]
}
const validateToken = (value) => {
    console.log(value)
    return jwtObj.verify(value, Jwt_secret_Obj)
  };
  

exports.validateAuthorizationHeader = [ 
    header('Authorization').exists().notEmpty().withMessage("Authorization token required").bail()
    .contains("Bearer ").withMessage("Bearer authentication required")
    .customSanitizer(parseToken)
    .custom(validateToken)
]
