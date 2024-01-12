import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import styles from "./forgot.module.css"
import forgot from "../../controllers/password/forgot.js";
export default function Forgot() {
    const [data, setData] = useState({ email: "" })
    const [error, setError] = useState("");
    const navigate = useNavigate();
    function changeData(value) {
        return function (e) {
            setData({ ...data, [value]: e.target.value });
        }
    }
    function submit() {
        if (data.email !== "") {
            forgot(data)
                .then(() => {
                    navigate("/checkMail");
                }).catch((data) => {
                    setError(data);
                })
        }
        else {
            setError("Please fill all details");
        }
    }
    return (
        <>
            <h1 className={styles.h1}>Welcome to the portal</h1>
            <Link to="/"><button className={styles.home}>Home</button></Link>
            <div className={styles.outer}>
                <div className={styles.container}>
                    <h2>Reset Password</h2>
                    <div className={styles.form}>
                        <div className={styles.formgroup}>
                            <label for="email">Email</label>
                            <input type="email" id="email" value={data.email} onChange={changeData("email")} placeholder="Enter your email" />
                        </div>
                        <div className={styles.btncontainer}>
                            <button type="button" onClick={submit}>Submit</button>
                        </div>
                    </div>
                    <p className={styles}>{error}</p>
                </div>
            </div>
        </>
    )
}