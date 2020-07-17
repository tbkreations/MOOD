const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');

//initialize express instance
const app = express();

//config for env vars
const result = dotenv.config();
if (result.error) {
    throw result.error;
} //console.log(result.parsed);

//EJS Setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//Routers
app.use('/', require('./routes/index.js'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started on Port ${PORT}...`));