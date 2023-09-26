require('dotenv').config();
require('express-async-errors')
const express = require('express');
const app = express();
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

// middleware
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use('/api/v1/products', productsRouter)

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.POST || 3000;

const start = async () => {
    try {
        // connect to DB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on: ${port}...`))
    } catch {
        console.log(error)
    }
}

start()