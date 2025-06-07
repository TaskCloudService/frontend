import SocialMedia from "../components/SocialMedia"
import styles from "./Footer.module.css"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.containerFooter}>

        <div className={styles.copyright}>Copyright © 2025 Peterdraw</div>
          <div className={styles.links}>
            <a href="#privacy" className={styles.link}>
              Privacy Policy
            </a>
            <a href="#terms" className={styles.link}>
              Terms and Conditions
            </a>
            <a href="#contact" className={styles.link}>
              Contact
            </a>
          </div>
          <div className={styles.socialLinks}>
            <SocialMedia />
          </div>
      </div>
    </footer>
  )
}
