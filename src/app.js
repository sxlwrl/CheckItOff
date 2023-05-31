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

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

// handlebars

const location = path.join(__dirname, '../public');

app.use(express.static(location));
app.set('view engine', 'hbs');

const partialsPath = path.join(__dirname, '../views/partials');
hbs.registerPartials(partialsPath);

hbs.registerHelper('formatDate', function(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
});

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (+arg1 === +arg2) ? options.fn(this) : options.inverse(this);
});

app.use('/', require('../routes/pages'));
app.use('/auth', require('../routes/auth'));
app.use('/main', require('../routes/task-router'));

// app listen

app.listen(PORT, () => {
    console.log(`Server has been started @ Port ${PORT}`);
});
