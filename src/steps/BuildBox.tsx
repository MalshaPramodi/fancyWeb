import { Box } from '../components/Box'
import { CookieTray } from '../components/CookieTray'
import { useBoxStore } from '../store/useBoxStore'
import { productConfig } from '../config/products'
import { boxCount } from '../store/box'

export function BuildBox() {
  const box = useBoxStore()
  return (
    <div>
      <p className="mb-6 rounded-button bg-gold/20 px-4 py-3 text-center text-xs font-bold text-gold-dark">
        {productConfig.priceNotice}
      </p>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]">
        <CookieTray box={box} />
        <Box box={box} />
      </div>
      <p id="next-step-help" className="mt-5 text-center text-sm text-muted">
        Drag a cookie into the box, or tap to add. Tap a packed cookie to remove
        it. Keyboard: Tab to a cookie, then Enter or Space.
      </p>
      <p role="status" className="mt-2 text-center text-sm font-bold">
        {boxCount(box)} of {box.size} cookies packed.
      </p>
    </div>
  )
}
