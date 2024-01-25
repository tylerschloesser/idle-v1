import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
} from 'react'
import invariant from 'tiny-invariant'
import { BoundingBox } from './bounding-box.js'
import { Context } from './context.js'
import { Vec2 } from './vec2.js'
import styles from './world-map.module.scss'
import {
  COAL_FUEL_TICKS,
  Entity,
  EntityType,
  MINE_TICKS,
  World,
} from './world.js'

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

function drawEntityCommon(
  context: CanvasRenderingContext2D,
  position: Vec2,
  size: Vec2,
  translate: Vec2,
  scale: number,
): void {
  context.fillStyle = 'black'
  context.strokeStyle = 'white'
  context.lineWidth = 2
  context.fillRect(
    (position.x + translate.x) * scale,
    (position.y + translate.y) * scale,
    size.x * scale,
    size.y * scale,
  )
  context.strokeRect(
    (position.x + translate.x) * scale + 1,
    (position.y + translate.y) * scale + 1,
    size.x * scale - 2,
    size.y * scale - 2,
  )
}

function drawProgressBar(
  context: CanvasRenderingContext2D,
  fuelProgress: number,
  craftProgress: number,
  position: Vec2,
  size: Vec2,
  translate: Vec2,
  scale: number,
): void {
  context.fillStyle = `hsl(0, 0%, 50%)`
  context.fillRect(
    (position.x + translate.x) * scale + 2,
    (position.y + translate.y) * scale + 2,
    (size.x * scale - 4) * fuelProgress,
    size.y * 0.1 * scale,
  )

  context.fillStyle = 'white'
  context.fillRect(
    (position.x + translate.x) * scale + 2,
    (position.y + translate.y) * scale +
      2 +
      size.y * 0.1 * scale,
    (size.x * scale - 4) * craftProgress,
    size.y * 0.3 * scale,
  )
}

function drawEntity(
  context: CanvasRenderingContext2D,
  world: World,
  entity: Entity,
  position: Vec2,
  size: Vec2,
  translate: Vec2,
  scale: number,
): void {
  drawEntityCommon(
    context,
    position,
    size,
    translate,
    scale,
  )

  const fuelProgress =
    entity.fuelTicksRemaining / COAL_FUEL_TICKS
  invariant(fuelProgress >= 0 && fuelProgress <= 1)

  let craftProgress = 0
  switch (entity.type) {
    case EntityType.enum.StoneFurnace: {
      const recipe = entity.recipeItemType
        ? world.furnaceRecipes[entity.recipeItemType]
        : null
      invariant(recipe !== undefined)
      if (recipe && entity.craftTicksRemaining !== null) {
        craftProgress =
          (recipe.ticks - entity.craftTicksRemaining) /
          recipe.ticks
      }
      break
    }
    case EntityType.enum.BurnerMiningDrill: {
      if (entity.mineTicksRemaining !== null) {
        craftProgress =
          1 - entity.mineTicksRemaining / MINE_TICKS
      }
      break
    }
  }

  drawProgressBar(
    context,
    fuelProgress,
    craftProgress,
    position,
    size,
    translate,
    scale,
  )
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

    context.reset()
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = 'hsl(0, 0%, 50%)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    const bb = new BoundingBox()

    const world = worldRef.current

    const entities = Object.values(world.entities)

    for (let i = 0; i < entities.length; i++) {
      const position = new Vec2(i * 2, 0)
      const size = new Vec2(1, 1)
      bb.add(position, size)
    }

    const size = bb.size()
    const scale = Math.min(
      canvas.width / size.x,
      canvas.height / size.y,
    )

    let translate: Vec2

    if (size.x > size.y) {
      translate = new Vec2(
        0,
        (canvas.height / scale - size.y) / 2,
      )
    } else {
      invariant(false, 'TODO')
    }

    for (let i = 0; i < entities.length; i++) {
      const entity = entities.at(i)
      invariant(entity)

      const position = new Vec2(i * 2, 0)
      const size = new Vec2(1, 1)

      drawEntity(
        context,
        world,
        entity,
        position,
        size,
        translate,
        scale,
      )
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
