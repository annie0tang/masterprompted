import Header from "@/components/Header";
import EvaluationPanel from "@/components/EvaluationPanel";
import Chatbox from "@/components/ChatBox";
import PromptControls from "@/components/PromptControls";
import SentPrompt from "@/components/SentPrompt"; 
import { useState, useRef, useEffect } from "react";
import Answer from "@/components/Answer";

function ChatBody({ submittedPrompts, submittedResponses }: { submittedPrompts: string[], submittedResponses: string[] }) {
  return (
    <div className="mt-6 space-y-4">
      {submittedPrompts.map((prompt, index) => (
        <div key={index}>
          <SentPrompt text={prompt} />
          {submittedResponses[index] && (
            <Answer text={submittedResponses[index]} />
          )}
        </div>
      ))}
    </div>
  );
}
const PromptPlayground = () => {
  // Create a ref for the scrollable chat container
  const chatEndRef = useRef<HTMLDivElement>(null);

  // state to store the list of submitted prompts and responses
  const [submittedPrompts, setSubmittedPrompts] = useState<string[]>([]);
  const [submittedResponses, setSubmittedResponses] = useState<string[]>([]);

  // submit: POST and update states
  const handleChatSubmit = async (submittedText: string) => {
    if (!submittedText.trim()) return; // Don't submit empty prompts


    // Add the new prompt to our list of submitted prompts
    setSubmittedPrompts(prevPrompts => [...prevPrompts, submittedText]);

    console.log("Text submitted from Chatbox:", submittedText);

    let currentFileIds: string[] = []; // Placeholder for file IDs
    const response = await fetch(
      "https://llm1.hochschule-stralsund.de:8000/answer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: submittedText,
          temperature: 0.7,
          fileIds: currentFileIds,
        }),
      }
    );

    const data: any = await response.json();

    const answer: string = data.answer;

    console.log("Received answer from backend:", answer);
    setSubmittedResponses(prevResponses => [...prevResponses, answer]);
  };

  // Add useEffect to scroll when prompts or responses change
  useEffect(() => {
    if (chatEndRef.current) {
      // Scroll to the bottom of the container
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [submittedPrompts]); // Dependency array: run whenever these states change

  return (
    <div className="min-h-screen max-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-6">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="flex-none">
            <div className="sticky top-4">
              <PromptControls />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 flex flex-col h-[calc(100vh-8rem)]">
            <Chatbox onSubmit={handleChatSubmit} canType={true} />
            <div className='flex-1 overflow-y-auto' ref={chatEndRef}> 
              <ChatBody submittedPrompts={submittedPrompts} submittedResponses={submittedResponses} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex-none">
            <EvaluationPanel />
          </div>
        </div>
      </main >
    </div >
  );
};

export default PromptPlayground;