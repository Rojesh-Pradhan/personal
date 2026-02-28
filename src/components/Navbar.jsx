import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'

const links = [
  { label: 'Pipeline', href: 'work',     idx: '01' },
  { label: 'About',    href: 'about',    idx: '02' },
  { label: 'Stack',    href: 'services', idx: '03' },
  { label: 'Contact',  href: 'contact',  idx: '04' },
]

function TypedLogo() {
  const [text, setText] = useState('')
  const full = 'rojesh.db'
  useEffect(() => {
    let i = 0
    const t = setInterval(() => { setText(full.slice(0, i + 1)); i++; if (i >= full.length) clearInterval(t) }, 90)
    return () => clearInterval(t)
  }, [])
  return (
    <span className={styles.logoText}>
      <span className={styles.logoKw}>SELECT</span>{' '}
      <span className={styles.logoName}>{text}</span>
      <span className={styles.logoCursor}>|</span>
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [ping, setPing] = useState('--')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    const fakePing = () => setPing(`${Math.floor(Math.random() * 6 + 2)}ms`)
    fakePing()
    const interval = setInterval(fakePing, 2500)
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(interval) }
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}><TypedLogo /></div>
      <div className={styles.statusBar}>
        <span className={styles.statusItem}><span className={styles.dot} /><span>connected</span></span>
        <span className={styles.statusSep}>·</span>
        <span className={styles.statusItem}><span className={styles.kw}>ping:</span> {ping}</span>
        <span className={styles.statusSep}>·</span>
        <span className={styles.statusItem}><span className={styles.kw}>rows:</span> 2.4M</span>
      </div>
      <ul className={styles.links}>
        {links.map(l => (
          <li key={l.label}>
            <a href={`#${l.href}`} className={styles.navItem} data-cursor>
              <span className={styles.navIdx}>{l.idx}</span><span>{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <button className={`${styles.burger} ${menuOpen ? styles.open : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
        <span /><span /><span />
      </button>
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        {links.map(l => (
          <a key={l.label} href={`#${l.href}`} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <span className={styles.mobileIdx}>{l.idx}</span><span>{l.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}