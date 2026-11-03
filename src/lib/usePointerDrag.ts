import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import type { ProductId } from '../config/products'

export function usePointerDrag(onDrop: (id: ProductId) => void) {
  const start = useRef({ x: 0, y: 0, moved: false })
  const [ghost, setGhost] = useState<{
    id: ProductId
    x: number
    y: number
  } | null>(null)
  useEffect(() => {
    if (!ghost) return
    let frame = 0
    const tick = () => {
      const speed =
        ghost.y < 100 ? -9 : ghost.y > window.innerHeight - 130 ? 9 : 0
      if (speed) window.scrollBy(0, speed)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [ghost])
  const bind = (id: ProductId) => ({
    onPointerDown(event: PointerEvent<HTMLButtonElement>) {
      if (!event.isPrimary || event.button !== 0) return
      start.current = { x: event.clientX, y: event.clientY, moved: false }
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    onPointerMove(event: PointerEvent<HTMLButtonElement>) {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
      if (
        Math.hypot(
          event.clientX - start.current.x,
          event.clientY - start.current.y,
        ) > 7
      )
        start.current.moved = true
      if (start.current.moved)
        setGhost({ id, x: event.clientX, y: event.clientY })
    },
    onPointerUp(event: PointerEvent<HTMLButtonElement>) {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
      if (
        start.current.moved &&
        document
          .elementsFromPoint(event.clientX, event.clientY)
          .some((element) => element.closest('[data-drop-target]'))
      )
        onDrop(id)
      event.currentTarget.releasePointerCapture(event.pointerId)
      setGhost(null)
    },
    onPointerCancel() {
      setGhost(null)
      start.current.moved = true
    },
  })
  return {
    bind,
    ghost,
    consumeDragClick: () => {
      const moved = start.current.moved
      start.current.moved = false
      return moved
    },
  }
}
