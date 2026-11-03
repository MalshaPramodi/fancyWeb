const steps = ['Build box', 'Delivery', 'Payment', 'Done'] as const

export function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Order progress" className="mx-auto mb-6 max-w-2xl">
      <ol className="grid grid-cols-4 gap-1 sm:gap-4">
        {steps.map((step, index) => (
          <li
            key={step}
            aria-current={index === currentStep ? 'step' : undefined}
            className="relative flex min-w-0 flex-col items-center gap-2 text-center"
          >
            {index < steps.length - 1 && (
              <span
                className="absolute left-[65%] right-[-35%] top-4 h-px bg-pine/20"
                aria-hidden="true"
              />
            )}
            <span
              aria-hidden="true"
              className={`relative flex size-8 items-center justify-center rounded-full border-2 border-pine text-xs font-black ${index === currentStep ? 'bg-pine text-snow' : 'bg-cream text-pine'}`}
            >
              {index + 1}
            </span>
            <span
              className={`text-[11px] sm:text-sm ${index === currentStep ? 'font-black text-pine' : 'font-semibold text-muted'}`}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
