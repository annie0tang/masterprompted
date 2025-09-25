import { useState } from "react";
import { CheckCircle, Target, Mic, Scale, Copy } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface TextFlagProps {
  text: string;
  evaluationFactor: "factual-accuracy" | "relevance" | "voice" | "bias" | "plagiarism";
  explanation: string;
  className?: string;
}

const iconMap = {
  "factual-accuracy": CheckCircle,
  "relevance": Target,
  "voice": Mic,
  "bias": Scale,
  "plagiarism": Copy,
};

const labelMap = {
  "factual-accuracy": "Factual Accuracy",
  "relevance": "Relevance", 
  "voice": "Voice",
  "bias": "Bias",
  "plagiarism": "Plagiarism",
};

export default function TextFlag({ text, evaluationFactor, explanation, className = "" }: TextFlagProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[evaluationFactor];
  const label = labelMap[evaluationFactor];

  const handleHoverChange = (hovered: boolean) => {
    setIsHovered(hovered);
    
    // Highlight the corresponding evaluation criterion
    const criterionElement = document.querySelector(`[data-criterion-id="${evaluationFactor}"]`);
    if (criterionElement) {
      const triggerElement = criterionElement.querySelector('[data-radix-collection-item]') || 
                            criterionElement.querySelector('.flex.items-center.justify-between');
      if (triggerElement) {
        if (hovered) {
          triggerElement.classList.add('ring-2', 'ring-red-500', 'bg-red-50');
          triggerElement.classList.remove('bg-gray-50', 'hover:bg-gray-100');
        } else {
          triggerElement.classList.remove('ring-2', 'ring-red-500', 'bg-red-50');
          triggerElement.classList.add('bg-gray-50');
        }
      }
    }
  };

  return (
    <HoverCard onOpenChange={handleHoverChange}>
      <HoverCardTrigger asChild>
        <span className={`inline-flex items-center gap-1 cursor-pointer ${className}`}>
          <Icon className="h-3 w-3 text-red-500 flex-shrink-0" />
          <span className="border-b-2 border-red-500 text-current">
            {text}
          </span>
        </span>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 bg-white border border-red-200 shadow-lg rounded-lg p-4"
        sideOffset={5}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-red-500" />
            <h4 className="font-semibold text-red-700 text-sm">{label}</h4>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {explanation}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}