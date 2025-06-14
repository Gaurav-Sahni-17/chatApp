const sendMail = require("../mailmethods/sendEmail.js");
const db = require('../dbmethods/db.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
async function postchangepass(req, res) {
    const { password } = req.body;
    const id = req.userId;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const encpassword = hash;
    db.query("Update user set password=? where email=?", [encpassword, id], (err, result) => {
        if (result.affectedRows) {
            let subject = 'Password changed';
            let text = `<h1>Password Changed.<h1><h3>Your password has been changed successfully</h3>`;
            try{
                sendMail(email, subject, text);
                res.status(200).end();
            }
            catch(err){
                res.status(200).end();
            }
        }
    })
}


function postforgot(req, res) {
    const { email } = req.body;
    db.query("Select id from user where email=?", [email], (err, result) => {
        if (result.length > 0) {
            let id = email;
            let token = jwt.sign({ id }, "jwtSecret");
            token = token.replaceAll(".", "_____");
            let text = `<h3>Click below to reset your password</h3><a href=http://localhost:5173/changepass/${token}>Click here</a>`;
            let subject = 'Forgot password';
            // let html = `<h1>Forgot Password<h1>'>Click Here</a>`;
            try{
                sendMail(email, subject, text);
                res.status(200).end();
            }
            catch(err){
                res.status(200).end();
            }
        }
    })
}


module.exports = { postchangepass, postforgot }