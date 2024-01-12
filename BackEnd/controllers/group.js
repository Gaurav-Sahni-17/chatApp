const { JsonWebTokenError } = require('jsonwebtoken');
const db = require('../dbmethods/db.js');
const sendMail = require("../mailmethods/sendEmail.js");
function creategroup(req, res) {
    const {groupname,description,userId}=req.body;
    const id=Date.now();
    db.query("Insert into groupdetails (group_id,group_name,description) values (?,?,?)",[id,groupname,description], (err, result) => {
        if(result?.affectedRows){
            db.query("Insert into members values(?,?)",[id,userId],(err,result)=>{
                if(result?.affectedRows){
                    res.status(200).send(JSON.stringify({group_id:id,group_name:groupname,description:description}));
                }
                else{
                    res.status(400).end();
                }
            })
        }
        else{
            res.status(400).end();
        }
    })
}
module.exports={creategroup}