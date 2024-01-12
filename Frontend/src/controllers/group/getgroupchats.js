export default function getGroupChats(data) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/getgroupchats", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => {
            if(res.status==200){
                return res.json();
            }
            else{
                reject("Something Went Wrong");
            }
        }).then((data)=>{
                resolve(data);
        }).catch((err) => {
            reject("Something Went Wrong");
            return;
        })
    })
}