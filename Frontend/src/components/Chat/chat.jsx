import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./chat.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import { RiSearchLine } from 'react-icons/ri';
import swal from "sweetalert2"
import createGroup from "../../controllers/group/createGroup.js";
import InfiniteScroll from "react-infinite-scroll-component";
import sendMessage from "../../controllers/group/sendMessage.js";
import getGroupChats from "../../controllers/group/getgroupchats.js";
import Logout from "../../controllers/logout/logout.js"
import { set } from "mongoose";
export default function Chat() {
    const [user, Setuser] = useState({});
    const [open, setOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [hasMessages,setHasMessages]=useState(true);
    const [start, setStart] = useState(0);
    const [HasMore, setHasMore] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState({});
    const [message, setMessage] = useState("");
    const [groupMsg, setGroupMsg] = useState([]);
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
            }).catch((err) => {
                navigate("/login");
            })
        }
    }, [])
    useEffect(() => {
        if (user.username) {
            fetch("http://localhost:3000/getusergroups", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ id: user.id })
            }).then((res) => {
                return res.json();
            })
                .then((data) => {
                    if (data.length > 0) {
                        groupChat(data[0])();
                        setGroups(data);
                    }
                    else{
                        setHasMessages(false);
                    }
                }).catch(() => {
                    swal.fire({
                        title: "Something Went Wrong",
                        icon: "error"
                    })
                })
        }
    }, [user.username])
    function handleOpen() {
        setOpen(!open);
    }
    function fetchMoreData() {
            console.log(start);
            getGroupChats({ groupId: selectedGroup.group_id, start: start })
            .then((data) => {
                if(data.length<10){
                    setHasMore(false);   
                }
                else{
                    setStart(start+10);
                }
                setGroupMsg([...groupMsg,...data]);
            }).catch((err) => {
                swal.fire({
                    title: err,
                    icon: "error"
                })
            })
            }
    function groupChat(element) {
        return function(){
        setHasMore(true);
        getGroupChats({ groupId: element.group_id, start: 0 })
            .then((data) => {
                setSelectedGroup(element);
                setGroupMsg(data);
                if(data.length<10){
                  setHasMore(false);   
                }
                else{
                setStart(10);
                }
            }).catch((err) => {
                swal.fire({
                    title: err,
                    icon: "error"
                })
            })
        }
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
    function changeMessage(e) {
        setMessage(e.target.value);
    }
    function changeSearchValue(e) {
        setSearchValue(e.target.value);
    }
    function changePassword() {
        navigate("/changepass");
    }
    async function create() {
        await swal.fire({
            title: 'Group Creation',
            html: '<label>Enter Group Name' +
                '<input id="swal-input1" class="swal2-input"><br><br>' +
                '<label>Enter Group Description' +
                '<input id="swal-input2" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ]
            }
        }).then((data) => {
            if (data.value == undefined || data.value[0].trim() == "" || data.value[1].trim() == "") {
                swal.fire({
                    title: "Please Fill All Details",
                    icon: "error"
                })
            }
            else {
                const [groupname, description] = data.value;
                createGroup({ groupname: groupname, description: description, userId: user.id })
                    .then((data) => {
                        swal.fire({
                            title: "Group Created Successfully",
                            icon: "success"
                        }).then(() => {
                            setGroups([...groups, data]);
                        })
                    }).catch((err) => {
                        swal.fire({
                            title: err,
                            icon: "error"
                        })
                    })
            }
        })
    }
    function invite() {
        navigate("/invite/" + selectedGroup.group_id);
    }
    function sendMsg() {
        if (message.trim() !== "") {
            sendMessage({ userId: user.id, groupId: selectedGroup.group_id, content: message }).
                then(() => {
                    const currentdate = new Date();
                    const date = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear();
                    const time = currentdate.getHours() + ":" + currentdate.getMinutes();
                    const messagedata = {
                        content: message,
                        user_id: user.id,
                        date: date,
                        time: time
                    }
                    setMessage("");
                    setGroupMsg([messagedata,messagedata]);
                })
                .catch((err) => {
                    swal.fire({
                        title: err,
                        icon: "error"
                    })
                })
        }
        else {
            swal.fire({
                title: "Please Enter Something",
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
                            <li onClick={create}>Create Group</li>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <h2 className={styles.form_head}>Welcome To Our Chatting Application</h2>
            <div className={styles.outer}>
                <ul className={styles.left}>
                    <li className={styles.groupHeading}>
                        <h2>Groups</h2>
                    </li>
                    {
                        groups.length ?
                            groups.map((element) => {
                                return (
                                    <li onClick={groupChat(element)} className={styles.groupList}>
                                        <h3>{element.group_name}</h3>
                                        <p>{element.description}</p>
                                    </li>
                                )
                            })
                            :
                            <h3 className={styles.nodata}>Nothing to show</h3>
                    }
                </ul>
                {
                hasMessages ?
                <div className={styles.right}>
                    <div className={styles.right_header}>
                        <h1 className={styles.groupName}>{selectedGroup.group_name}</h1>
                        <div className={styles.searchContainer}>
                            <div>
                                <input type="text" className={styles.search} name="search" value={searchValue} onChange={changeSearchValue} placeholder="Search.."></input>
                                <div className={styles.searchIcon}>
                                    <RiSearchLine className="search-icon" />
                                </div>
                            </div>
                        </div>
                        <div className={styles.inviteContainer}>
                            <button className={styles.invite} onClick={invite}>Invite Friends</button>
                        </div>
                    </div>
                    <ul id="messageList" className={styles.rightList}>
                        <InfiniteScroll 
                        dataLength={groupMsg.length}
                         hasMore={HasMore}
                          loader={<p>Loading...</p>}
                           next={fetchMoreData}
                           endMessage={
                            <p style={{ textAlign: 'center' }}>
                              <b>Yay! You have seen it all</b>
                            </p>
                          }
                          scrollableTarget="messageList"
                        style={{
                            display:"flex",
                            flexDirection:"column-reverse",
                        }}
                           >
                            {
                                groupMsg.map((element) => {
                                    return (
                                        <li className={styles.listItem}>
                                            <p className={styles.msgTime}>{element.date + "  " + element.time}</p>
                                            {
                                                element.user_id === user.id ?
                                                    <h3>You</h3> :
                                                    <h3>{element.username}</h3>
                                            }
                                            <p>{element.content}</p>
                                        </li>
                                    )
                                })
                            }
                        </InfiniteScroll>
                    </ul>
                    <div className={styles.msgContainer}>
                        <div className={styles.msgbox}>
                            <input type="text" value={message} placeholder="Enter Message" onChange={changeMessage} className={styles.messageInput}></input>
                        </div>
                        <div className={styles.sendContainer}>
                            <button className={styles.send} onClick={sendMsg}>Send</button>
                        </div>
                    </div>
                </div>
                :
                <div></div>
                        }
            </div>
        </>
    )
}