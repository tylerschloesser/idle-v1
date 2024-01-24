import invariant from 'tiny-invariant'
import { Vec2 } from './vec2.js'

export class BoundingBox {
  private tl: Vec2 | null = null
  private br: Vec2 | null = null

  add(position: Vec2, size: Vec2): void {
    if (this.tl === null && this.br === null) {
      this.tl = position.clone()
      this.br = position.add(size)
      return
    }

    invariant(this.tl !== null)
    invariant(this.br !== null)

    if (position.x < this.tl.x) {
      this.tl.x = position.x
    }
    if (position.y < this.tl.y) {
      this.tl.y = position.y
    }
    if (position.x + size.x > this.br.x) {
      this.br.x = position.x + size.x
    }
    if (position.y + size.y > this.br.y) {
      this.br.y = position.y + size.y
    }
  }

  size(): Vec2 {
    if (this.tl === null && this.br === null) {
      return new Vec2(0, 0)
    }

    invariant(this.tl !== null)
    invariant(this.br !== null)

    return new Vec2(
      this.br.x - this.tl.x,
      this.br.y - this.tl.y,
    )
  }
}
