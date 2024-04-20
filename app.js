require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const conectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const port = process.env.PORT || 3000;

// Connect to Database
conectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session
app.use(require('express-session')({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

// Static Files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});