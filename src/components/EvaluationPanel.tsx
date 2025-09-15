import { Check, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const evaluationCriteria = [
  {
    id: "factual-accuracy",
    label: "Factual Accuracy",
    icon: Check,
    options: ["Excellent", "Good", "Fair", "Poor"]
  },
  {
    id: "relevance", 
    label: "Relevance",
    icon: Check,
    options: ["Highly Relevant", "Relevant", "Somewhat Relevant", "Not Relevant"]
  },
  {
    id: "voice",
    label: "Voice", 
    icon: Check,
    options: ["Professional", "Casual", "Academic", "Journalistic"]
  },
  {
    id: "bias",
    label: "Bias",
    icon: Check, 
    options: ["Unbiased", "Slightly Biased", "Moderately Biased", "Highly Biased"]
  },
  {
    id: "plagiarism",
    label: "Plagiarism",
    icon: Check,
    options: ["Original", "Mostly Original", "Some Similarities", "Potential Issues"]
  }
];

export default function EvaluationPanel() {
  return (
    <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Journalistic Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {evaluationCriteria.map((criterion) => (
          <div key={criterion.id} className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <criterion.icon className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium">{criterion.label}</label>
            </div>
            <Select>
              <SelectTrigger className="w-full bg-white border-gray-300 rounded-lg hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary">
                <SelectValue placeholder="Select rating" />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {criterion.options.map((option) => (
                  <SelectItem 
                    key={option} 
                    value={option.toLowerCase().replace(/\s+/g, '-')}
                    className="hover:bg-gray-50 focus:bg-gray-50"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}