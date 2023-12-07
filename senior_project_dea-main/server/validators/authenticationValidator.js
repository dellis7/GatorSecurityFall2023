//ENV preparation
const dotenv = require("dotenv")
dotenv.config('./.env')

//JWT information
const jwtObj = require("jsonwebtoken");
const Jwt_secret_Obj = process.env.JWT_SECRET;
const { header } = require('express-validator')

const parseHeader = (value) => value.split(' ')[1]
const validateToken = (value) => jwtObj.verify(value, Jwt_secret_Obj)
  

exports.validateAuthorizationHeader = [ 
    header('Authorization').exists().notEmpty().withMessage("Authorization token required").bail()
    .contains("Bearer ").withMessage("Bearer authentication required")
    .customSanitizer(parseHeader)
    .custom(validateToken) // this checks to see if the token is valid
    .customSanitizer(validateToken) // this will set the header to the parsed token
]
