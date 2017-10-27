require("dotenv").config();
const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  port = 3030,
  session = require("express-session"),
  passport = require("passport"),
  Auth0Strategy = require("passport-auth0"),
  massive = require("massive");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

massive(process.env.CONNECTION_STRING).then(db => {
  app.set("db", db);
});

passport.use(
  new Auth0Strategy(
    {
      domain: process.env.AUTH_DOMAIN,
      clientID: process.env.AUTH_CLIENTID,
      clientSecret: process.env.AUTH_CLIENTSECRET,
      callbackURL: process.env.AUTH_CALLBACK
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      //check if user exists in the user table
      //if they do, invoke done with users id
      //if not, then we will create new user
      //then invoke done with new users id
      const db = app.get("db");
      const userData = profile._json;
      db.find_user([userData.identities[0].user_id]).then(user => {
        if (user[0]) {
          return done(null, user[0].id);
        } else {
          db
            .create_user([
              userData.name,
              userData.email,
              userData.picture,
              userData.identities[0].user_id
            ])
            .then(user => {
                return done(null, user[0].id);
            });
        }
      });
    }
  )
);
passport.serializeUser(function(id, done) {
  done(null, id);
});
passport.deserializeUser(function(id, done) {
    app.get('db').find_session_user([id]).then(user => {
        done(null, user[0]);
    })
});

app.get("/auth", passport.authenticate("auth0"));
app.get(
  "/auth/callback",
  passport.authenticate("auth0", {
    successRedirect: "http://localhost:3000/#/private",
    failureRedirect: "/auth"
  })
);

app.get('/auth/me', (req, res)=> {
    if (req.user) {
        return res.status(200).send(req.user);
    } else {
        return res.status(401).send('Need to login.');
    }
})

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('http://localhost:3000/');
})

app.listen(port, () => console.log(`listening on port ${port}`));
