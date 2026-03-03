import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './Hero.module.css'

/* ─────────────────────────────────────────────
   Pipeline Canvas — enhanced with pulse rings
───────────────────────────────────────────── */
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
      Array(4).fill(0).map((_, i) => ({
        from, to, t: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
        offset: i / 4,
        size: 1.5 + Math.random() * 2,
      }))
    )
    // Pulse rings per node
    const pulses = NODES.map(() => ({ r: 0, alpha: 0, active: false, timer: Math.random() * 180 }))

    let frame = 0
    const draw = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width, h = canvas.height

      // Edges with animated dash offset
      EDGES.forEach(([fi, ti]) => {
        const f = NODES[fi], t = NODES[ti]
        ctx.save()
        ctx.beginPath(); ctx.moveTo(f.x*w, f.y*h); ctx.lineTo(t.x*w, t.y*h)
        ctx.strokeStyle = 'rgba(99,179,237,0.1)'; ctx.lineWidth = 1
        ctx.setLineDash([6, 8]); ctx.lineDashOffset = -frame * 0.3
        ctx.stroke()
        ctx.restore()
      })

      // Particles
      particles.forEach(p => {
        const f = NODES[p.from], t = NODES[p.to]
        const pt = (p.t + p.offset) % 1
        const x = f.x*w + (t.x*w - f.x*w)*pt
        const y = f.y*h + (t.y*h - f.y*h)*pt
        const alpha = Math.sin(pt * Math.PI) * 0.9 + 0.1
        ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI*2)
        ctx.fillStyle = `rgba(99,179,237,${alpha})`
        ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(99,179,237,0.8)'; ctx.fill(); ctx.shadowBlur = 0
        p.t = (p.t + p.speed) % 1
      })

      // Pulse rings
      pulses.forEach((pulse, ni) => {
        pulse.timer--
        if (pulse.timer <= 0 && !pulse.active) {
          pulse.active = true; pulse.r = 0; pulse.alpha = 0.7
          pulse.timer = 180 + Math.random() * 240
        }
        if (pulse.active) {
          const n = NODES[ni]
          ctx.beginPath(); ctx.arc(n.x*w, n.y*h, pulse.r, 0, Math.PI*2)
          ctx.strokeStyle = `rgba(99,179,237,${pulse.alpha})`
          ctx.lineWidth = 1; ctx.stroke()
          pulse.r += 0.8; pulse.alpha -= 0.015
          if (pulse.alpha <= 0) pulse.active = false
        }
      })

      // Nodes
      NODES.forEach(n => {
        const x = n.x*w, y = n.y*h
        // Outer ring
        ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI*2)
        ctx.strokeStyle = 'rgba(99,179,237,0.15)'; ctx.lineWidth = 1; ctx.stroke()
        // Inner dot
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 8)
        grd.addColorStop(0, 'rgba(144,205,244,1)')
        grd.addColorStop(1, 'rgba(99,179,237,0.7)')
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI*2)
        ctx.fillStyle = grd
        ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(99,179,237,0.8)'; ctx.fill(); ctx.shadowBlur = 0
        // Label
        ctx.font = '10px JetBrains Mono, monospace'
        ctx.fillStyle = 'rgba(226,232,240,0.45)'; ctx.textAlign = 'center'
        ctx.fillText(n.label, x, y + 28)
      })

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className={styles.pipeline} />
}

