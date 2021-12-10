const path = require("path");
const express = require("express");
const expressSession = require("express-session");
const sequelizeSession = require("connect-session-sequelize")(expressSession.Store);
const sequelize = require("./config/connection.js");

// Server config for handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

// Set up sessions with cookies
const sess = {
    secret: "something to change",
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new sequelizeSession({
      db: sequelize,
    }),
};

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public/')));

app.use(expressSession(sess));

// Set Handlebars as the default template engine.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const routes = require("./controllers");
app.use(routes);

// Starts the server to begin listening
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });