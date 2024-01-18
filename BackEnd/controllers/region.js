const db = require('../dbmethods/db.js');
function topregions(req,res){
    const {start,end}=req.body;
    db.query(`select region,count(DISTINCT messages.user_id) as quantity from user left join messages on messages.user_id=user.id  WHERE date(msgTime) BETWEEN ? and ? group by region ORDER BY quantity DESC limit 0,5;`,[start,end], (err, result) => {
     if(err){
      res.status(400).end();
     } 
     else{
      res.status(200).end(JSON.stringify(result));
     }
  })
 }

 module.exports={topregions}