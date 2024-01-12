export default function forgot(data) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/forgot", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => {
            if (res.status === 200) {
                resolve();
                return;
            }
        }).catch((err) => {
            reject("Something Went Wrong");
            return;
        })
    })
}