import { useState, useEffect, useRef } from 'react'
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
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`${styles.card} ${isWide ? styles.wide : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor>
      <div className={styles.cardBg} style={{'--c': p.color}}>
        <div className={styles.bgGrid}/>
        <div className={styles.bgGlow} style={{
          background: `radial-gradient(ellipse 60% 60% at 80% 20%, color-mix(in srgb, ${p.color} 12%, transparent), transparent)`
        }}/>
      </div>

      <div className={`${styles.schemaSnippet} ${hovered ? styles.schemaVisible : ''}`}>
        <span className={styles.schemaComment}>-- {p.category}</span>
        <span className={styles.schemaCode}>{p.schema}</span>
      </div>

      <div className={styles.statsRow}>
        <span className={styles.statChip}><span className={styles.statKey}>type:</span> {p.tb}</span>
        <span className={styles.statChip}><span className={styles.statKey}>sla:</span> {p.latency}</span>
      </div>

      <div className={`${styles.overlay} ${hovered ? styles.overlayVisible : ''}`}>
        <div className={styles.tags}>
          {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
        <p className={styles.desc}>{p.desc}</p>
        <a href="#" className={styles.link}>
          view_project() <span className={styles.linkArrow}>→</span>
        </a>
      </div>

      <div className={`${styles.label} ${hovered ? styles.labelHidden : ''}`}>
        <span className={styles.labelNum} style={{color: p.color}}>{p.num}</span>
        <div>
          <div className={styles.title}>{p.title}</div>
          <div className={styles.category}>{p.category} · {p.year}</div>
        </div>
        <span className={styles.labelArrow} style={{color: p.color}}>↗</span>
      </div>
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