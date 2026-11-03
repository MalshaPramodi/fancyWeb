import { useEffect, useRef } from 'react'
import { brand } from '../config/brand'

const settings = brand.snowfall
const random = (range: number[]) =>
  range[0] + Math.random() * (range[1] - range[0])
type Flake = {
  x: number
  y: number
  radius: number
  speed: number
  opacity: number
  phase: number
  sway: number
  frequency: number
}

export function Snowfall({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    if (!enabled) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 1
    let height = 1
    let ratio = 1
    let frame = 0
    let previousTime = 0
    let elapsed = 0
    let flakes: Flake[] = []
    const silhouette = new Path2D()
    for (let arm = 0; arm < 6; arm++) {
      const angle = Math.PI / 6 + (arm * Math.PI) / 3
      const x = Math.cos(angle)
      const y = Math.sin(angle)
      silhouette.moveTo(0, 0)
      silhouette.lineTo(x, y)
      for (const [base, tip, spread] of [
        [0.43, 0.63, 0.2],
        [0.72, 0.88, 0.13],
      ]) {
        silhouette.moveTo(x * tip - y * spread, y * tip + x * spread)
        silhouette.lineTo(x * base, y * base)
        silhouette.lineTo(x * tip + y * spread, y * tip - x * spread)
      }
    }

    function makeFlake(): Flake {
      const large = Math.random() < settings.largeFraction
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: random(large ? settings.size.large : settings.size.flake),
        speed: random(settings.speed),
        opacity: random(settings.opacity),
        phase: Math.random() * Math.PI * 2,
        sway: random(settings.sway.distance),
        frequency: random(settings.sway.frequency),
      }
    }

    function resize() {
      if (!canvas || !context) return
      const oldWidth = width
      const oldHeight = height
      width = Math.max(1, window.innerWidth)
      height = Math.max(1, window.innerHeight)
      ratio = Math.min(
        window.devicePixelRatio || 1,
        settings.maxDevicePixelRatio,
      )
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const progress = Math.max(
        0,
        Math.min(
          1,
          (width - settings.viewport.mobileWidth) /
            (settings.viewport.desktopWidth - settings.viewport.mobileWidth),
        ),
      )
      const density =
        settings.count.mobile +
        progress * (settings.count.desktop - settings.count.mobile)
      const count = Math.round(
        density *
          Math.max(
            0.75,
            Math.min(1.2, height / settings.viewport.referenceHeight),
          ),
      )
      flakes = flakes.slice(0, count).map((flake) => ({
        ...flake,
        x: (flake.x / oldWidth) * width,
        y: (flake.y / oldHeight) * height,
      }))
      while (flakes.length < count) flakes.push(makeFlake())
    }

    function draw(time: number) {
      if (!context || !canvas) return
      if (
        Math.min(window.devicePixelRatio || 1, settings.maxDevicePixelRatio) !==
        ratio
      )
        resize()
      frame = requestAnimationFrame(draw)
      if (previousTime && time - previousTime < 1000 / settings.frameRate)
        return
      const delta = previousTime
        ? Math.min((time - previousTime) / 1000, 0.1)
        : 0
      previousTime = time
      elapsed += delta
      context.clearRect(0, 0, width, height)
      context.strokeStyle = settings.color
      context.lineCap = 'round'
      context.lineJoin = 'round'
      for (const flake of flakes) {
        flake.y += flake.speed * delta
        if (flake.y > height + flake.radius) {
          flake.y = -flake.radius
          flake.x = Math.random() * width
        }
        const x =
          flake.x +
          Math.sin(elapsed * flake.frequency + flake.phase) * flake.sway
        const fade = Math.max(
          0,
          Math.min(1, flake.y / 36, (height - flake.y) / 36),
        )
        context.globalAlpha = flake.opacity * fade
        context.save()
        context.translate(x, flake.y)
        context.scale(flake.radius, flake.radius)
        context.lineWidth = settings.lineWidth / flake.radius
        context.stroke(silhouette)
        context.restore()
      }
    }

    function syncPlayback() {
      cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
      if (!canvas || !context) return
      if (motion.matches || document.hidden) {
        if (motion.matches) context.clearRect(0, 0, width, height)
        return
      }
      resize()
      frame = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', syncPlayback)
    motion.addEventListener('change', syncPlayback)
    syncPlayback()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', syncPlayback)
      motion.removeEventListener('change', syncPlayback)
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [enabled])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      hidden={!enabled}
      className="snowfall-canvas pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}
