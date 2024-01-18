const db = require('../dbmethods/db.js');
function creategroup(req, res) {
    const { groupname, description, userId } = req.body;
    const id = Date.now();
    db.query("Insert into groupdetails (group_id,group_name,description) values (?,?,?)", [id, groupname, description], (err, result) => {
        if (result?.affectedRows) {
            db.query("Insert into members values(?,?)", [id, userId], (err, result) => {
                if (result?.affectedRows) {
                    res.status(200).send(JSON.stringify({ group_id: id, group_name: groupname, description: description }));
                }
                else {
                    res.status(400).end();
                }
            })
        }
        else {
            res.status(400).end();
        }
    })
}


function getusergroups(req, res) {
    const { id } = req.body;
    db.query("SELECT t1.group_id,t1.group_name,t1.description,COALESCE(t2.quantity,0) as messagecount from ((SELECT group_id,group_name,description from groupdetails where group_id in (SELECT group_id from members WHERE user_id=?)) as t1 left join (SELECT group_id,count(user_id) as quantity from messages where user_id=? group by group_id) as t2 on t1.group_id=t2.group_id)order by messagecount desc;", [id, id], (err, result) => {
        if (!err) {
            res.send(JSON.stringify(result));
        }
        else {
            res.status(500).end();
        }
    })
}

function join(req, res) {
    const { groupId, userId } = req.params;
    db.query("Insert into members values (?,?)", [groupId, userId], (err, result) => {
        if (err) {
            res.send("<h1>Error Occured</h1>");
        }
        if (result.affectedRows) {
            res.redirect("http://localhost:5173");
        }
        else {
            res.send("<h1>Error Occured</h1>");
        }
    })
}

function topgroups(req, res) {
    const { start, end } = req.body;
    db.query(`select group_name,count(messages.user_id) as quantity from groupdetails left join messages on messages.group_id=groupdetails.group_id  WHERE date(msgTime) BETWEEN ? and ?  group by messages.group_id ORDER BY quantity DESC limit 0,5;`, [start, end], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            res.status(200).end(JSON.stringify(result));
        }
    })
}

module.exports = { creategroup, getusergroups, join, topgroups }