/* ─────────────────────────────────────────────
   Code Block — unchanged logic, better styling handled in CSS
───────────────────────────────────────────── */
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
      setVisible(v => { if (v >= lines.length) { clearInterval(t); return v }; return v + 1 })
    }, tab === 'spark' ? 110 : 160)
    return () => clearInterval(t)
  }, [tab])

  const colorMap = { kw: styles.sqlKw, field: styles.sqlField, string: styles.sqlString, normal: styles.sqlNormal }

  return (
    <div className={styles.sqlBlock}>
      <div className={styles.sqlHeader}>
        <span className={styles.sqlDots}>
          <span style={{background:'#ff5f57'}}/><span style={{background:'#febc2e'}}/><span style={{background:'#28c840'}}/>
        </span>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab==='spark' ? styles.tabActive : ''}`} onClick={() => setTab('spark')}>
            <span className={styles.tabIcon}>⚡</span> spark.py
          </button>
          <button className={`${styles.tab} ${tab==='sql' ? styles.tabActive : ''}`} onClick={() => setTab('sql')}>
            <span className={styles.tabIcon}>◈</span> query.sql
          </button>
        </div>
      </div>
      <div className={styles.sqlBody}>
        {lines.slice(0, visible).map((l, i) => (
          <div key={`${tab}-${i}`} className={`${styles.sqlLine} ${styles.sqlLineIn}`} style={{'--li': i}}>
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
          <div className={`${styles.sqlResult} ${styles.sqlResultIn}`}><span>{resultText}</span></div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Counter — eased with spring-like curve
───────────────────────────────────────────── */
function Counter({ to, suffix = '', duration = 1600, delay = 0 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      setTimeout(() => {
        const start = Date.now()
        const tick = () => {
          const raw = Math.min((Date.now() - start) / duration, 1)
          // Ease out expo
          const p = raw === 1 ? 1 : 1 - Math.pow(2, -10 * raw)
          setVal(Math.floor(p * to))
          if (raw < 1) requestAnimationFrame(tick); else setVal(to)
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

/* ─────────────────────────────────────────────
   Role Cycler — glitch transition
───────────────────────────────────────────── */
function RoleCycler() {
  const [idx, setIdx]       = useState(0)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true)
      setTimeout(() => { setIdx(i => (i+1) % ROLES.length); setGlitching(false) }, 380)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.roleRow}>
      <span className={styles.rolePrompt}>~/</span>
      <span className={`${styles.roleText} ${glitching ? styles.roleGlitch : ''}`}>{ROLES[idx]}</span>
      <span className={styles.roleCursor}>_</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   FlyLetter — same logic, smoother spring
───────────────────────────────────────────── */
function FlyLetter({ char, delay, className }) {
  const [style] = useState(() => {
    const edge = Math.floor(Math.random() * 4)
    let x = 0, y = 0
    if (edge === 0)      { x = (Math.random() - 0.5) * 140; y = -(80 + Math.random() * 80) }
    else if (edge === 1) { x = (Math.random() - 0.5) * 140; y =  (80 + Math.random() * 80) }
    else if (edge === 2) { x = -(120 + Math.random() * 80);  y = (Math.random() - 0.5) * 80 }
    else                 { x =  (120 + Math.random() * 80);  y = (Math.random() - 0.5) * 80 }
    return {
      '--fx': `${x}vw`, '--fy': `${y}vh`,
      '--fr': `${(Math.random() - 0.5) * 60}deg`,
      '--fs': 0.5 + Math.random() * 1.5,
    }
  })
  const [landed, setLanded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLanded(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <span className={`${styles.flyLetter} ${className||''} ${landed ? styles.flyLetterLanded : ''}`} style={style}>
      {char}
    </span>
  )
}

function CinematicName() {
  return (
    <div className={styles.headingWrap}>
      <div className={styles.greetingLine}>
        <FlyLetter char="Hello," delay={150} className={styles.greetingWord} />
        <FlyLetter char="I'm"   delay={380} className={styles.greetingWord} />
      </div>
      <div className={styles.nameMain}>
        {'ROJESH'.split('').map((c, i) => (
          <FlyLetter key={i} char={c} delay={650 + i * 100} className={styles.nameLetter} />
        ))}
      </div>
      <div className={styles.nameSub}>
        {'PRADHANANGA'.split('').map((c, i) => (
          <FlyLetter key={i} char={c} delay={1300 + i * 58} className={styles.nameSubLetter} />
        ))}
      </div>
      <div className={styles.nameDivider} />
      <div className={styles.roleWrap}><RoleCycler /></div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Magnetic CTA — follows cursor slightly
───────────────────────────────────────────── */
function MagneticBtn({ href, className, children }) {
  const ref = useRef(null)
  const onMove = useCallback(e => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top  + rect.height / 2)
    el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`
  }, [])
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)'
  }, [])
  return (
    <a ref={ref} href={href} className={className} data-cursor
       onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </a>
  )
}

/* ─────────────────────────────────────────────
   Stack badge — animated on mount
───────────────────────────────────────────── */
function StackBadges() {
  return (
    <div className={styles.stack}>
      {STACK.map((t, i) => (
        <span
          key={t.name}
          className={styles.stackBadge}
          style={{ '--c': t.color, '--si': i }}>
          {t.name}
        </span>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Hero
───────────────────────────────────────────── */
export default function Hero() {
  const imageRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (imageRef.current)
        imageRef.current.style.transform = `scale(1.04) translateY(${window.scrollY * 0.1}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className={styles.hero} id="home">
      <PipelineCanvas />
      <div className={styles.overlay} />
      <div className={styles.dotGrid} />

      {/* ── Left ── */}
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
              src="/profile.jpg"
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
                <Counter to={m.val} suffix={m.suffix} delay={i*150}/>
              </div>
              <div className={styles.metricLabel}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right ── */}
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
        <StackBadges />

        <div className={styles.ctas}>
          <MagneticBtn href="#work" className={styles.ctaPrimary}>
            <span className={styles.ctaIcon}>▶</span> run_portfolio()
          </MagneticBtn>
          <MagneticBtn href="#contact" className={styles.ctaSecondary}>
            hire_me() <span className={styles.ctaArrow}>→</span>
          </MagneticBtn>
        </div>
      </div>

      <div className={styles.scrollHint}><span>scroll</span></div>
    </section>
  )
}