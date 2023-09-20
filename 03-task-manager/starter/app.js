const express = require('express')
const app = express()
const tasks = require('./routes/tasks')
const connectDB = require('./db/connect')
require('dotenv').config()


// middleware to get data in req.body
app.use(express.json())

app.use('/api/v1/tasks', tasks)

// router 
app.get('/hello', (req, res) => {
    res.send('Task Manager app')
})

const port = 3000

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`Server is listening on port: ${port}...`))
    } catch(error){
        console.log(error)
    }
}

start()
