import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Paperclip, ArrowUp } from "lucide-react";

export default function Summarize() {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(true);
  const [promptText, setPromptText] = useState("Summarize the main points of the EU AI Act, including its risk categories and rules for high-risk AI systems");

  const handleSubmit = () => {
    // Handle submission logic here
    console.log("Submitting prompt:", promptText);
  };

  const handleFileUpload = () => {
    // Handle file upload logic here
    console.log("File upload clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto relative">
          {/* Tooltip/Popover */}
          {showTooltip && (
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
              <div 
                className="bg-emerald-600 text-white p-4 rounded-lg shadow-lg max-w-xs"
                style={{
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <div className="flex justify-between items-start gap-3">
                  <p className="text-sm leading-relaxed">
                    Let's start by prompting for a summary of the AI act
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowTooltip(false)}
                    className="h-6 px-2 text-xs bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    Close
                  </Button>
                </div>
                {/* Arrow pointing down */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-emerald-600"></div>
                </div>
              </div>
            </div>
          )}

          {/* Main Chat Interface */}
          <div className="flex items-center justify-center min-h-[500px] pt-20">
            <Card className="w-full max-w-2xl">
              <CardContent className="p-6">
                <div className="relative">
                  <Textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Type your message here..."
                    className="min-h-[100px] pr-16 pb-12 resize-none text-base leading-relaxed"
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.5',
                    }}
                  />
                  
                  {/* Submit button */}
                  <Button
                    onClick={handleSubmit}
                    size="icon"
                    className="absolute top-3 right-3 rounded-full h-8 w-8 bg-gray-700 hover:bg-gray-600"
                  >
                    <ArrowUp className="h-4 w-4 text-white" />
                  </Button>

                  {/* File upload section */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleFileUpload}
                      className="h-6 w-6 text-gray-500 hover:text-gray-700"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">EU_AI_Act.pdf</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}