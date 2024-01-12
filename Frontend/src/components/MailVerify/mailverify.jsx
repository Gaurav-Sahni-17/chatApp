import { Link } from "react-router-dom"
import styles from './mailverify.module.css'
export default function MailVerify() {
    return (
        <>
            <div className={styles.body}>
                <div className={styles.outer}>
                    <div className={styles.container}>
                        <h1 className={styles.h1}>Email Verification</h1>
                        <p className={styles.p}>Please verify your email address to proceed.</p>
                        <Link to="/"><button className={styles.button}>Home</button></Link>
                    </div>
                </div>
            </div>
        </>
    )
}