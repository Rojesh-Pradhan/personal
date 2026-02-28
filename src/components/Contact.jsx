import { useState, useRef } from 'react'
import styles from './Contact.module.css'
import { useSectionReveal } from '../hooks/useReveal'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const ref = useRef(null)
  useSectionReveal(ref)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const onSubmit = e => { e.preventDefault(); setSent(true) }

  return (
    <section className={styles.contact} id="contact" ref={ref}>
      <div className={styles.grid}>

        {/* ── Left ── */}
        <div className={styles.left}>
          <div className="section-label reveal">contact.init()</div>
          <h2 className={`${styles.heading} reveal reveal-delay-1`}>
            Let's build<br /><em>something great</em>
          </h2>
          <p className={`${styles.body} reveal reveal-delay-2`}>
            Open to Data Engineering internships, junior roles, and collaborations.
            Based in Stockholm — available remote or hybrid anywhere.
          </p>

          <div className={`${styles.links} reveal reveal-delay-3`}>
            {[
              { label: 'email',    val: 'rojeshpradhan13@gmail.com',       href: 'mailto:rojeshpradhan13@gmail.com' },
              { label: 'github',   val: 'github.com/rojesh',      href: '#' },
              { label: 'linkedin', val: 'https://www.linkedin.com/in/rojesh-p-093922137/',  href: '#' },
            ].map(l => (
              <a key={l.label} href={l.href} className={styles.linkItem} data-cursor>
                <span className={styles.linkKey}>{l.label}</span>
                <span className={styles.linkVal}>{l.val}</span>
              </a>
            ))}
          </div>

          <div className={`${styles.statusTerm} reveal reveal-delay-4`}>
            <div className={styles.stRow}>
              <span className={styles.stDot}/>
              <span className={styles.stLabel}>Open to work</span>
            </div>
            <div className={styles.stRow}>
              <span className={styles.stDot} style={{background:'var(--blue)'}}/>
              <span className={styles.stLabel}>Stockholm, Sweden</span>
            </div>
            <div className={styles.stRow}>
              <span className={styles.stDot} style={{background:'var(--purple)'}}/>
              <span className={styles.stLabel}>MSc @ Stockholm University</span>
            </div>
            <div className={styles.stRow}>
              <span className={styles.stDot} style={{background:'var(--orange)'}}/>
              <span className={styles.stLabel}>Remote / hybrid preferred</span>
            </div>
          </div>
        </div>

        {/* ── Form ── */}
        <div className={`${styles.formWrap} reveal reveal-delay-2`}>
          {!sent ? (
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.formHeader}>
                <span className={styles.formDot} style={{background:'#ff5f57'}}/>
                <span className={styles.formDot} style={{background:'#febc2e'}}/>
                <span className={styles.formDot} style={{background:'#28c840'}}/>
                <span className={styles.formTitle}>new_message.sql</span>
              </div>

              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label}>Name</label>
                  <input
                    type="text" name="name"
                    value={form.name} onChange={onChange}
                    className={styles.input}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email" name="email"
                    value={form.email} onChange={onChange}
                    className={styles.input}
                    placeholder="Your email"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Message</label>
                  <textarea
                    name="message" value={form.message} onChange={onChange}
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Your message..."
                    rows={5} required
                  />
                </div>

                <button type="submit" className={styles.submit} data-cursor>
                  Send message <span className={styles.submitArrow}>→</span>
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <div className={styles.successTitle}>Message sent</div>
              <div className={styles.successSub}>I'll get back to you within 48 hours.</div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}