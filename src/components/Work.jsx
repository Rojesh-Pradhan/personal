import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './Work.module.css'
import { useSectionReveal } from '../hooks/useReveal'

const projects = [
  {
    num: '01',
    title: 'Customer Fraud Detection',
    category: 'ML Pipeline · Python · Spark',
    year: '2024',
    tb: 'Real-time',
    latency: '< 100ms',
    desc: 'End-to-end fraud detection pipeline ingesting transaction streams, feature engineering with PySpark, and serving predictions via a trained ML model. Flagged anomalies in real time for business analysts.',
    tags: ['PySpark', 'Kafka', 'Scikit-learn', 'Airflow', 'PostgreSQL'],
    color: '#63b3ed',
    wide: true,
    schema: 'SELECT txn_id, amount, is_fraud FROM transactions WHERE risk_score > 0.85;'
  },
  {
    num: '02',
    title: 'Daily ETL & Web Scraping',
    category: 'ETL · Scraping · Analytics',
    year: '2023–24',
    tb: 'Daily batch',
    latency: 'Overnight SLA',
    desc: 'Automated web scraping pipelines for a US-based client, extracting structured data daily. Transformed and loaded into a warehouse for downstream business analytics dashboards.',
    tags: ['Python', 'BeautifulSoup', 'Airflow', 'PostgreSQL', 'Superset'],
    color: '#68d391',
    wide: false,
    schema: "INSERT INTO scraped_data SELECT * FROM staging WHERE scraped_at::date = current_date;"
  },
  {
    num: '03',
    title: 'Ride-Sharing Income Predictor',
    category: 'ML · Flask · BSc Major Project',
    year: '2024',
    tb: 'App + Model',
    latency: 'BSc Major Project',
    desc: 'Full-stack ride-sharing app with an integrated ML model predicting expected rider income based on route, time, and historical trip data.',
    tags: ['Python', 'Scikit-learn', 'Flask', 'JavaScript', 'SQLite'],
    color: '#f6ad55',
    wide: false,
    schema: "SELECT predicted_income FROM model_output WHERE rider_id = :id AND route = :route;"
  },
  {
    num: '04',
    title: 'E-Commerce Platform',
    category: 'Full Stack · JavaScript · Group',
    year: '2023',
    tb: 'Web App',
    latency: 'University Group',
    desc: 'Collaborative group project building a full e-commerce website from scratch using vanilla JavaScript with product listings, cart, checkout flow, and order management.',
    tags: ['JavaScript', 'HTML', 'CSS', 'Node.js', 'MySQL'],
    color: '#b794f4',
    wide: false,
    schema: "SELECT p.name, o.quantity, o.total FROM orders o JOIN products p ON o.product_id = p.id;"
  },
]

function ProjectCard({ project: p, isWide }) {
  const [hovered, setHovered]   = useState(false)
  const [tilt, setTilt]         = useState({ x: 0, y: 0 })
  const [schemaText, setSchema] = useState('')
  const cardRef = useRef(null)
  const schemaRef = useRef(null)

  /* Tilt on mouse move */
  const onMove = useCallback(e => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8
    setTilt({ x: -y, y: x })
  }, [])

  const onEnter = () => setHovered(true)
  const onLeave = () => { setHovered(false); setTilt({ x: 0, y: 0 }) }

  /* Typewriter on schema hover */
  useEffect(() => {
    if (!hovered) { setSchema(''); return }
    let i = 0
    const full = p.schema
    schemaRef.current = setInterval(() => {
      setSchema(full.slice(0, i + 1)); i++
      if (i >= full.length) clearInterval(schemaRef.current)
    }, 22)
    return () => clearInterval(schemaRef.current)
  }, [hovered, p.schema])

  const tiltStyle = {
    transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.015 : 1})`,
    transition: hovered ? 'transform 0.1s ease' : 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
  }

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isWide ? styles.wide : ''}`}
      style={tiltStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      data-cursor>

      <div className={styles.cardBg} style={{'--c': p.color}}>
        <div className={styles.bgGrid}/>
        <div className={styles.bgGlow} style={{
          background: `radial-gradient(ellipse 60% 60% at 80% 20%, color-mix(in srgb, ${p.color} 14%, transparent), transparent)`
        }}/>
      </div>

      {/* Schema typewriter */}
      <div className={`${styles.schemaSnippet} ${hovered ? styles.schemaVisible : ''}`}>
        <span className={styles.schemaComment}>-- {p.category}</span>
        <span className={styles.schemaCode}>{schemaText}<span className={styles.schemaCursor}>▋</span></span>
      </div>

      <div className={styles.statsRow}>
        <span className={styles.statChip}><span className={styles.statKey}>type:</span> {p.tb}</span>
        <span className={styles.statChip}><span className={styles.statKey}>sla:</span> {p.latency}</span>
      </div>

      {/* Overlay with staggered tags */}
      <div className={`${styles.overlay} ${hovered ? styles.overlayVisible : ''}`}>
        <div className={styles.tags}>
          {p.tags.map((t, i) => (
            <span key={t} className={styles.tag} style={{ '--ti': i, '--c': p.color }}>{t}</span>
          ))}
        </div>
        <p className={styles.desc}>{p.desc}</p>
        <a href="#" className={styles.link} style={{ '--c': p.color }}>
          view_project() <span className={styles.linkArrow}>→</span>
        </a>
      </div>

      {/* Label */}
      <div className={`${styles.label} ${hovered ? styles.labelHidden : ''}`}>
        <span className={styles.labelNum} style={{color: p.color}}>{p.num}</span>
        <div>
          <div className={styles.title}>{p.title}</div>
          <div className={styles.category}>{p.category} · {p.year}</div>
        </div>
        <span className={styles.labelArrow} style={{color: p.color}}>↗</span>
      </div>

      {/* Color accent bar */}
      <div className={`${styles.accentBar} ${hovered ? styles.accentBarVisible : ''}`}
           style={{'--c': p.color}}/>
    </div>
  )
}

export default function Work() {
  const ref = useRef(null)
  useSectionReveal(ref)
  const wide = projects.filter(p => p.wide)
  const grid = projects.filter(p => !p.wide)

  return (
    <section className={styles.work} id="work" ref={ref}>
      <div className="section-label reveal">pipeline.projects</div>
      {wide.map(p => (
        <div key={p.num} className="reveal reveal-delay-1">
          <ProjectCard project={p} isWide />
        </div>
      ))}
      <div className={styles.grid}>
        {grid.map((p, i) => (
          <div key={p.num} className={`reveal reveal-scale reveal-delay-${i + 1}`}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
  )
}