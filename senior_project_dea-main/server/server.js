const cors = require("cors")
const express = require("express")

const server = express()
server.use(cors());
server.use(express.json())

const userRoutes = require('./routers/users')
const questionRoutes = require('./routers/questions')

const connectDb = require('./database/conn')
connectDb()

//Tell server to listen on port 5000
server.listen(5000, ()=>{
    console.log("Server started on port 5000");
})

server.use('/users', userRoutes)
server.use('/questions', questionRoutes)

