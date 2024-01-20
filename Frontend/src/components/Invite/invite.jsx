import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./invite.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import Logout from "../../controllers/logout/logout.js"
import inviteFriend from "../../controllers/group/invitefriend.js";
export default function Chat() {
    const [user, Setuser] = useState({});
    const [open, setOpen] = useState(false);
    const [userdetails, setUserDetails] = useState([]);
    const { id } = useParams();
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
    useEffect(() => {
        if (user.username) {
            fetch("http://localhost:3000/getusers", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ id: id })
            }).then((res) => {
                return res.json();
            })
                .then((data) => {
                    setUserDetails(data);
                }).catch(() => {
                    swal.fire({
                        title: "Something Went Wrong",
                        icon: "error"
                    }).then(() => {
                        navigate("/login");
                    })
                })
        }
    }, [user.username])
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
    function sendInvite(element) {
        return function () {
            inviteFriend({ userId: element.id, groupId: id, email: element.email, username: user.username })
                .then(() => {
                    swal.fire({
                        title: "Invite send successfully",
                        icon: "success"
                    }).then(() => {
                        setUserDetails(userdetails.filter((data) => {
                            return data.id != element.id;
                        }))
                    })
                }).catch((err) => {
                    swal.fire({
                        title: err,
                        icon: "error"
                    })
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
                <caption className={styles.caption} >Invite Friends</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Email</th>
                    <th className={`${styles.cell} ${styles.height}`}>Action</th>
                </tr>
                {
                    userdetails.length > 0 ?
                        userdetails.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.id}</td>
                                    <td className={styles.cell}>{element.username}</td>
                                    <td className={styles.cell}>{element.email}</td>
                                    <td className={styles.cell}><button onClick={sendInvite(element)}>Invite +</button></td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Friends to Invite</tr>
                }
            </table>
        </>
    )
}