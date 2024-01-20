const jwt = require("jsonwebtoken");
const db = require('../dbmethods/db.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sendMail = require("../mailmethods/sendEmail.js");
async function getusers(req, res) {
    const { id } = req.body;
    db.query("Select id,username,email from user where isverified=? and id not in (Select user_id from members where group_id=?)", [1, id], (err, result) => {
        res.end(JSON.stringify(result));
    })
}
function postsignup(req, res) {
    id = Date.now();
    const { email, region, username, password } = req.body;
    db.query("Select id from user where email=?", [email], async (err, result) => {
        if (result.length) {
            res.status(400).end();
        }
        else {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            const encpassword = hash;
            db.query("Insert into user (username,email,password,id,region) values (?,?,?,?,?)", [username, email, encpassword, id, region], (err, result, fields) => {
                if (result.affectedRows) {
                    let token = id;
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


async function postlogin(req, res) {
    const { email, password } = req.body;
    db.query("Select email,id,isverified,password from user where email=?", [email], async (err, result) => {
        if (err) {
            res.status(403).end();
        }
        else {
            if (result.length > 0) {
                user = result[0];
                if (user.isverified) {
                    const id = user.email;
                    const pass = user.password;
                    const passwordverify = await bcrypt.compare(password, pass);
                    if (passwordverify) {
                        const token = jwt.sign({ id }, "MySecretKey",{
                            expiresIn:"1800s"
                        });
                        res.status(200).send(JSON.stringify(token));
                    }
                    else {
                        res.status(402).end();
                    }
                }
                else {
                    res.status(401).end();
                }
            }
            else {
                res.status(402).end();
            }
        }
    })
}

function invitefriend(req, res) {
    const { userId, groupId, email, username } = req.body;
    let text = 'Enjoy chatting with our application with your friends and family.';
    let subject = 'Invitation';
    let html = `<h1>${username} has invited you to join his chatting group.</h1><h3>Click below to join</h3><a href='http://127.0.0.1:3000/join/${groupId}/${userId}'>Click Here</a>`;
    sendMail(email, subject, text, html, function (err, data) {
        if (!err) {
            res.status(200).end();
        }
        else {
            res.status(400).end();
        }
    })
}

function topusers(req, res) {
    const { start, end } = req.body;
    db.query(`select username,count(messages.user_id) as quantity from user left join messages on messages.user_id=user.id  WHERE date(msgTime) BETWEEN ? and ?  group by messages.user_id ORDER BY quantity DESC limit 0,5;`, [start, end], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            res.status(200).end(JSON.stringify(result));
        }
    })
}

module.exports = { getusers, postsignup, postlogin, invitefriend, topusers }