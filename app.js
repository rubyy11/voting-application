const express = require("express");
const app = express();
//var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
const { election, Admin,option,question,voters } = require("./models");
const bodyParser = require("body-parser");
const connectEnsureLogin = require("connect-ensure-login");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const flash = require("connect-flash");
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(cookieParser("hi hello"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.use(
    session({
      secret: "my-super-secret-key-65387687",
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  // app.use(function (request, response, next) {
  //   response.locals.messages = request.flash();
  //   next();
  // });

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (username, password, done) => {
        Admin.findOne({ where: { email: username} })
          .then(async function (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Not a Valid Password" });
            }
          })
          .catch((error) => {
            console.log(error);
            return done(null, false, { message: "Not a Valid voterId" });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing user in session", user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    Admin.findByPk(id)
      .then((user) => {
        done(null, user);
      })
      .catch((error) => {
        done(error, null);
      });
  });

app.get("/", async (request, response) => {
    
    response.render("index")
    // response.render("index");

  });
  app.get("/signup", (request, response) => {
    
      response.render("signup", {
        title: "Signup",
      // csrfToken: request.csrfToken(),
      });
    }
  );
  app.get("/login", (request, response) => {
    if (request.user && request.user.isAdmin) {
      response.redirect("/elections");
    } else {
      response.render("login", {
        title: "login",
      //  csrfToken:request.csrfToken(),
      });
    }
  });

  //sign in to next page
  app.use(express.static(path.join(__dirname, "public")));
  app.post(
    "/session",
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    (request, response) => {
      response.redirect("/elections");
    }
  );

  app.post("/users", async (request, response) => {
    const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
    console.log("PASSWORD IS", hashedPwd);
    try {
      const user = await Admin.create({
        fName: request.body.firstName,
        lName: request.body.lastName,
        email: request.body.email,
        password: hashedPwd,
      });
      request.login(user, (err) => {
        if (err) {
          console.log(err);
        }
         response.redirect("/elections");
      });
    } catch (error) {
      console.log(error);
      response.redirect("/signup");
    }
  });



  app.get("/elections", async (request, response) => {
    
  const allElection =await election.getElection()
    response.render("election",{allElection})
  });

  app.post(
    "/elections",
    connectEnsureLogin.ensureLoggedIn(),
    async function (request, response) {
      try {
        await election.addElection({
            electionName:request.body.name
        })

        return response.redirect("/elections")
    }
    catch(error){
        console.log(error);
    }
})
    
    app.get(
        "/election/:id",
        async (request, response) => {
          try {
            const { electionName, electionStatus } = await election.findByPk(
              request.params.id
            );
            const quesCount = await question.count({
              where: {
                electionId: request.params.id,
              },
            });
            const voterCount = await voters.count({
              where: {
                electionId: request.params.id,
              },
            });
      
            response.render("electionPage", {
              title: electionName,
              quesCount,
              voterCount,
              electionName,
              electionStatus,
              id: request.params.id,
            });
          } catch (error) {
            console.log(error);
          }
        }
      );
      
      app.get("/signout", (request, response, next) => {
        request.logout((err) => {
          if (err) {
            return next(err);
          }
          response.redirect("/");
        });
      });

      // deleting electionnn...
      app.delete(
        "/elections/:id",
        connectEnsureLogin.ensureLoggedIn(),
        async (request, response) => {
          try {
             await election.remove(request.params.id);
            return response.json({ success: true });
          } catch (error) {
            console.log(error);
          }
        }
      );




  module.exports = app;