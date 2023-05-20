'use strict';

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');


const app = express();

const PORT = process.env.PORT || 80

dotenv.config({
    path: './src/.env',
});

const {database} = require('../database/database');


app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// handlebars

const location = path.join(__dirname, '../public');

app.use(express.static(location));
app.set('view engine', 'hbs');

const partialsPath = path.join(__dirname, '../views/partials');
hbs.registerPartials(partialsPath);

app.use('/', require('../routes/pages'));
app.use('/auth', require('../routes/auth'));
app.use('/main', require('../routes/task-router'));

// app listen

app.listen(PORT, () => {
    console.log(`Server has been started @ Port ${PORT}`);
});
