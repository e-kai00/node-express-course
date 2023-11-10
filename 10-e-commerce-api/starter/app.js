require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authRoutes = require('./routes/authRoutes');
// packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


// middleware before routes
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// routes
app.use('/api/v1/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('e-commerce home page')
});

app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies)
    res.send('e-commerce home page')
})

// error handler needs to be the last one
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        });
    } catch(error){
        console.log(error)
    }
}

start();