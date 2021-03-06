let express = require("express");
let bodyParser = require("body-parser");
let path = require("path");
let expressHbs = require("express-handlebars");
let session = require("express-session");
let messageRouter = require("./routes/message");
let loginRouter = require("./routes/login");
let homeRouter = require("./routes/home");
const postRouter = require("./routes/post");
const profileRouter = require("./routes/profile");

// helper function of handler bars
const helpers = require("./util/hbsHelpers");

let app = express();
let db = require("./util/database");

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: helpers
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(loginRouter);
app.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.redirect(301, "/");
  }
});
app.use("/home", homeRouter);
app.use("/messages", messageRouter);
app.use("/posts", postRouter);
app.use(profileRouter);

app.listen(port, () => console.log(`Server is listening on: ${port}`));
