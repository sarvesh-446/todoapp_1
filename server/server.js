const express = require("express");
const cors = require('cors')
const todoRoutes = require('./routes/todo')
const mongoose = require("mongoose");
const todo = require("./controllers/todo");
const connectMongoDB = require("./config/db");
require("dotenv").config();

const app = express();
app.use(express.json());



const PORT = process.env.PORT || 8000;


connectMongoDB()

app.use(cors({
	origin: [
		"http://localhost:3000"
	],
	credentials: true
}))

app.use('/api/todo', todoRoutes)



app.listen(PORT, () => {
	console.log(`Todo app server is listenting on port ${PORT}`);
});
