import { useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import styles from './world-map.module.scss'

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const canvas = canvasRef.current
    invariant(canvas)
    initCanvas(canvas, controller.signal)

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <canvas
      className={styles.canvas}
      ref={canvasRef}
    ></canvas>
  )
}

function initCanvas(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
) {
  const ro = new ResizeObserver((entries) => {
    invariant(entries.length === 1)
    const entry = entries.at(0)
    invariant(entry)
    invariant(canvas)

    const { contentRect: rect } = entry

    canvas.width = rect.width
    canvas.height = rect.height
  })
  ro.observe(canvas)
  signal.addEventListener('abort', () => {
    ro.disconnect()
  })
}
