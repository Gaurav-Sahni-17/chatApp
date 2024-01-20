import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./dashboard.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import Logout from "../../controllers/logout/logout.js"
import findTopGroups from "../../controllers/group/findTopGroups.js";
import findTopUsers from "../../controllers/user/findTopUsers.js";
import findTopRegions from "../../controllers/region/findTopRegions.js";
export default function Chat() {
    const [user, Setuser] = useState({});
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState({ from: "", to: "" });
    const [topusers, setTopUsers] = useState([]);
    const [topgroups, setTopGroups] = useState([]);
    const [topregions, setTopRegions] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch("http://localhost:3000/checkuser", {
                headers: {
                    token: token,
                }
            }).then((res) => {
                if (res.status === 401) {
                    navigate("/login");
                }
                return res.json();
            }).then((data) => {
                Setuser({ ...data });
            }).catch(() => {
                navigate("/login");
            })
        }
        else{
            navigate("/login");
        }
    }, [])
    function handleOpen() {
        setOpen(!open);
    }
    function logoutUser() {
        Logout().then(() => {
            navigate("/");
        }).catch(() => {
            swal.fire({
                icon: "error",
                title: "Failed to logout"
            })
        })
    }
    function goBack() {
        navigate("/chat");
    }
    function changePassword() {
        navigate("/changepass");
    }
    function changeDate(value) {
        return function (e) {
            setDate({ ...date, [value]: e.target.value })
        }
    }
    function find() {
        if (date.from !== "" && date.to !== "") {
            if (new Date(date.from) <= new Date(date.to)) {
                const input = { start: date.from, end: date.to }
                findTopGroups(input).then((data) => {
                    setTopGroups(data);
                    findTopUsers(input).then((data2) => {
                        setTopUsers(data2);
                        findTopRegions(input).then((data3) => {
                            setTopRegions(data3);
                            setVisible(true)
                        }).catch((err) => {
                            swal.fire({
                                title: err,
                                icon: "error"
                            })
                        })
                    }).catch((err) => {
                        swal.fire({
                            title: err,
                            icon: "error"
                        })
                    })
                }).catch((err) => {
                    swal.fire({
                        title: err,
                        icon: "error"
                    })
                })
            }
            else {
                swal.fire({
                    title: "Please Enter Valid Dates",
                    icon: "error"
                }).then(() => {
                    setDate({ from: "", to: "" })
                })
            }
        }
        else {
            swal.fire({
                title: "Please Fill All Details",
                icon: "error"
            })
        }
    }
    return (
        <>
            <div className={styles.head}>
                <h1 className={styles.heading}>Welcome {user.username}</h1>
                <div className={styles.dropdown}>
                    <button onClick={handleOpen} className={styles.dropbtn}>
                        <AiOutlineMenu />
                    </button>
                    {open ? (
                        <div className={styles.dropdown_content}>
                            <li onClick={logoutUser}>Logout</li>
                            <li onClick={changePassword}>Change Password</li>
                            <li onClick={goBack}>Go Back</li>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <h2 className={styles.form_head}>Welcome To Our Chatting Application</h2>
            <table className={styles.back}>
                <caption className={styles.caption} >Enter Date</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>From</th>
                    <th className={`${styles.cell} ${styles.height}`}>To</th>
                    <th className={`${styles.cell} ${styles.height}`}>Action</th>
                </tr>
                <tr>
                    <td className={styles.cell}><input type="date" value={date.from} onChange={changeDate("from")} /></td>
                    <td className={styles.cell}><input type="date" value={date.to} onChange={changeDate("to")} /></td>
                    <td className={styles.cell}><button onClick={find}>Find</button></td>
                </tr>
            </table>
            {
                visible ?
                    <>
                        <table className={`${styles.back} ${styles.back2}`}>
                            <caption className={styles.caption} >Top Groups</caption>
                            <tr className={`${styles.cell} ${styles.height}`}>
                                <th className={`${styles.cell} ${styles.height}`}>Group Name</th>
                                <th className={`${styles.cell} ${styles.height}`}>Number of Posts</th>
                            </tr>
                            {
                                topgroups.length > 0 ?
                                    topgroups.map((element) => {
                                        return (
                                            <tr>
                                                <td className={styles.cell}>{element.group_name}</td>
                                                <td className={styles.cell}>{element.quantity}</td>
                                            </tr>
                                        )
                                    }) :
                                    <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Groups to Show</tr>
                            }
                        </table>
                        <table className={`${styles.back} ${styles.back2}`}>
                            <caption className={styles.caption} >Top Users</caption>
                            <tr className={`${styles.cell} ${styles.height}`}>
                                <th className={`${styles.cell} ${styles.height}`}>User Name</th>
                                <th className={`${styles.cell} ${styles.height}`}>Number of Posts</th>
                            </tr>
                            {
                                topusers.length > 0 ?
                                    topusers.map((element) => {
                                        return (
                                            <tr>
                                                <td className={styles.cell}>{element.username}</td>
                                                <td className={styles.cell}>{element.quantity}</td>
                                            </tr>
                                        )
                                    }) :
                                    <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Users to Show</tr>
                            }
                        </table>
                        <table className={`${styles.back} ${styles.back2}`} style={{ marginBottom: 20 }}>
                            <caption className={styles.caption} >Top Regions</caption>
                            <tr className={`${styles.cell} ${styles.height}`}>
                                <th className={`${styles.cell} ${styles.height}`}>Region</th>
                                <th className={`${styles.cell} ${styles.height}`}>Number of Active Users</th>
                            </tr>
                            {
                                topregions.length > 0 ?
                                    topregions.map((element) => {
                                        return (
                                            <tr>
                                                <td className={styles.cell}>{element.region}</td>
                                                <td className={styles.cell}>{element.quantity}</td>
                                            </tr>
                                        )
                                    }) :
                                    <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Records to Show</tr>
                            }
                        </table>
                    </>
                    : <div></div>
            }
        </>
    )
}