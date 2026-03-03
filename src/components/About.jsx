import { useRef, useState, useEffect } from 'react'
import { useSectionReveal } from '../hooks/useReveal'
import styles from './About.module.css'

const skills = [
  { cat: 'Ingestion',     items: ['Kafka', 'Airbyte', 'REST APIs'] },
  { cat: 'Processing',    items: ['PySpark', 'pandas', 'dbt'] },
  { cat: 'Storage',       items: ['Snowflake', 'PostgreSQL', 'S3'] },
  { cat: 'Orchestration', items: ['Airflow', 'Prefect'] },
  { cat: 'Infra',         items: ['AWS', 'Docker', 'Terraform'] },
  { cat: 'Viz',           items: ['Superset', 'Tableau'] },
]

const timeline = [
  {
    year: '2025 →',
    role: 'MSc Computer & System Science',
    company: 'Stockholm University',
    tag: 'education',
    desc: 'Currently studying in Stockholm, Sweden. Started Sept 2025.',
  },
  {
    year: '2023 – 2024',
    role: 'Associate Data Engineer',
    company: 'Fusemachines Nepal',
    tag: 'work',
    desc: 'Web scraping pipelines for US clients. End-to-end analytics pipelines for business intelligence. Joined as trainee May 2023, promoted after probation.',
  },
  {
    year: '2021 – 2025',
    role: 'BSc Computing (Hons)',
    company: 'Leeds Beckett University',
    tag: 'education',
    desc: 'Major project: ride-sharing app with ML income prediction for riders. Group project: e-commerce site in JavaScript.',
  },
]

const tagColor = { work: '#63b3ed', education: '#68d391' }

/* Animated JSON card — types each line in */
function JsonCard() {
  const [visible, setVisible] = useState(0)
  const ref = useRef(null)

  const lines = [
    <><span className={styles.jBrace}>{'{'}</span></>,
    <><span className={styles.jKey}>&nbsp;&nbsp;"location"</span><span className={styles.jColon}>: </span><span className={styles.jStr}>"Stockholm, Sweden"</span><span className={styles.jComma}>,</span></>,
    <><span className={styles.jKey}>&nbsp;&nbsp;"degree"</span><span className={styles.jColon}>: </span><span className={styles.jStr}>"MSc CS @ Stockholm Uni"</span><span className={styles.jComma}>,</span></>,
    <><span className={styles.jKey}>&nbsp;&nbsp;"experience"</span><span className={styles.jColon}>: </span><span className={styles.jStr}>"1.5 years DE"</span><span className={styles.jComma}>,</span></>,
    <><span className={styles.jKey}>&nbsp;&nbsp;"open_to_work"</span><span className={styles.jColon}>: </span><span className={styles.jBool}>true</span><span className={styles.jComma}>,</span></>,
    <><span className={styles.jKey}>&nbsp;&nbsp;"prefers"</span><span className={styles.jColon}>: </span><span className={styles.jStr}>"remote / hybrid"</span></>,
    <><span className={styles.jBrace}>{'}'}</span></>,
  ]

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let i = 0
      const t = setInterval(() => {
        i++; setVisible(i)
        if (i >= lines.length) clearInterval(t)
      }, 120)
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className={`${styles.jsonCard} reveal reveal-right reveal-delay-2`} ref={ref}>
      {lines.slice(0, visible).map((line, i) => (
        <div key={i} className={`${styles.jsonLine} ${styles.jsonLineIn}`} style={{ '--ji': i }}>
          {line}
        </div>
      ))}
      {visible < lines.length && (
        <div className={styles.jsonLine}>
          <span className={styles.jsonCursor}>▋</span>
        </div>
      )}
    </div>
  )
}

/* Skill group with stagger on items */
function SkillGroup({ s, i }) {
  return (
    <div className={`${styles.skillGroup} reveal reveal-scale reveal-delay-${(i % 5) + 1}`}>
      <div className={styles.skillCat}>
        <span className={styles.skillIcon}>▸</span> {s.cat}
      </div>
      <div className={styles.skillItems}>
        {s.items.map((item, j) => (
          <span
            key={item}
            className={styles.skillPill}
            style={{ '--pi': j }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* Timeline item with animated connector line */
function TimelineItem({ t, i, total }) {
  const ref = useRef(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setDrawn(true); obs.disconnect() }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${styles.tlItem} reveal reveal-delay-${i + 1}`}>
      <div className={styles.tlLeft}>
        <div className={styles.tlYear}>{t.year}</div>
        <span className={styles.tlTag} style={{ '--tc': tagColor[t.tag] }}>{t.tag}</span>
      </div>
      <div className={styles.tlLine}>
        <div className={styles.tlDot} style={{ '--tc': tagColor[t.tag] }}/>
        {i < total - 1 && (
          <div className={`${styles.tlConnector} ${drawn ? styles.tlConnectorDrawn : ''}`}
               style={{ '--tc': tagColor[t.tag] }}/>
        )}
      </div>
      <div className={styles.tlContent}>
        <div className={styles.tlRole}>{t.role}</div>
        <div className={styles.tlCompany}>{t.company}</div>
        <div className={styles.tlDesc}>{t.desc}</div>
      </div>
    </div>
  )
}

export default function About() {
  const ref = useRef(null)
  useSectionReveal(ref)

  return (
    <section className={styles.about} id="about" ref={ref}>
      <div className="section-label reveal">about.profile</div>

      {/* Bio row */}
      <div className={styles.bioRow}>
        <div className={styles.bioLeft}>
          <h2 className={`${styles.heading} reveal reveal-left reveal-delay-1`}>
            Building pipelines<br /><em>that never sleep</em>
          </h2>
          <p className={`${styles.body} reveal reveal-delay-2`}>
            I'm Rojesh Pradhananga — a Data Engineer based in Stockholm, Sweden.
            I turn raw, messy data into reliable, scalable infrastructure that
            businesses can actually trust.
          </p>
          <p className={`${styles.body} reveal reveal-delay-3`}>
            I started at Fusemachines Nepal building scraping pipelines and analytics
            infrastructure for US clients. Now deepening my foundations with a
            Master's at Stockholm University.
          </p>
        </div>
        <JsonCard />
      </div>

      {/* Skills */}
      <div className={styles.skillsSection}>
        <div className={`${styles.sectionTitle} reveal`}>
          <span className={styles.sectionTitleKw}>//</span> stack
        </div>
        <div className={styles.skillGrid}>
          {skills.map((s, i) => <SkillGroup key={s.cat} s={s} i={i} />)}
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.timelineSection}>
        <div className={`${styles.sectionTitle} reveal`}>
          <span className={styles.sectionTitleKw}>//</span> experience
        </div>
        <div className={styles.timeline}>
          {timeline.map((t, i) => (
            <TimelineItem key={i} t={t} i={i} total={timeline.length} />
          ))}
        </div>
      </div>
    </section>
  )
}