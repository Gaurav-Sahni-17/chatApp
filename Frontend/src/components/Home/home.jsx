import { Link } from "react-router-dom"
import style1 from "./home.module.css"
export default function Home() {
    return (
        <>
            <div className={style1.header}>
                <div className={style1.container}>
                    <div>
                        <h1 className={style1.h1}>Welcome to Our Chatting Application</h1>
                        <p className={style1.p}>Chat with your friends and family.</p>
                        <div className={style1.buttons}>
                            <Link to="/login" className={style1.loginbutton}>Login</Link>
                            <Link to="/signup" className={style1.signupbutton}>Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}