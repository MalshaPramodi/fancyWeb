import { Box } from '../components/Box'
import { CookieTray } from '../components/CookieTray'
import { useBoxStore } from '../store/useBoxStore'
import { productConfig } from '../config/products'

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
        Cookie selection and delivery navigation are coming in the next steps.
      </p>
    </div>
  )
}
