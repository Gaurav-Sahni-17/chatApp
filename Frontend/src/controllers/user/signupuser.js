export default function signupuser(data) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => {
            if (res.status === 201) {
                resolve();
                return;
            }
            else {
                reject("Email Already Exists");
            }
        }).catch((err) => {
            reject("Something Went Wrong");
        })
    })
}