var express = require("express");
var app = express();
var passport = require("passport");
var session = require("express-session");
var exphbs = require("express-handlebars");
var PORT = process.env.PORT || 5000;

//Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static("public"));
// For Passport
// session secret
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set("views", "./app/views");
app.engine(
  "hbs",
  exphbs({
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");

//Models
var models = require("./app/models");

//Routes
var authRoute = require("./app/routes/auth.js")(app, passport);
require("./app/routes/apiRoutes")(app);
require("./app/routes/htmlRoutes")(app);
//load passport strategies
require("./app/config/passport/passport.js")(passport, models.user);

// Sync Database and listen to local server
models.sequelize
  .sync()
  .then(function() {
    app.listen(PORT, function(err) {
      console.log("Server is running on port 5000 and database looks fine");
    });
  })
  .catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
  });
