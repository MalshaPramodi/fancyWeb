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
                className="absolute left-[65%] right-[-35%] top-4 h-px bg-evergreen/20"
                aria-hidden="true"
              />
            )}
            <span
              aria-hidden="true"
              className={`relative flex size-8 items-center justify-center rounded-full border border-evergreen text-xs font-normal ${index === currentStep ? 'bg-evergreen text-ivory' : 'bg-cream text-evergreen'}`}
            >
              {index + 1}
            </span>
            <span
              className={`text-[11px] sm:text-sm ${index === currentStep ? 'font-normal text-evergreen' : 'font-normal text-muted'}`}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
