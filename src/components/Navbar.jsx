import { useEffect, useState, useRef } from 'react'
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
    const t = setInterval(() => {
      setText(full.slice(0, i + 1))
      i++
      if (i >= full.length) clearInterval(t)
    }, 90)
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
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [ping,       setPing]       = useState('--')
  const [active,     setActive]     = useState('')
  const [navVisible, setNavVisible] = useState(false)
  const prevScrollY = useRef(0)
  const [hideNav,    setHideNav]    = useState(false)

  /* ── Entrance animation ── */
  useEffect(() => {
    const t = setTimeout(() => setNavVisible(true), 120)
    return () => clearTimeout(t)
  }, [])

  /* ── Scroll: blur bg + hide-on-scroll-down ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      setHideNav(y > prevScrollY.current && y > 120)
      prevScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Active section tracking ── */
  useEffect(() => {
    const ids = links.map(l => l.href)
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  /* ── Fake ping ── */
  useEffect(() => {
    const fakePing = () => setPing(`${Math.floor(Math.random() * 6 + 2)}ms`)
    fakePing()
    const interval = setInterval(fakePing, 2500)
    return () => clearInterval(interval)
  }, [])

  /* ── Lock body scroll when menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={[
        styles.nav,
        scrolled   ? styles.scrolled  : '',
        hideNav    ? styles.hidden    : '',
        navVisible ? styles.visible   : '',
      ].join(' ')}>

        {/* Logo */}
        <div className={styles.logo}>
          <TypedLogo />
        </div>

        {/* Status bar */}
        <div className={styles.statusBar}>
          <span className={styles.statusItem}>
            <span className={styles.dot} />
            <span>connected</span>
          </span>
          <span className={styles.statusSep}>·</span>
          <span className={styles.statusItem}>
            <span className={styles.kw}>ping:</span> {ping}
          </span>
          <span className={styles.statusSep}>·</span>
          <span className={styles.statusItem}>
            <span className={styles.kw}>rows:</span> 2.4M
          </span>
        </div>

        {/* Desktop links */}
        <ul className={styles.links}>
          {links.map((l, i) => (
            <li key={l.label} style={{ '--i': i }}>
              <a
                href={`#${l.href}`}
                className={[styles.navItem, active === l.href ? styles.navItemActive : ''].join(' ')}
                data-cursor>
                <span className={styles.navIdx}>{l.idx}</span>
                <span>{l.label}</span>
                <span className={styles.navUnderline} />
              </a>
            </li>
          ))}
        </ul>

        {/* Burger */}
        <button
          className={[styles.burger, menuOpen ? styles.open : ''].join(' ')}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={[styles.mobileMenu, menuOpen ? styles.mobileOpen : ''].join(' ')}
        aria-hidden={!menuOpen}>

        {/* X close button */}
        <button className={styles.closeBtn} onClick={closeMenu} aria-label="Close menu">
          <span /><span />
        </button>

        {/* Terminal header */}
        <div className={styles.menuHeader}>
          <span className={styles.menuPrompt}>~/rojesh</span>
          <span className={styles.menuCaret}>▋</span>
        </div>

        {/* Nav links */}
        <nav className={styles.menuLinks}>
          {links.map((l, i) => (
            <a
              key={l.label}
              href={`#${l.href}`}
              className={[styles.mobileLink, active === l.href ? styles.mobileLinkActive : ''].join(' ')}
              style={{ '--mi': i }}
              onClick={closeMenu}>
              <span className={styles.mobileIdx}>{l.idx}</span>
              <span className={styles.mobileLinkText}>{l.label}</span>
              <span className={styles.mobileLinkArrow}>→</span>
            </a>
          ))}
        </nav>

        {/* Footer info */}
        <div className={styles.menuFooter}>
          <span className={styles.menuDot} />
          <span>open to work · Stockholm, SE</span>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  )
}