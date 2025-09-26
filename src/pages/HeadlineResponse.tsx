import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import EvaluationPanel from "@/components/EvaluationPanel";
import SentPrompt from "@/components/SentPrompt";
import { PopoverSeries } from "@/components/PopoverSeries";
import TextFlag from "@/components/TextFlag";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function HeadlineResponse() {
  const navigate = useNavigate();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [currentSentence, setCurrentSentence] = useState(["European", "Union", "Unites", "On", "Historic", "AI", "Ethics", "Framework,", "Charting", "Path", "For", "Responsible", "Technology", "Development"]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipShown, setTooltipShown] = useState(false);
  const [showFactualInaccuracyTooltip, setShowFactualInaccuracyTooltip] = useState(false);
  const [factualTooltipShown, setFactualTooltipShown] = useState(false);
  const [showCharterTooltip, setShowCharterTooltip] = useState(false);
  const [charterTooltipShown, setCharterTooltipShown] = useState(false);
  const [useNewInteraction, setUseNewInteraction] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Word progression data from the table
  const wordProgressions = {
    "European Union Unites": {
      "on": "Historic AI Ethics Framework, Charting Path for Responsible Technology Development",
      "Around": "Sweeping AI Ethics Charter, Pioneering International Tech Policy Standards",
      "Behind": "Historic AI Ethics Framework, Setting Standards for Responsible Innovation"
    },
    "European Union Reaches": {
      "Consensus": "on Historic AI Ethics Framework, Paving the Way for Responsible Tech Innovation",
      "Agreement": "on Historic AI Ethics Framework, Laying Groundwork for Safe Tech Development",
      "Milestone": "in AI Ethics, Advancing a Unified Vision for Responsible Innovation"
    },
    "European Union Finalizes": {
      "landmark": "AI Ethics Agreement, Setting Global Benchmark for Safe Technology Development",
      "sweeping": "AI Ethics Agreement, Establishing New Norms for Responsible Tech",
      "pioneering": "AI Ethics Framework, Guiding the Future of Safe Innovation"
    }
  };

  const getNextWords = (currentPath: string[]) => {
    // For Union position (index 1)
    if (currentPath.length === 2 && currentPath[0] === "European" && currentPath[1] === "Union") {
      return [{
        word: "Unites",
        nextWords: ["on", "Around", "Behind"]
      }, {
        word: "Reaches",
        nextWords: ["Consensus", "Agreement", "Milestone"]
      }, {
        word: "Finalizes",
        nextWords: ["landmark", "sweeping", "pioneering"]
      }];
    }

    const pathKey = currentPath.slice(0, 3).join(" ");
    const progressionData = wordProgressions[pathKey as keyof typeof wordProgressions];
    
    if (progressionData && currentPath.length === 3) {
      return Object.keys(progressionData).map(word => ({
        word,
        completion: progressionData[word as keyof typeof progressionData]
      }));
    }

    // For second level (after selecting first word)
    if (currentPath.length === 4) {
      const secondLevelKey = currentPath.slice(0, 3).join(" ");
      const progressionData = wordProgressions[secondLevelKey as keyof typeof wordProgressions];
      if (progressionData) {
        const selectedThirdWord = currentPath[3];
        return [{
          word: selectedThirdWord,
          completion: progressionData[selectedThirdWord as keyof typeof progressionData]
        }];
      }
    }
    return [];
  };

  // Define popover steps for word interaction tour
  const popoverSteps = [{
    id: "word-union",
    trigger: "[data-word-union]",
    content: <div className="space-y-2">
      <h3 className="font-semibold text-sm">Interactive Word Selection</h3>
      <p className="text-sm leading-relaxed">
        Click on the highlighted words to select a different option. Try and find the word combination that leads to a factual inaccuracy.
      </p>
    </div>
  }];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Breadcrumb />
        
        {/* Interaction Mode Toggle */}
        <div className="mb-6 flex items-center space-x-2">
          <Label htmlFor="interaction-mode" className="text-sm font-medium">
            Interaction Mode:
          </Label>
          <Switch id="interaction-mode" checked={useNewInteraction} onCheckedChange={setUseNewInteraction} />
          <span className="text-sm text-gray-600">
            {useNewInteraction ? "New Form" : "Classic Form"}
          </span>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column - Main content */}
            <div className="lg:col-span-8">
              {/* Original Prompt */}
              <div className="mb-8">
                <SentPrompt text="Write a headline for a long form journalistic article about ai ethics agreement reached across the eu" fileName="EU_AI_Act.pdf" />
              </div>

              {/* AI Response */}
              <div className="space-y-6">
                <p className="text-gray-700 text-lg">
                  Here is a possible headline for a long-form journalistic article about an AI ethics agreement reached across the EU:
                </p>
                
                {/* Conditional rendering based on interaction mode */}
                {useNewInteraction ? (
                  /* New Interaction Form */
                  <div className="space-y-6">
                    <div className="relative">
                      <h1 className="text-2xl text-gray-900 leading-loose font-normal md:text-4xl" style={{
                        wordSpacing: '0.2em',
                        lineHeight: '1.8'
                      }}>
                        {currentSentence.map((word, index) => {
                          // Define which words are interactive based on the word progressions data
                          const isInteractiveWord = (
                            // Third position words: Unites, Reaches, Finalizes
                            (index === 2 && ["Unites", "Reaches", "Finalizes"].includes(word)) ||
                            // Fourth position words: On, Around, Behind, Consensus, landmark, sweeping, pioneering
                            (index === 3 && ["On", "Around", "Behind", "Consensus", "landmark", "sweeping", "pioneering"].includes(word)) ||
                            // Additional words that appear in other positions
                            (index === 4 && ["Agreement", "Milestone"].includes(word))
                          );
                          
                          if (isInteractiveWord) {
                            const wordKey = `word-${index}`;
                            const isActive = activeDropdown === wordKey;
                            
                            return (
                              <span key={index} className="relative">
                                <span 
                                  className="relative group cursor-pointer transition-colors duration-200 bg-green-200 hover:bg-green-300 px-1 rounded-lg"
                                  onClick={() => setActiveDropdown(isActive ? null : wordKey)}
                                >
                                  {word}
                                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-200 text-green-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                    {word === "Unites" ? "0.67" : 
                                     word === "Reaches" ? "0.24" : 
                                     word === "Finalizes" ? "0.09" : 
                                     word === "On" ? "0.73" : 
                                     word === "Around" ? "0.42" :
                                     word === "Behind" ? "0.38" :
                                     word === "Consensus" ? "0.82" : 
                                     word === "landmark" ? "0.45" : 
                                     word === "sweeping" ? "0.31" : 
                                     word === "pioneering" ? "0.24" : 
                                     word === "Agreement" ? "0.18" : 
                                     word === "Milestone" ? "0.12" : "0.50"}
                                  </span>
                                </span>
                                
                                {/* Dropdown that expands upward */}
                                {isActive && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-32">
                                      {word === "Unites" && (
                                        <>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Reaches", "Consensus", "On", "Historic", "AI", "Ethics", "Framework,", "Paving", "The", "Way", "For", "Responsible", "Tech", "Innovation"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            Reaches
                                          </div>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Finalizes", "landmark", "AI", "Ethics", "Agreement,", "Setting", "Global", "Benchmark", "For", "Safe", "Technology", "Development"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            Finalizes
                                          </div>
                                        </>
                                      )}
                                      {word === "Reaches" && (
                                        <>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Unites", "On", "Historic", "AI", "Ethics", "Framework,", "Charting", "Path", "For", "Responsible", "Technology", "Development"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            Unites
                                          </div>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Finalizes", "landmark", "AI", "Ethics", "Agreement,", "Setting", "Global", "Benchmark", "For", "Safe", "Technology", "Development"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            Finalizes
                                          </div>
                                        </>
                                      )}
                                      {word === "Finalizes" && (
                                        <>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Unites", "On", "Historic", "AI", "Ethics", "Framework,", "Charting", "Path", "For", "Responsible", "Technology", "Development"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            Unites
                                          </div>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Reaches", "Consensus", "On", "Historic", "AI", "Ethics", "Framework,", "Paving", "The", "Way", "For", "Responsible", "Tech", "Innovation"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            Reaches
                                          </div>
                                        </>
                                      )}
                                      {word === "On" && (
                                        <>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = [...currentSentence];
                                            newSentence[3] = "Behind";
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            Behind
                                          </div>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = [...currentSentence];
                                            newSentence[3] = "Around";
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            Around
                                          </div>
                                        </>
                                      )}
                                      {(word === "Around" || word === "Behind") && (
                                        <>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Unites", "On", "Historic", "AI", "Ethics", "Framework,", "Charting", "Path", "For", "Responsible", "Technology", "Development"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            On
                                          </div>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = [...currentSentence];
                                            newSentence[3] = word === "Around" ? "Behind" : "Around";
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            {word === "Around" ? "Behind" : "Around"}
                                          </div>
                                        </>
                                      )}
                                      {word === "Consensus" && (
                                        <>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Reaches", "Agreement", "On", "Historic", "AI", "Ethics", "Framework,", "Laying", "Groundwork", "For", "Safe", "Tech", "Development"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            Agreement
                                          </div>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Reaches", "Milestone", "In", "AI", "Ethics,", "Advancing", "A", "Unified", "Vision", "For", "Responsible", "Innovation"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            Milestone
                                          </div>
                                        </>
                                      )}
                                      {word === "landmark" && (
                                        <>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Finalizes", "sweeping", "AI", "Ethics", "Agreement,", "Establishing", "New", "Norms", "For", "Responsible", "Tech"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            sweeping
                                          </div>
                                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                            const newSentence = ["European", "Union", "Finalizes", "pioneering", "AI", "Ethics", "Framework,", "Guiding", "The", "Future", "Of", "Safe", "Innovation"];
                                            setCurrentSentence(newSentence);
                                            setActiveDropdown(null);
                                          }}>
                                            pioneering
                                          </div>
                                        </>
                                      )}
                                      {(word === "sweeping" || word === "pioneering") && (
                                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                          const newSentence = ["European", "Union", "Finalizes", "landmark", "AI", "Ethics", "Agreement,", "Setting", "Global", "Benchmark", "For", "Safe", "Technology", "Development"];
                                          setCurrentSentence(newSentence);
                                          setActiveDropdown(null);
                                        }}>
                                          landmark
                                        </div>
                                      )}
                                      {(word === "Agreement" || word === "Milestone") && (
                                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => {
                                          const newSentence = ["European", "Union", "Reaches", "Consensus", "On", "Historic", "AI", "Ethics", "Framework,", "Paving", "The", "Way", "For", "Responsible", "Tech", "Innovation"];
                                          setCurrentSentence(newSentence);
                                          setActiveDropdown(null);
                                        }}>
                                          Consensus
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {index < currentSentence.length - 1 && " "}
                              </span>
                            );
                          }
                          return (
                            <span key={index}>
                              {word}
                              {index < currentSentence.length - 1 && " "}
                            </span>
                          );
                        })}
                      </h1>
                    </div>
                    
                    {/* Click outside to close dropdown */}
                    {activeDropdown && (
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setActiveDropdown(null)}
                      />
                    )}
                  </div>
                ) : (
                  /* Classic Interaction Form */
                  <div className="relative">
                    <h1 className="text-2xl text-gray-900 leading-loose font-normal md:text-4xl" style={{
                      wordSpacing: '0.2em',
                      lineHeight: '1.8'
                    }}>
                      {currentSentence.map((word, index) => {
                        const isClickable = index === 2 && (word === "Unites" || word === "Reaches" || word === "Finalizes");

                        // Special handling for Union/Unites position
                        if (index === 1 && word === "Union") {
                          return (
                            <span key={index}>
                              <span 
                                className="relative group cursor-pointer transition-colors duration-200 bg-green-200 hover:bg-green-300 px-1 rounded-lg" 
                                onClick={() => setSelectedWord(selectedWord === `word-${index}` ? null : `word-${index}`)} 
                                onMouseEnter={() => {
                                  if (!tooltipShown) {
                                    setShowTooltip(true);
                                    setTooltipShown(true);
                                  }
                                }} 
                                data-word-union
                              >
                                {word}
                                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-200 text-green-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                  0.73
                                </span>
                              </span>
                              {index < currentSentence.length - 1 && " "}
                            </span>
                          );
                        }

                        if (isClickable) {
                          return (
                            <span key={index}>
                              <span 
                                className="relative group cursor-pointer transition-colors duration-200 bg-green-200 hover:bg-green-300 px-1 rounded-lg" 
                                onClick={() => setSelectedWord(selectedWord === `word-${index}` ? null : `word-${index}`)} 
                                onMouseEnter={() => {
                                  if (!tooltipShown) {
                                    setShowTooltip(true);
                                    setTooltipShown(true);
                                  }
                                }} 
                                data-word-unites={word === "Unites" ? true : undefined}
                              >
                                {word}
                                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-200 text-green-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                  {word === "Unites" ? "0.67" : word === "Reaches" ? "0.24" : "0.09"}
                                </span>
                              </span>
                              {index < currentSentence.length - 1 && " "}
                            </span>
                          );
                        }

                        // Handle TextFlag for "Charter,"
                        if (word === "Charter,") {
                          return (
                            <span key={index} className="relative">
                              <span onMouseLeave={() => {
                                if (!charterTooltipShown) {
                                  setShowCharterTooltip(true);
                                  setCharterTooltipShown(true);
                                }
                              }}>
                                <TextFlag text="Charter" evaluationFactor="factual-accuracy" explanation="The term 'charter' has been used here to describe the EU AI Act. A charter is a different type of document than an act and therefore are not interchangeable terms." />
                              </span>
                              ,{index < currentSentence.length - 1 && " "}
                              
                              {/* Charter Tooltip */}
                              {showCharterTooltip && (
                                <div className="fixed right-80 top-1/2 transform -translate-y-1/2 z-50">
                                  <div className="bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg w-80">
                                    <h3 className="text-sm font-semibold mb-2">Journalistic Evaluation Checklist</h3>
                                    <p className="text-sm leading-relaxed mb-3">
                                      For more information on the flagged content, expand the relevant term according to the icon.
                                    </p>
                                    <p className="text-sm leading-relaxed mb-4">
                                      This checklist is designed to help you apply your journalistic expertise effectively to LLM outputs. With LLM-specific criteria, it guides you to keep your reporting reliable.
                                    </p>
                                    <button onClick={() => setShowCharterTooltip(false)} className="bg-white text-emerald-500 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                                      Continue
                                    </button>
                                  </div>
                                </div>
                              )}
                              
                              {/* Factual Inaccuracy Tooltip */}
                              {showFactualInaccuracyTooltip && (
                                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 z-50">
                                  <div className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md w-80">
                                    <p className="text-sm leading-relaxed mb-2 font-medium">
                                      You found the factual inaccuracy!
                                    </p>
                                    <p className="text-sm leading-relaxed mb-4">
                                      Through a series of word selections, the LLM has generated an error in factual information.
                                    </p>
                                    <p className="text-sm leading-relaxed mb-4">
                                      Hover over the word to read more about the falsehood.
                                    </p>
                                    <button onClick={() => setShowFactualInaccuracyTooltip(false)} className="bg-white text-emerald-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                                      Close
                                    </button>
                                  </div>
                                </div>
                              )}
                            </span>
                          );
                        }

                        // Regular words
                        return (
                          <span key={index}>
                            {word}
                            {index < currentSentence.length - 1 && " "}
                          </span>
                        );
                      })}
                    </h1>

                    {/* Classic Form Interactive Elements */}
                    {selectedWord && (
                      <div className="mt-8">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                          <h3 className="text-lg font-medium mb-4">Choose alternative words:</h3>
                          <div className="space-y-4">
                            {getNextWords(currentSentence.slice(0, 3)).map((option, optionIndex) => (
                              <div key={optionIndex} className="flex justify-between items-center p-3 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer">
                                <div className="space-y-1">
                                  <div className="font-medium">{option.word}</div>
                                  {option.completion && (
                                    <div className="text-sm text-gray-600">{option.completion}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tooltip for word interaction */}
                    {showTooltip && (
                      <div className="absolute right-8 top-8 z-50">
                        <div className="bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg w-80">
                          <h3 className="text-sm font-semibold mb-2">Try Different Options</h3>
                          <p className="text-sm leading-relaxed mb-4">
                            Click on the highlighted words to explore different options. Try and find the word combination that leads to a factual inaccuracy.
                          </p>
                          <button onClick={() => setShowTooltip(false)} className="bg-white text-emerald-500 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                            Continue
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Next Button - shown for both forms */}
                <div className="flex justify-end pt-6">
                  <Button 
                    onClick={() => navigate("/module/conversation-style")} 
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right column - Evaluation Panel */}
            <div className="lg:col-span-4">
              <EvaluationPanel />
            </div>
          </div>
        </div>
        
        {/* Popover Series for guided tour */}
        <PopoverSeries steps={popoverSteps} />
        
        {/* Guided Tour Tooltip */}
        <TooltipProvider>
          {showTooltip && (
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
              <Tooltip open={true}>
                <TooltipTrigger asChild>
                  <div className="invisible" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-sm p-4">
                  <h3 className="font-semibold mb-2">Try Different Options</h3>
                  <p className="text-sm leading-relaxed">
                    Click on the highlighted words to explore different options. Try and find the word combination that leads to a factual inaccuracy.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </TooltipProvider>
      </main>
    </div>
  );
}