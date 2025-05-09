import styles from "../styles/Footer.module.css"

export function Footer() {
  return (
    <footer className={styles.footer}>
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
        <a href="#facebook" className={styles.socialLink}>
          <span className="icon icon-facebook"></span>
        </a>
        <a href="#twitter" className={styles.socialLink}>
          <span className="icon icon-twitter"></span>
        </a>
        <a href="#instagram" className={styles.socialLink}>
          <span className="icon icon-instagram"></span>
        </a>
        <a href="#youtube" className={styles.socialLink}>
          <span className="icon icon-youtube"></span>
        </a>
        <a href="#linkedin" className={styles.socialLink}>
          <span className="icon icon-linkedin"></span>
        </a>
      </div>
    </footer>
  )
}
