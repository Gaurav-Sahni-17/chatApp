const db = require('../dbmethods/db.js');

function sendMessage(req, res) {
    const { groupId, userId, content } = req.body;
    db.query("Insert into messages (group_id,user_id,content) values (?,?,?)", [groupId, userId, content], (err, result) => {
        if (err) {
            res.status(401).end();
        }
        if (result.affectedRows) {
            res.status(200).end();
        }
        else {
            res.status(401).end();
        }
    })
}

function getGroupChats(req, res) {
    const { groupId, start, count } = req.body;
    db.query(`SELECT user_id,username,content,DATE_FORMAT(msgTime,"%d/%m/%Y") as date,TIME_FORMAT(msgTime,"%H:%i") as time from messages join user on user_id=id where group_id=? order by msgTime desc limit ?,? `, [groupId, start, count], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            res.status(200).end(JSON.stringify(result));
        }
    })
}
module.exports = { sendMessage, getGroupChats }