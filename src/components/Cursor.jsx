import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    let raf, mx = -100, my = -100, rx = -100, ry = -100
    const onMove = e => { mx = e.clientX; my = e.clientY }
    const animate = () => {
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`
      raf = requestAnimationFrame(animate)
    }
    const on = () => { dotRef.current?.classList.add(styles.active); ringRef.current?.classList.add(styles.active) }
    const off = () => { dotRef.current?.classList.remove(styles.active); ringRef.current?.classList.remove(styles.active) }
    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a,button,[data-cursor]').forEach(el => { el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', off) })
    raf = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  )
}