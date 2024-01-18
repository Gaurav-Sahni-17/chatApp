export default function findTopRegions(data) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/topregions", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => {
            if (res.status == 200) {
                return res.json();
            }
            else {
                reject("Something Went Wrong");
            }
        }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("Something Went Wrong");
        })
    })
}