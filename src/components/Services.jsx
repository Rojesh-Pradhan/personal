import { useRef, useState, useCallback } from 'react'
import styles from './Services.module.css'
import { useSectionReveal } from '../hooks/useReveal'

const stack = [
  { num: '01', category: 'Ingestion & Integration',    icon: '⟨/⟩', color: '#63b3ed', tools: ['Apache Kafka', 'Airbyte', 'REST APIs', 'Web Scraping', 'BeautifulSoup'] },
  { num: '02', category: 'Processing & Transformation', icon: '◈',   color: '#68d391', tools: ['Apache Spark', 'PySpark', 'pandas', 'dbt', 'SQL'] },
  { num: '03', category: 'Storage & Warehousing',       icon: '▣',   color: '#f6ad55', tools: ['Snowflake', 'PostgreSQL', 'AWS S3', 'BigQuery', 'Redshift'] },
  { num: '04', category: 'Orchestration & Ops',         icon: '◎',   color: '#b794f4', tools: ['Apache Airflow', 'Prefect', 'Docker', 'GitHub Actions', 'Terraform'] },
  { num: '05', category: 'Analytics & Viz',             icon: '◑',   color: '#fc8181', tools: ['Apache Superset', 'Tableau', 'Power BI', 'Metabase'] },
  { num: '06', category: 'Languages & ML',              icon: '⟡',   color: '#f6ad55', tools: ['Python', 'SQL', 'Scikit-learn', 'TensorFlow', 'JavaScript'] },
]

function ServiceCard({ s, i }) {
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const ref = useRef(null)

  const onMove = useCallback(e => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    })
  }, [])

  return (
    <div
      ref={ref}
      className={`${styles.item} reveal reveal-delay-${(i % 3) + 1}`}
      style={{ '--c': s.color, '--gx': `${pos.x}%`, '--gy': `${pos.y}%` }}
      onMouseMove={onMove}>
      <div className={styles.glow}/>
      <div className={styles.itemTop}>
        <span className={styles.itemNum}>{s.num}</span>
        <span className={styles.itemIcon}>{s.icon}</span>
      </div>
      <h3 className={styles.itemTitle}>{s.category}</h3>
      <div className={styles.tools}>
        {s.tools.map((t, j) => (
          <span key={t} className={styles.tool} style={{ '--tdi': j }}>{t}</span>
        ))}
      </div>
      <div className={styles.itemBar}/>
    </div>
  )
}

export default function Services() {
  const ref = useRef(null)
  useSectionReveal(ref)

  return (
    <section className={styles.services} id="services" ref={ref}>
      <div className={styles.header}>
        <div className="section-label reveal">stack.capabilities</div>
        <h2 className={`${styles.heading} reveal reveal-delay-1`}>
          Tools I work<br /><em>with daily</em>
        </h2>
      </div>
      <div className={styles.grid}>
        {stack.map((s, i) => <ServiceCard key={s.num} s={s} i={i} />)}
      </div>
    </section>
  )
}