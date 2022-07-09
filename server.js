const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
// const routes = require("./Controllers/index");

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
  secret: "super secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  })
};

const helpers = require("./utils/helpers");

app.use(session(sess));

const hbs = exphbs.create({ helpers });
// Inform Express.js which template engine we're using
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// console.log(path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));

// app.use(routes);
app.use(require("./controllers"));

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening on port " + PORT));
});

// { package.json info from previous project
//   "dependencies": {
//     "bcrypt": "^5.0.1",
//     "connect-session-sequelize": "^7.1.4",
//     "dotenv": "^16.0.1",
//     "express": "^4.18.1",
//     "express-handlebars": "^6.0.6",
//     "express-session": "^1.17.3",
//     "mysql2": "^2.3.3",
//     "nodemailer-express-handlebars": "^5.0.0",
//     "sequelize": "^6.21.0",
//     "session": "^0.1.0"
//   },
//   "scripts": {
//     "start": "node server.js",
//     "seed": "node seeds/seed.js",
//     "test": "echo\"Error: no test specified\" && exit 1"
//   },
//   "name": "budget-me-plz-app",
//   "description": "A web application that allows you to keep track of monthly expenses all in one place. This is a group project for the UT Austin Coding Bootcamp requiring our group to design and build our first full-stack web application using the MVC paradigm, creating our own server-side API, adding user authentication, and connecting to a database.",
//   "version": "1.0.0",
//   "main": "server.js",
//   "repository": {
//     "type": "git",
//     "url": "git+https://github.com/carissamero/Budget-Me-Plz-App.git"
//   },
//   "engines": {
//     "node": "16.15.0"
//   },
//   "author": "",
//   "license": "ISC",
//   "bugs": {
//     "url": "https://github.com/carissamero/Budget-Me-Plz-App/issues",
//     "homepage": "https://github.com/carissamero/Budget-Me-Plz-App#readme"
//   }
// }
