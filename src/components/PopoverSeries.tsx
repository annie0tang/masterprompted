import { useState, useEffect, useRef } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type Step = {
  id: string
  trigger: React.ReactNode
  content: React.ReactNode
}

interface PopoverSeriesProps {
  steps: Step[]
  initialStep?: number
  onClose?: () => void
}

export function PopoverSeries({ steps, initialStep = 0, onClose }: PopoverSeriesProps) {
  const [currentStep, setCurrentStep] = useState<number | null>(initialStep)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const triggerRefs = useRef<(HTMLElement | null)[]>([])

  const isOpen = currentStep !== null
  // console.log("Current Trigger: ", steps[0].trigger)
  const close = () => {
    setCurrentStep(null)
    onClose?.()
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex)
    } else {
      close()
    }
  }

  // Update rect when step changes
  useEffect(() => {
    if (currentStep !== null) {
      const el = triggerRefs.current[currentStep]
      if (el) {
        setRect(el.getBoundingClientRect())
      }
    } else {
      setRect(null)
    }
  }, [currentStep])

  return (
    <>
      {isOpen && rect && (
        <div
          className="fixed inset-0 bg-black/50 z-40 pointer-events-none"
          style={{
            // punch a transparent hole using mask
            WebkitMask: `radial-gradient(circle at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2
              }px, transparent ${Math.max(rect.width, rect.height) / 2 + 4}px, black ${Math.max(rect.width, rect.height) / 2 + 12}px)`,
            WebkitMaskComposite: "destination-out",
            maskComposite: "exclude",
          }}
        />
      )}

      {steps.map((step, index) => (
        <Popover
          key={step.id}
          open={currentStep === index}
          onOpenChange={() => { }}
        >
          <PopoverTrigger
            asChild
            className="z-50 relative"
            ref={(el: HTMLElement | null) => {
              triggerRefs.current[index] = el
            }}
          >
            {step.trigger}
          </PopoverTrigger>
          <PopoverContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="z-50 relative space-y-4"
          >
            <div className="flex justify-between align-top">
              <div className="mt-2">{step.content}</div>
              <Button
                className="absolute top-1 right-1 rounded-full p-2"
                onClick={close}
                variant="ghost"
                size="icon"
              >
                <X className="h-1 w-1" />
              </Button>
            </div>
            {steps.length > 1 ? (
              <div className="flex justify-between items-center text-sm text-muted-foreground pt-2 border-t">
                <div className="ml-4">
                  {index + 1} / {steps.length}
                </div>
                <div className="flex justify-between gap-4">
                  <Button
                    onClick={() => goToStep(index - 1)}
                    disabled={index === 0}
                    variant="secondary"
                  >
                    Previous
                  </Button>
                  {index === steps.length - 1 ?
                    (
                      <Button
                        onClick={() => close()}
                      >
                        Done
                      </Button>
                    ) : (
                      <Button
                        onClick={() => goToStep(index + 1)}
                        disabled={index === steps.length - 1}
                      >
                        Next
                      </Button>
                    )}
                </div>
              </div>
            ) :
              <div className="flex justify-end">
                <Button
                  onClick={() => close()}
                >
                  Got it
                </Button>
              </div>
            }
          </PopoverContent>
        </Popover>
      ))}
    </>
  )
}
