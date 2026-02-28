import { useEffect, useRef, useState } from 'react'
import styles from './Hero.module.css'

function PipelineCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    const NODES = [
      { x: 0.05, y: 0.3,  label: 'Kafka' },
      { x: 0.05, y: 0.65, label: 'API' },
      { x: 0.25, y: 0.48, label: 'Spark' },
      { x: 0.46, y: 0.28, label: 'dbt' },
      { x: 0.46, y: 0.65, label: 'Airflow' },
      { x: 0.67, y: 0.45, label: 'AWS S3' },
      { x: 0.85, y: 0.28, label: 'Tableau' },
      { x: 0.85, y: 0.62, label: 'ML Model' },
    ]
    const EDGES = [[0,2],[1,2],[2,3],[2,4],[3,5],[4,5],[5,6],[5,7]]
    const particles = EDGES.flatMap(([from, to]) =>
      Array(3).fill(0).map((_, i) => ({
        from, to, t: Math.random(),
        speed: 0.003 + Math.random() * 0.003,
        offset: i / 3
      }))
    )

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width, h = canvas.height
      EDGES.forEach(([fi, ti]) => {
        const f = NODES[fi], t = NODES[ti]
        ctx.beginPath(); ctx.moveTo(f.x*w, f.y*h); ctx.lineTo(t.x*w, t.y*h)
        ctx.strokeStyle = 'rgba(99,179,237,0.08)'; ctx.lineWidth = 1; ctx.stroke()
      })
      particles.forEach(p => {
        const f = NODES[p.from], t = NODES[p.to]
        const pt = (p.t + p.offset) % 1
        const x = f.x*w + (t.x*w - f.x*w)*pt
        const y = f.y*h + (t.y*h - f.y*h)*pt
        const alpha = Math.sin(pt * Math.PI) * 0.8 + 0.2
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI*2)
        ctx.fillStyle = `rgba(99,179,237,${alpha})`
        ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(99,179,237,0.6)'; ctx.fill(); ctx.shadowBlur = 0
        p.t = (p.t + p.speed) % 1
      })
      NODES.forEach(n => {
        const x = n.x*w, y = n.y*h
        ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI*2)
        ctx.strokeStyle = 'rgba(99,179,237,0.18)'; ctx.lineWidth = 1; ctx.stroke()
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(99,179,237,0.9)'
        ctx.shadowBlur = 14; ctx.shadowColor = 'rgba(99,179,237,0.7)'; ctx.fill(); ctx.shadowBlur = 0
        ctx.font = '10px JetBrains Mono, monospace'
        ctx.fillStyle = 'rgba(226,232,240,0.5)'; ctx.textAlign = 'center'
        ctx.fillText(n.label, x, y + 28)
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className={styles.pipeline} />
}

const SPARK_LINES = [
  { text: 'from pyspark.sql import SparkSession', cls: 'kw' },
  { text: 'from pyspark.sql.functions import col, count, avg', cls: 'kw' },
  { text: '', cls: 'normal' },
  { text: 'spark = SparkSession.builder \\', cls: 'normal' },
  { text: '    .appName("RojeshPipeline") \\', cls: 'field' },
  { text: '    .config("spark.executor.memory","4g") \\', cls: 'field' },
  { text: '    .getOrCreate()', cls: 'field' },
  { text: '', cls: 'normal' },
  { text: 'df = spark.read.parquet("s3://rojesh/events/")', cls: 'normal' },
  { text: 'result = df.filter(col("status") == "active") \\', cls: 'normal' },
  { text: '    .groupBy("engineer") \\', cls: 'field' },
  { text: '    .agg(count("id").alias("pipelines"),', cls: 'field' },
  { text: '         avg("perf").alias("avg_perf"))', cls: 'field' },
  { text: 'result.write.mode("overwrite").parquet("s3://output/")', cls: 'string' },
]

const SQL_LINES = [
  { text: 'SELECT', cls: 'kw' },
  { text: '  r.name,', cls: 'field' },
  { text: '  r.location,', cls: 'field' },
  { text: '  r.degree        AS education,', cls: 'field' },
  { text: '  r.company       AS last_role,', cls: 'field' },
  { text: '  r.skills        AS stack', cls: 'field' },
  { text: 'FROM   engineers r', cls: 'normal' },
  { text: "WHERE  r.name     = 'Rojesh Pradhananga'", cls: 'string' },
  { text: "  AND  r.location = 'Stockholm, SE'", cls: 'string' },
  { text: "  AND  r.status   = 'open_to_work';", cls: 'kw' },
]

