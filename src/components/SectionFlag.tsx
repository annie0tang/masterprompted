import { ReactNode } from "react";
import { CheckCircle, Target, Mic, Scale, Copy } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface SectionFlagProps {
  children: ReactNode;
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

export default function SectionFlag({ children, evaluationFactor, explanation, className = "" }: SectionFlagProps) {
  const Icon = iconMap[evaluationFactor];
  const label = labelMap[evaluationFactor];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={`relative border-2 border-destructive rounded p-3 cursor-pointer ${className}`}>
          <div className="absolute -top-3 -right-3 bg-background rounded-full p-1 shadow-md">
            <Icon className="h-4 w-4 text-destructive" />
          </div>
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 bg-card border-destructive/20 shadow-lg rounded-lg p-4"
        sideOffset={5}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-destructive" />
            <h4 className="font-semibold text-destructive text-sm">{label}</h4>
          </div>
          <p className="text-sm text-foreground font-normal leading-relaxed">
            {explanation}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
