import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EvaluationPanel from "@/components/EvaluationPanel";
import SentPrompt from "@/components/SentPrompt";
import PromptControls from "@/components/PromptControls";
export default function SpecificityResponse() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-6">
        <Breadcrumb />
        <div className="mb-5"></div>
        <div className="flex gap-6 max-w-7xl mx-auto">
          {/* Left Sidebar - Sent Prompt and Controls */}
          <div className="w-80 flex-shrink-0 space-y-6">
            {/* Sent Prompt */}
            <SentPrompt 
              text="Give me a summary of the main points in the AI Act." 
              fileName="EU_AI_Act.pdf"
            />
            
            {/* Prompt Controls */}
            <PromptControls 
              showSpecificity={true}
              showStyle={true}
              showContext={true}
              showBias={true}
            />
            
            {/* Modify Prompt Button */}
            <Button 
              variant="default"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Modify Prompt
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Article Content */}
            <div className="bg-white rounded-lg p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Here is a possible headline for a long-form journalistic article about an AI ethics agreement reached across the EU: "European Union Unites on Historic AI Ethics Framework, Charting Path for Responsible Technology Development"
              </h1>
              
              <div className="mb-6">
                <p className="text-gray-800 leading-relaxed mb-4">
                  <span className="text-red-500">🎯</span> Certainly! The AI Act is a <span className="text-red-500">📈</span> significant piece of legislation aimed at regulating artificial intelligence within the European Union.
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Here's a summary of its main points:</h2>
                
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Risk-Based Classification:</strong> AI systems are classified according to their risk level:
                    </div>
                  </li>
                  
                  <li className="flex items-start ml-6">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Unacceptable Risk:</strong> Prohibited, e.g., social scoring and manipulative AI.
                    </div>
                  </li>
                  
                  <li className="flex items-start ml-6">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>High-Risk:</strong> Subject to strict regulation.
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>...</div>
                  </li>
                </ul>
              </div>
              
              {/* Navigation */}
              <div className="mt-12 flex justify-between items-center">
                <div></div>
                <Button 
                  variant="outline" 
                  className="px-8 py-2 rounded-full border-gray-300 hover:border-gray-400"
                >
                  Next →
                </Button>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                Note: To optimise prompts and generate outputs Llama 3.1 8B is used.
              </div>
            </div>
          </div>

          {/* Right Sidebar - Journalistic Evaluation */}
          <div className="w-80 flex-shrink-0">
            <EvaluationPanel />
          </div>
        </div>
      </main>
    </div>;
}