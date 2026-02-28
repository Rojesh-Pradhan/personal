import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.brandKw}>SELECT</span>
          <span className={styles.brandName}> rojesh.db</span>
          <p className={styles.tagline}>
            Engineering data pipelines that scale with your ambitions.
          </p>
        </div>

        <div className={styles.nav}>
          <div className={styles.navCol}>
            <div className={styles.navTitle}>navigate</div>
            {[
              { label: 'Pipeline', href: '#work' },
              { label: 'About',    href: '#about' },
              { label: 'Stack',    href: '#services' },
              { label: 'Contact',  href: '#contact' },
            ].map(l => (
              <a key={l.label} href={l.href} className={styles.navLink}>{l.label}</a>
            ))}
          </div>

          <div className={styles.navCol}>
            <div className={styles.navTitle}>connect</div>
            {[
              { label: 'Email',    href: 'mailto:hello@rojesh.dev' },
              { label: 'GitHub',   href: '#' },
              { label: 'LinkedIn', href: '#' },
            ].map(l => (
              <a key={l.label} href={l.href} className={styles.navLink}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copy}>
          © {new Date().getFullYear()} Rojesh Pradhananga
        </span>
        <span className={styles.location}>Stockholm, Sweden</span>
        <span className={styles.status}>
          <span className={styles.statusDot}/>
          available for work
        </span>
      </div>
    </footer>
  )
}