export default function inviteFriend(data) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/invitefriend", {
            method: "POST",
            headers: { token: data.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => {
            if (res.status === 200) {
                resolve();
            }
            else if(res.status===402){
                reject("Be in your Limits.");
            }
            else {
                reject("Something Went Wrong");
            }
        }).catch((err) => {
            reject("Something Went Wrong");
        })
    })
}