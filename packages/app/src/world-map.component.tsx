import { useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import styles from './world-map.module.scss'

export function WorldMap() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    invariant(container)
    const canvas = canvasRef.current
    invariant(canvas)

    const ro = new ResizeObserver((entries) => {
      invariant(entries.length === 1)
      const entry = entries.at(0)
      invariant(entry)
      invariant(canvas)

      const { contentRect: rect } = entry

      canvas.width = rect.width
      canvas.height = rect.height
    })
    ro.observe(container)
  }, [])

  return (
    <div className={styles.container} ref={containerRef}>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
      ></canvas>
    </div>
  )
}
