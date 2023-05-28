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
    const options = { weekday: 'short', month: 'short', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
});

app.use('/', require('../routes/pages'));
app.use('/auth', require('../routes/auth'));
app.use('/main', require('../routes/task-router'));

// app listen

app.listen(PORT, () => {
    console.log(`Server has been started @ Port ${PORT}`);
});
