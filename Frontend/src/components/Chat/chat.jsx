import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./chat.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import createGroup from "../../controllers/group/createGroup.js";
import getGroupChats from "../../controllers/group/getgroupchats.js";
import Logout from "../../controllers/logout/logout.js"
export default function Chat() {
    const [user,Setuser]=useState({});
    const [open,setOpen]=useState(false);
    const [groups,setGroups]=useState([]);
    const [start,setStart]=useState(0);
    const [selectedGroup,setSelectedGroup]=useState("");
    const [groupMsg,setGroupMsg]=useState([]);
    const navigate=useNavigate();
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
                    Setuser({...data});
                }).catch((err) => {
                    navigate("/login");
                })
        }
    }, [])
    useEffect(()=>{
        if(user.username){
            fetch("http://localhost:3000/getusergroups")
            .then((data)=>{
                if(data.length>0){
                    setGroups(data);
                    setSelectedGroup(data[0].group_name);
                    getGroupChats({id:data[0].id,start:start})
                    .then((data)=>{
                           setGroupMsg(data);
                    }).catch((err)=>{
                        swal.fire({
                            title:err,
                            icon:"error"
                        })
                    })
                }
            })
        }
    },[user.username])
    function handleOpen(){
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
    function changePassword() {
        navigate("/changepass");
    }
    async function create(){
         await swal.fire({
            title: 'Group Creation',
            html:'<label>Enter Group Name'+
             '<input id="swal-input1" class="swal2-input"><br><br>' +
             '<label>Enter Group Description'+
              '<input id="swal-input2" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
              ]
            }
          }).then((data)=>{
            if(data.value==undefined || data.value[0].trim()=="" || data.value[1].trim()=="")
            {
                 swal.fire({
                    title:"Please Fill All Details",
                    icon:"error"
                 })
            }
            else{
                const [groupname,description]=data.value;
            createGroup({groupname:groupname,description:description,userId:user.id})
            .then((data)=>{
                swal.fire({
                    title:"Group Created Successfully",
                    icon:"success"
                }).then(()=>{
                    setGroups([...groups,data]);
                })
            }).catch((err)=>{
                swal.fire({
                    title:err,
                    icon:"error"
                })
            })
            }
          })
    }
    function getGroupData(element){
        return function(){
            setStart(0);
            getGroupChats({id:element.group_id,start:0}).then((data)=>{
                setGroupMsg(data)
            }).catch((err)=>{
                swal.fire({
                    title:err,
                    icon:"error"
                })
            })
        }
    }
    return (
        <>
        {console.log(groups)}
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
                    {
                       groups.length>0?
                       groups.forEach((element)=>{
                        <li onClick={getGroupData}>
                            <h3>{element.group_name}</h3>
                            <p>{element.description}</p>
                        </li>
                       })
                       :
                       <h3 className={styles.nodata}>Nothing to show</h3>
                    }
                </ul>
                <div className={styles.right}>
                 <ul>
                   {
                    groupMsg.forEach((element)=>{
                        <li>
                            <p>{element.message}</p>
                            <p>{element.date}+" " +{element.time}</p>
                        </li>
                    })
                   }
                </ul>
                </div>
            </div>
        </>
    )
}