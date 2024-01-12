const db=require ('../dbmethods/db.js');
function verifymail(req,res){
    const {token}=req.params;
    db.query("Update user set isverified=? where id=?",[1,token],(err,result,fields)=>{
        if(result.affectedRows)
        {
            res.redirect("http://localhost:5173");
        }
        else{
            res.end("<h1>404 Page not Found</h1>");
        }
    })
 }

 function verifyorder(req,res){
    const {token}=req.params;
    db.query("Update orders set status=?,dispatchedby=?,dispatchedto=? where order_id=? and status!=?",["Delivered",null,null,token,"Cancelled"],(err,result,fields)=>{
        if(!err)
        {
            res.redirect("http://localhost:5173");
        }
        else{
            res.end("<h1>404 Page not Found</h1>");
        }
    })
 }

 function checkuser(req,res){
    db.query("Select * from user where email=?",req.userId,(err,result)=>{
        res.end(JSON.stringify(result[0]));
    })
}


 module.exports={verifymail,verifyorder,checkuser}