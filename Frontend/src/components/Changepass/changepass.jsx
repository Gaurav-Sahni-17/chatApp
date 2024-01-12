import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./changepass.module.css"
import changepass from "../../controllers/password/changepass.js";
import swal from "sweetalert2"
export default function changePassword() {
    const [data, setData] = useState({ new: "", confirm: "" })
    const [error, setError] = useState("");
    let { token } = useParams();
    if (token) {
        token = token.replaceAll("_____", ".");
    }
    const navigate = useNavigate();
    function changeData(value) {
        return function (e) {
            setData({ ...data, [value]: e.target.value });
        }
    }
    function changePassword() {
        if (data.new !== "" && data.confirm !== "") {
            if (data.new == data.confirm) {
                if (!token) {
                    token = localStorage.getItem("token");
                }
                if (data.new.match("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}"))
                    changepass({ password: data.new, token: token })
                        .then(() => {
                            swal.fire({
                                title: "Password Changed Successfully",
                                icon: "successs",
                            }).then(() => {
                                localStorage.removeItem("token");
                                navigate("/login");
                            })
                        }).catch((data) => {
                            setError(data);
                        })
                else {
                    setError("Password too weak");
                }
            }
            else {
                setError("Passwords don't match")
            }
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
                            <label for="new">New Password</label>
                            <input type="password" id="new" onChange={changeData("new")} value={data.new} placeholder="Enter new Password" />
                        </div>
                        <div className={styles.formgroup}>
                            <label for="confirm">Confirm Password</label>
                            <input type="password" id="confirm" value={data.confirm} onChange={changeData("confirm")} placeholder="Confirm password" />
                        </div>
                        <div className={styles.btncontainer}>
                            <button type="button" onClick={changePassword}>Reset</button>
                        </div>
                    </div>
                    <p className={styles}>{error}</p>
                </div>
            </div>
        </>
    )
}