export default function loginuser(data) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => {
            console.log(res);
            if (res.status == 200) {
                return res.json();
            }
            else if (res.status == 401) {
                resolve("mailverify");
            }
            else if (res.status == 402) {
                reject("Invalid username and password");
            }
        }).then((data) => {
            localStorage.setItem("token", data);
            resolve("login");
        }).catch((err) => {
            reject("Something Went Wrong");

        })
    })
}