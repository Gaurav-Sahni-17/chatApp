const jwt = require("jsonwebtoken");
const db = require('../dbmethods/db.js');
const sendMail = require("../mailmethods/sendEmail.js");
function getallusers(req, res) {
    db.query("Select * from user", (err, result) => {
        res.end(JSON.stringify(result));
    })
}
function postsignup(req, res) {
    id = Date.now();
    const {email,region,username,password}=req.body;
    db.query("Select * from user where email=?", [email], (err, result, fields) => {
        if (result.length) {
            res.status(400).end();
        }
        else {
            db.query("Insert into user (username,email,password,id,region) values (?,?,?,?,?)", [username,email,password,id,region], (err, result, fields) => {
                if (result.affectedRows) {
                    let token =id;
                    let text = 'Enjoy chatting with our application with your friends and family.';
                    let subject = 'verification';
                    let html = `<h1>Verify quickly and start your chatting journey.<h1><h3>Click below to verify</h3><a href='http://127.0.0.1:3000/verifymail/${token}'>Click Here</a>`;
                    sendMail(req.body.email, subject, text, html, function (err, data) {
                        if (!err) {
                            res.status(200).end();
                        }
                    })
                }
            })
        }
    })
}


function postlogin(req, res) {
    db.query("Select * from user where email=? and password=?", [req.body.email, req.body.password], (err, result) => {
        if (result.length) {
            id = result[0].email;
            const token = jwt.sign({ id }, "jwtSecret");
            user = result[0];
            if (user.isverified) {
               res.status(200).send(JSON.stringify(token));
            }
            else {
                res.status(401).end();
            }
        }
        else {
            res.status(402).end;
        }
    })
}


module.exports = { getallusers, postsignup, postlogin }