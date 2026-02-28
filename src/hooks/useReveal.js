import { useEffect, useRef } from 'react'

// Use on a ref to observe only children of that element
export function useSectionReveal(ref) {
  useEffect(() => {
    if (!ref?.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )
    const els = ref.current.querySelectorAll('.reveal')
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ref])
}

// Global — use in App for any stragglers
export default function useReveal() {
  useEffect(() => {
    const run = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
      )
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
      return observer
    }

    let obs = run()
    const t1 = setTimeout(() => { obs.disconnect(); obs = run() }, 300)
    const t2 = setTimeout(() => { obs.disconnect(); obs = run() }, 800)
    const t3 = setTimeout(() => { obs.disconnect(); obs = run() }, 1500)

    return () => {
      obs.disconnect()
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
    }
  }, [])
}