const express = require('express');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const upload = multer({ dest: "uploads" })
const db = require("./dbmethods/db.js")
const { postchangepass, postforgot } = require("./controllers/passwordmanagement.js");
const { getallusers, postsignup, postlogin } = require("./controllers/user.js");
const { verifymail, verifyorder, checkuser } = require("./controllers/verification.js")
const {creategroup}=require('./controllers/group.js')
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const verifyJWT = (req, res, next) => {
    const token = req.headers['token'];
    jwt.verify(token, "jwtSecret", (err, decoded) => {
        if (err) {
            return res.status(401).end();
        }
        else {
            req.userId = decoded.id;
            next();
        }
    })
}

app.post("/signup", postsignup);

app.post("/login", postlogin);

app.get("/checkuser", verifyJWT, checkuser);

app.get("/verifymail/:token", verifymail);

app.get("/verifyorder/:token", verifyorder);

app.post("/changepass", verifyJWT, postchangepass);

app.post("/forgot", postforgot);

app.get("/getallusers", getallusers);

app.post("/creategroup",creategroup);

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("db connected");
    app.listen(3000, () => {
        console.log("Listening at port 3000");
    })
})
