const sendMail = require("../mailmethods/sendEmail.js");
const db = require('../dbmethods/db.js');
const jwt = require("jsonwebtoken");
function postchangepass(req, res) {
    const { password } = req.body;
    const id = req.userId;
    db.query("Update user set password=? where email=?", [password, id], (err, result) => {
        if (result.affectedRows) {
            let text = 'password changed';
            let subject = 'Password changed';
            let html = `<h1>Password Changed.<h1><h3>Your password has been changed successfully</h3>`;
            sendMail(id, subject, text, html, function (err, data) {
                if (!err) {
                    res.status(200).end();
                }
            })
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
            let text = 'Forgot password';
            let subject = 'Forgot password';
            let html = `<h1>Forgot Password<h1><h3>Click below to reset your password</h3><a href='http://localhost:5173/changepass/${token}'>Click Here</a>`;
            sendMail(email, subject, text, html, function (err, data) {
                if (!err) {
                    res.status(200).end();
                }
            })
        }
    })
}


module.exports = { postchangepass, postforgot }