function CodeBlock() {
  const [tab, setTab] = useState('spark')
  const [visible, setVisible] = useState(0)
  const lines = tab === 'spark' ? SPARK_LINES : SQL_LINES
  const resultText = tab === 'spark'
    ? '✓  Job complete · 14 partitions · 2.4M rows · 3.2s'
    : '▶  1 row returned · 0.042s · profile loaded'

  useEffect(() => {
    setVisible(0)
    const t = setInterval(() => {
      setVisible(v => {
        if (v >= lines.length) { clearInterval(t); return v }
        return v + 1
      })
    }, tab === 'spark' ? 120 : 180)
    return () => clearInterval(t)
  }, [tab])

  const colorMap = {
    kw: styles.sqlKw,
    field: styles.sqlField,
    string: styles.sqlString,
    normal: styles.sqlNormal
  }

  return (
    <div className={styles.sqlBlock}>
      <div className={styles.sqlHeader}>
        <span className={styles.sqlDots}>
          <span style={{background:'#ff5f57'}}/>
          <span style={{background:'#febc2e'}}/>
          <span style={{background:'#28c840'}}/>
        </span>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab==='spark' ? styles.tabActive : ''}`}
            onClick={() => setTab('spark')}>
            <span className={styles.tabIcon}>⚡</span> spark.py
          </button>
          <button
            className={`${styles.tab} ${tab==='sql' ? styles.tabActive : ''}`}
            onClick={() => setTab('sql')}>
            <span className={styles.tabIcon}>◈</span> query.sql
          </button>
        </div>
      </div>
      <div className={styles.sqlBody}>
        {lines.slice(0, visible).map((l, i) => (
          <div key={`${tab}-${i}`} className={styles.sqlLine}>
            <span className={styles.sqlLn}>{String(i+1).padStart(2,'0')}</span>
            <span className={colorMap[l.cls] || styles.sqlNormal}>{l.text || '\u00A0'}</span>
          </div>
        ))}
        {visible < lines.length && (
          <div className={styles.sqlLine}>
            <span className={styles.sqlLn}>{String(visible+1).padStart(2,'0')}</span>
            <span className={styles.sqlCursor}>▋</span>
          </div>
        )}
        {visible >= lines.length && (
          <div className={styles.sqlResult}><span>{resultText}</span></div>
        )}
      </div>
    </div>
  )
}

function Counter({ to, suffix = '', duration = 1800, delay = 0 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      setTimeout(() => {
        const start = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1)
          setVal(Math.floor(p * to))
          if (p < 1) requestAnimationFrame(tick); else setVal(to)
        }
        requestAnimationFrame(tick)
      }, delay)
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to, duration, delay])
  return <span ref={ref}>{val}{suffix}</span>
}

const metrics = [
  { label: 'DE Experience',   val: 1,  suffix: '.5yr' },
  { label: 'Pipelines Built', val: 20, suffix: '+' },
  { label: 'Scraping Jobs',   val: 15, suffix: '+' },
  { label: 'Uptime',          val: 99, suffix: '%' },
]

const STACK = [
  { name: 'Airflow',    color: '#63b3ed' },
  { name: 'Airbyte',    color: '#b794f4' },
  { name: 'AWS',        color: '#f6ad55' },
  { name: 'Python',     color: '#68d391' },
  { name: 'Pandas',     color: '#68d391' },
  { name: 'TensorFlow', color: '#fc8181' },
  { name: 'SQL',        color: '#90cdf4' },
  { name: 'ETL',        color: '#f6ad55' },
  { name: 'Superset',   color: '#fc8181' },
]

const ROLES = ['Data Engineer', 'Backend Developer', 'AI / ML Engineer']

function RoleCycler() {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => { setIdx(i => (i+1) % ROLES.length); setFading(false) }, 400)
    }, 2600)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className={styles.roleRow}>
      <span className={styles.rolePrompt}>~/</span>
      <span className={`${styles.roleText} ${fading ? styles.roleFade : ''}`}>{ROLES[idx]}</span>
      <span className={styles.roleCursor}>_</span>
    </div>
  )
}

function FlyLetter({ char, delay, className }) {
  const [style] = useState(() => {
    const edge = Math.floor(Math.random() * 4)
    let x = 0, y = 0
    if (edge === 0) {
      x = (Math.random() - 0.5) * 160
      y = -(100 + Math.random() * 100)
    } else if (edge === 1) {
      x = (Math.random() - 0.5) * 160
      y =  (100 + Math.random() * 100)
    } else if (edge === 2) {
      x = -(140 + Math.random() * 100)
      y = (Math.random() - 0.5) * 100
    } else {
      x =  (140 + Math.random() * 100)
      y = (Math.random() - 0.5) * 100
    }
    const r = (Math.random() - 0.5) * 70
    const s = 0.4 + Math.random() * 1.8
    return {
      '--fx': `${x}vw`,
      '--fy': `${y}vh`,
      '--fr': `${r}deg`,
      '--fs': s,
    }
  })

  const [landed, setLanded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLanded(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <span
      className={`${styles.flyLetter} ${className || ''} ${landed ? styles.flyLetterLanded : ''}`}
      style={style}>
      {char}
    </span>
  )
}

function CinematicName() {
  return (
    <div className={styles.headingWrap}>
      <div className={styles.greetingLine}>
        <FlyLetter char="Hello," delay={150}  className={styles.greetingWord} />
        <FlyLetter char="I'm"   delay={400}   className={styles.greetingWord} />
      </div>
      <div className={styles.nameMain}>
        {'ROJESH'.split('').map((c, i) => (
          <FlyLetter key={i} char={c} delay={700 + i * 110} className={styles.nameLetter} />
        ))}
      </div>
      <div className={styles.nameSub}>
        {'PRADHANANGA'.split('').map((c, i) => (
          <FlyLetter key={i} char={c} delay={1400 + i * 65} className={styles.nameSubLetter} />
        ))}
      </div>
      <div className={styles.nameDivider} />
      <div className={styles.roleWrap}>
        <RoleCycler />
      </div>
    </div>
  )
}

export default function Hero() {
  const imageRef = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      if (imageRef.current)
        imageRef.current.style.transform = `scale(1.04) translateY(${window.scrollY * 0.12}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className={styles.hero} id="home">
      <PipelineCanvas />
      <div className={styles.overlay} />
      <div className={styles.dotGrid} />

      <div className={styles.left}>
        <div className={styles.imageWrap}>
          <div className={styles.schemaBadge}>
            <span className={styles.schemaKw}>SCHEMA</span>
            <span className={styles.schemaVal}>data_engineer</span>
          </div>
          <div className={`${styles.corner} ${styles.cTL}`}/>
          <div className={`${styles.corner} ${styles.cTR}`}/>
          <div className={`${styles.corner} ${styles.cBL}`}/>
          <div className={`${styles.corner} ${styles.cBR}`}/>
          <div className={styles.hudTop}>
            <span className={styles.hudLabel}>ID:001</span>
            <span className={styles.hudDot}/>
            <span className={styles.hudLabel}>REC</span>
          </div>
          <div className={styles.hudBot}>
            <span className={styles.hudLabel}>ROJESH.P</span>
            <span className={styles.hudSep}/>
            <span className={styles.hudLabel}>DATA ENG</span>
          </div>
          <div className={styles.imageScan}/>
          <div className={styles.imageInner} ref={imageRef}>
            <img
              src="/src/assets/profile.jpg"
              alt="Rojesh Pradhananga"
              className={styles.photo}
              onError={e => { e.target.style.display='none' }}
            />
            <div className={styles.monogram}>RP</div>
          </div>
          <div className={styles.imageTint}/>
          <div className={styles.dataStream}>
            {['INSERT','UPDATE','SELECT','COMMIT','MERGE','STREAM','BATCH'].map((w,i) => (
              <span key={w} className={styles.streamWord} style={{animationDelay:`${i*0.4}s`}}>{w}</span>
            ))}
          </div>
        </div>

        <div className={styles.metrics}>
          {metrics.map((m,i) => (
            <div key={m.label} className={`${styles.metric} reveal reveal-delay-${i+1}`}>
              <div className={styles.metricVal}>
                <Counter to={m.val} suffix={m.suffix} delay={i*120}/>
              </div>
              <div className={styles.metricLabel}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.breadcrumb}>
          <span className={styles.bCrumb}>engineers</span>
          <span className={styles.bSep}>/</span>
          <span className={styles.bCrumb}>rojesh</span>
          <span className={styles.bSep}>/</span>
          <span className={styles.bActive}>profile.json</span>
        </div>

        <CinematicName />

        <div className={styles.nameRow}>
          <span className={styles.nameLabel}>name:</span>
          <span className={styles.nameVal}>"Rojesh Pradhananga"</span>
        </div>

        <CodeBlock />

        <div className={styles.stack}>
          {STACK.map(t => (
            <span key={t.name} className={styles.stackBadge} style={{'--c': t.color}}>
              {t.name}
            </span>
          ))}
        </div>

        <div className={styles.ctas}>
          <a href="#work" className={styles.ctaPrimary} data-cursor>
            <span className={styles.ctaIcon}>▶</span> run_portfolio()
          </a>
          <a href="#contact" className={styles.ctaSecondary} data-cursor>
            hire_me() <span className={styles.ctaArrow}>→</span>
          </a>
        </div>
      </div>

      <div className={styles.scrollHint}><span>scroll</span></div>
    </section>
  )
}