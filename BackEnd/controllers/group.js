const db = require('../dbmethods/db.js');
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


function getusergroups(req,res){
    const {id}=req.body;
    db.query("Select group_id,group_name,description from groupdetails where group_id in (Select group_id from members where user_id=?)",[id],(err,result)=>{
        if(!err){
            res.send(JSON.stringify(result));
        }
    })
}

function join(req,res){
    const {groupId,userId}=req.params;
    db.query("Insert into members values (?,?)",[groupId,userId],(err,result)=>{
        if(err){
            res.send("<h1>Error Occured</h1>"); 
        }
        if(result.affectedRows){
            res.redirect("http://localhost:5173");
        }
        else{
            res.send("<h1>Error Occured</h1>");
        }
    })
}
module.exports={creategroup,getusergroups,join}