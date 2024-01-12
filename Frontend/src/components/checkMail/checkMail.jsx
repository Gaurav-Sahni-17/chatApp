import { Link } from "react-router-dom"
import styles from './checkmail.module.css'
export default function checkMail() {
    return (
        <>
            <div className={styles.body}>
                <div className={styles.outer}>
                    <div className={styles.container}>
                        <h1 className={styles.h1}>Forgot Password</h1>
                        <p className={styles.p}>Please check your email address to proceed.</p>
                        <Link to="/"><button className={styles.button}>Home</button></Link>
                    </div>
                </div>
            </div>
        </>
    )
}