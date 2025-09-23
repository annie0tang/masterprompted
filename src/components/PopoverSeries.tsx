import { useState, useEffect } from "react"
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

  const isOpen = currentStep !== null

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

  // Prevent background scrolling
  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflow = "hidden"
  //   } else {
  //     document.body.style.overflow = ""
  //   }
  //   return () => {
  //     document.body.style.overflow = ""
  //   }
  // }, [isOpen])

  return (
    <>
      {isOpen && (
        // dim background on popover open
        <div
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {steps.map((step, index) => (
        <Popover 
        key={step.id} 
        open={currentStep === index} 
        // onOpenChange={(open) => {
        //   if (!open) { close(); 
        //     console.log(`closed ${step.id}`);
        //   }
        // }}
        onOpenChange={() => {}}
        >
          <PopoverTrigger asChild className="z-50 relative">
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
                <X className="h-1 w-1"/>
              </Button>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <Button
                onClick={() => goToStep(index - 1)}
                disabled={index === 0}
                className="text-sm text-muted-foreground disabled:opacity-50"
                variant="secondary"
              >
                Previous
              </Button>
              <div className="space-x-2">
                <Button
                  onClick={() => goToStep(index + 1)}
                  disabled={index === steps.length - 1}
                  className="text-sm disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </>
  )
}
