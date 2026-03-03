import { useState, useRef } from 'react'
import styles from './Contact.module.css'
import { useSectionReveal } from '../hooks/useReveal'

const FORMSPREE_ID = 'YOUR_FORM_ID'

export default function Contact() {
  const [form,   setForm]   = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const ref = useRef(null)
  useSectionReveal(ref)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setStatus('sent') }
      else        { setStatus('error') }
    } catch { setStatus('error') }
  }

  return (
    <section className={styles.contact} id="contact" ref={ref}>
      <div className={styles.grid}>

        {/* Left */}
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
              { label: 'email',    val: 'rojeshpradhan13@gmail.com', href: 'mailto:rojeshpradhan13@gmail.com' },
              { label: 'github',   val: 'github.com/rojesh',         href: 'https://github.com/rojesh' },
              { label: 'linkedin', val: 'linkedin.com/in/rojesh-p',  href: 'https://www.linkedin.com/in/rojesh-p-093922137/' },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={styles.linkItem} data-cursor>
                <span className={styles.linkKey}>{l.label}</span>
                <span className={styles.linkVal}>{l.val}</span>
              </a>
            ))}
          </div>

          <div className={`${styles.statusTerm} reveal reveal-delay-4`}>
            {[
              { label: 'Open to work',              color: 'var(--green)' },
              { label: 'Stockholm, Sweden',          color: 'var(--blue)' },
              { label: 'MSc @ Stockholm University', color: 'var(--purple)' },
              { label: 'Remote / hybrid preferred',  color: 'var(--orange)' },
            ].map(s => (
              <div key={s.label} className={styles.stRow}>
                <span className={styles.stDot} style={{ background: s.color }} />
                <span className={styles.stLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className={`${styles.formWrap} reveal reveal-delay-2`}>
          {status === 'sent' ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <div className={styles.successTitle}>Message sent</div>
              <div className={styles.successSub}>I'll get back to you within 48 hours.</div>
              <button className={styles.successBtn} onClick={() => { setStatus('idle'); setForm({ name:'', email:'', message:'' }) }}>
                send_another()
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.formHeader}>
                <span className={styles.formDot} style={{background:'#ff5f57'}}/>
                <span className={styles.formDot} style={{background:'#febc2e'}}/>
                <span className={styles.formDot} style={{background:'#28c840'}}/>
                <span className={styles.formTitle}>new_message.sql</span>
              </div>
              <div className={styles.fields}>
                {[
                  { name: 'name',    label: 'Name',    type: 'text',  placeholder: 'Your name' },
                  { name: 'email',   label: 'Email',   type: 'email', placeholder: 'Your email' },
                ].map(f => (
                  <div key={f.name} className={styles.field}>
                    <label className={styles.label}>{f.label}</label>
                    <input
                      type={f.type} name={f.name}
                      value={form[f.name]} onChange={onChange}
                      className={styles.input} placeholder={f.placeholder}
                      disabled={status === 'sending'} required
                    />
                  </div>
                ))}
                <div className={styles.field}>
                  <label className={styles.label}>Message</label>
                  <textarea
                    name="message" value={form.message} onChange={onChange}
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Your message..." rows={5}
                    disabled={status === 'sending'} required
                  />
                </div>
                {status === 'error' && (
                  <div className={styles.errorMsg}>⚠ Something went wrong. Please try again.</div>
                )}
                <button type="submit" className={styles.submit} data-cursor disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <><span>Sending...</span><span className={styles.spinner}/></>
                  ) : (
                    <><span>Send message</span><span className={styles.submitArrow}>→</span></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  )
} 