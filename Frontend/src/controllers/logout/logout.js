export default function logout() {
    return new Promise((resolve, reject) => {
        localStorage.removeItem("token")
        resolve();
    })
}