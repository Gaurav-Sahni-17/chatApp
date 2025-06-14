const express = require('express');
const cors = require('cors');
const cookieParser=require("cookie-parser")
const jwt = require('jsonwebtoken');
const db = require("./dbmethods/db.js")
const { postchangepass, postforgot } = require("./controllers/passwordmanagement.js");
const { getusers, postsignup, postlogin,invitefriend, topusers } = require("./controllers/user.js");
const { verifymail, verifyorder, checkuser } = require("./controllers/verification.js")
const {creategroup,getusergroups,join, topgroups}=require('./controllers/group.js')
const {sendMessage, getGroupChats}=require('./controllers/message.js');
const { topregions } = require('./controllers/region.js');
const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const verifyJWT = (req, res, next) => {
    const token = req.headers['token'];
    jwt.verify(token,"MySecretKey", (err, decoded) => {
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

app.post("/invitefriend",invitefriend);

app.get("/verifyorder/:token", verifyorder);

app.post("/changepass", verifyJWT, postchangepass);

app.post("/forgot", postforgot);

app.post("/getusers", getusers);

app.get("/join/:groupId/:userId",join);

app.post("/creategroup",creategroup);

app.post("/getusergroups",getusergroups);

app.post("/sendmessage",sendMessage);

app.post("/getgroupchats",getGroupChats);

app.post("/topgroups",topgroups);

app.post("/topusers",topusers);

app.post("/topregions",topregions);

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("db connected");
    app.listen(3000, () => {
        console.log("Listening at port 3000");
    })
})
