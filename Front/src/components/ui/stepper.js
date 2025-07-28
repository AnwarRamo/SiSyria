import * as React from "react"

const StepperContext = React.createContext()

export function Stepper({ defaultValue = 1, orientation = "horizontal", children }) {
  const [step, setStep] = React.useState(defaultValue)
  const isVertical = orientation === "vertical"

  return (
    <StepperContext.Provider value={{ step, setStep }}>
      <div className={isVertical ? "flex flex-col gap-4" : "flex items-center gap-4"}>
        {children}
      </div>
    </StepperContext.Provider>
  )
}

export function StepperItem({ step: stepNumber, children, className = "" }) {
  const { step } = React.useContext(StepperContext)
  const isActive = step === stepNumber

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
    </div>
  )
}

export function StepperTrigger({ children }) {
  const { setStep } = React.useContext(StepperContext)

  return (
    <button onClick={() => setStep(prev => prev + 1)} className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 transition">
      {children}
    </button>
  )
}

export function StepperIndicator() {
  const { step } = React.useContext(StepperContext)

  return (
    <span className="text-sm font-bold text-white">{step}</span>
  )
}

export function StepperSeparator() {
  return <div className="h-8 w-px bg-gray-300 mx-2" />
}
