import styles from './Testimonial.module.css'

const testimonials = [
  {
    quote: 'Alex has a rare gift — the ability to make complexity feel effortless, and make the ordinary feel extraordinary.',
    author: 'Clara Novak',
    role: 'CEO, Luminary Studio',
  },
  {
    quote: 'Working with Alex transformed how we think about our brand. The attention to detail is simply unmatched.',
    author: 'Marcus Chen',
    role: 'Founder, Meridian Architects',
  },
]

export default function Testimonial() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className="section-label reveal" style={{ justifyContent: 'center' }}>
          What clients say
        </div>

        <div className={styles.quotes}>
          {testimonials.map((t, i) => (
            <div key={i} className={`${styles.quote} reveal reveal-delay-${i + 1}`}>
              <div className={styles.quoteMark}>"</div>
              <p className={styles.text}>
                {t.quote}
              </p>
              <div className={styles.author}>
                <span className={styles.authorLine} />
                <div>
                  <div className={styles.authorName}>{t.author}</div>
                  <div className={styles.authorRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
