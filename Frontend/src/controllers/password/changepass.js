export default function changepass(data) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/changepass", {
            method: "POST",
            headers: { token: data.token, 'Content-Type': 'application/json' },
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