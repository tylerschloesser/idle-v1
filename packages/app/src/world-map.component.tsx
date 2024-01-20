import { useContext, useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import styles from './world-map.module.scss'
import { World } from './world.js'

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { world } = useContext(Context)

  useEffect(() => {
    const controller = new AbortController()
    const canvas = canvasRef.current
    invariant(canvas)
    initResizeObserver(canvas, controller.signal)
    initRenderLoop(canvas, controller.signal, world)
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

function getContext(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D {
  const context = canvas.getContext('2d')
  invariant(context)
  return context
}

function drawChunk(
  x: number,
  y: number,
  world: World,
): void {
  const id = `${x}.${y}`
  const chunk = world.chunks[id]
  invariant(chunk)
}

function initRenderLoop(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
  world: World,
): void {
  const context = getContext(canvas)
  function render() {
    if (signal.aborted) {
      return
    }

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'red'
    context.fillRect(0, 0, 100, 100)

    for (let y = -1; y <= 0; y++) {
      for (let x = -1; x <= 0; x++) {
        drawChunk(x, y, world)
      }
    }

    window.requestAnimationFrame(render)
  }
  window.requestAnimationFrame(render)
}

function initResizeObserver(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
): void {
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
