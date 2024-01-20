import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
} from 'react'
import invariant from 'tiny-invariant'
import { Context } from './context.js'
import styles from './world-map.module.scss'
import { World, cellType } from './world.js'

export function WorldMap() {
  const context = useContext(Context)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const worldRef = useRef<World>(context.world)

  useEffect(() => {
    worldRef.current = context.world
  }, [context.world])

  useEffect(() => {
    const controller = new AbortController()
    const canvas = canvasRef.current
    invariant(canvas)
    initResizeObserver(canvas, controller.signal)
    initRenderLoop(canvas, controller.signal, worldRef)
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
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  world: World,
  cellSize: number,
): void {
  const id = `${x}.${y}`
  const chunk = world.chunks[id]
  invariant(chunk)
  const { chunkSize } = world

  context.save()
  context.translate(
    x * chunkSize * cellSize,
    y * chunkSize * cellSize,
  )

  for (let yy = 0; yy < chunkSize; yy++) {
    for (let xx = 0; xx < chunkSize; xx++) {
      const cell = chunk.cells[yy * chunkSize + xx]
      invariant(cell)
      switch (cell.type) {
        case cellType.enum.Dirt1:
          context.fillStyle = 'brown'
          break
        case cellType.enum.Grass1:
          context.fillStyle = 'green'
          break
        default:
          invariant(false)
      }
      context.fillRect(
        xx * cellSize,
        yy * cellSize,
        cellSize,
        cellSize,
      )
    }
  }

  context.restore()
}

function initRenderLoop(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
  worldRef: MutableRefObject<World>,
): void {
  const context = getContext(canvas)
  function render() {
    if (signal.aborted) {
      return
    }

    const world = worldRef.current

    context.save()
    context.translate(canvas.width / 2, canvas.height / 2)

    for (let y = -1; y <= 0; y++) {
      for (let x = -1; x <= 0; x++) {
        drawChunk(context, x, y, world, 10)
      }
    }

    context.restore()

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
