import Header from "@/components/Header";
import EvaluationPanel from "@/components/EvaluationPanel";
import PromptControls from "@/components/PromptControls";
import ChatPrompt from "@/components/ChatPrompt";
import { useState, useRef, useEffect, useCallback } from "react";
import ChatAnswer from "@/components/ChatAnswer";

// --- REFACTORED: Defined a single type for all optimization parameters ---
export type Parameters = {
  specificity: string;
  style: string;
  context: string;
  bias: string;
};

type ThreadVersion = { prompt: string; answer?: string };
type Thread = { versions: ThreadVersion[]; currentIndex: number };

function ChatBody({
  threads,
  onPrevVersion,
  onNextVersion,
}: {
  threads: Thread[];
  onPrevVersion: (threadIndex: number) => void;
  onNextVersion: (threadIndex: number) => void;
}) {
  return (
    <div className="mt-6 space-y-4">
      {threads.map((thread, threadIndex) => {
        const current = thread.versions[thread.currentIndex];
        return (
          <div key={threadIndex}>
            <ChatPrompt
              text={current.prompt}
              versionIndex={thread.currentIndex}
              versionCount={thread.versions.length}
              onPrevVersion={() => onPrevVersion(threadIndex)}
              onNextVersion={() => onNextVersion(threadIndex)}
            />
            {current.answer && (
              <ChatAnswer
                text={current.answer}
                // Provide previous answers within this thread for diffing
                answerArray={thread.versions.map(v => v.answer ?? "")}
                currentIndex={thread.currentIndex}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
const PromptPlayground = () => {
  // Create a ref for the scrollable chat container
  const chatEndRef = useRef<HTMLDivElement>(null);

  // state to store threads with versioned prompts/answers
  const [threads, setThreads] = useState<Thread[]>([]);

  // --- REFACTORED: State for parameters is now a single object ---
  const [parameters, setParameters] = useState<Parameters>({
    specificity: "",
    style: "",
    context: "",
    bias: "",
  });

  // ChatBox text state
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [editingText, setEditingText] = useState<string>("");
  // Stores the previous prompt to enable single-level undo
  const [previousPrompt, setPreviousPrompt] = useState<string>("");

  // --- REFACTORED: Consolidated handler for all parameter changes ---
  const handleParameterChange = (paramKey: keyof Parameters, value: string) => {
    setParameters(prev => ({
      ...prev,
      [paramKey]: value,
    }));
  };

  // --- REFACTORED: Reset handler now clears the single parameters object ---
  const handleReset = useCallback(() => {
    setParameters({
      specificity: "",
      style: "",
      context: "",
      bias: "",
    });
  }, []);

  // Perform network call and write answer into a specific thread/version
  const submitAnswerForThreadVersion = useCallback(async (threadIndex: number, versionIndex: number, promptText: string) => {
    console.log("Submitting for thread/version:", threadIndex, versionIndex, promptText);
    const currentFileIds: string[] = [];
    const response = await fetch(
      "https://llm1.hochschule-stralsund.de:8000/answer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          temperature: 0.7,
          fileIds: currentFileIds,
        }),
      }
    );
    const data: { answer: string } = await response.json();
    const answer: string = data.answer;
    setThreads(prev => {
      const copy = [...prev];
      let safeThreadIndex = threadIndex;
      if (!copy[safeThreadIndex]) safeThreadIndex = copy.length - 1;
      if (safeThreadIndex < 0 || !copy[safeThreadIndex]) return prev;

      const t = { ...copy[safeThreadIndex] };
      const versions = [...t.versions];
      let safeVersionIndex = versionIndex;
      if (!versions[safeVersionIndex]) safeVersionIndex = versions.length - 1;
      if (safeVersionIndex < 0 || !versions[safeVersionIndex]) return prev;

      versions[safeVersionIndex] = { ...versions[safeVersionIndex], answer };
      t.versions = versions;
      copy[safeThreadIndex] = t;
      return copy;
    });
  }, []);

  const handlePromptOptimize = useCallback(async (
    prompt: string,
    specificity: string,
    style: string,
    context: string,
    bias: string,
    send?: boolean
  ) => {
    if (!prompt.trim()) return;

    setPreviousPrompt(prompt);

    const optimize_prompt = await fetch(
      "https://llm1.hochschule-stralsund.de:8000/optimize",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          language: "en",
          temperature: 0.7,
          specificity: specificity,
          communication_mode: style,
          depth: context,
          bias: bias,
          length: "short",
        }),
      }
    );

    const data = await optimize_prompt.json();
    const optimized_prompt: string = data.optimized_prompt;

    setEditingText(optimized_prompt)

  }, []);

  // --- NEW: useEffect to automatically optimize the prompt when parameters change ---
  useEffect(() => {
    if (!currentPrompt.trim()) return;

    // Only optimize if at least one parameter is set
    if (Object.values(parameters).some(p => p !== "")) {
      handlePromptOptimize(
        currentPrompt,
        parameters.specificity,
        parameters.style,
        parameters.context,
        parameters.bias,
        false
      );
    }
  }, [parameters, currentPrompt, handlePromptOptimize]);

  // Undo handler: revert to the previous prompt (single-level undo)
  const handleUndo = () => {
    if (!previousPrompt) return;
    setCurrentPrompt(previousPrompt);
    setEditingText(previousPrompt);
    setPreviousPrompt("");
  };

  const handleChatSubmit = (submittedText: string) => {
    if (!submittedText.trim()) return;
    setCurrentPrompt(submittedText);
    void createNewThreadAndFetch(submittedText);
  };

  const createNewThreadAndFetch = async (submittedText: string) => {
    let newThreadIndex = -1;
    setThreads(prev => {
      newThreadIndex = prev.length;
      return [...prev, { versions: [{ prompt: submittedText }], currentIndex: 0 }];
    });
    await submitAnswerForThreadVersion(newThreadIndex, 0, submittedText);
  };

  // Helper to submit answer for the latest thread's latest version

const submitAnswerForLatestVersion = async () => {
  if (threads.length === 0) return;
  const threadIndex = threads.length - 1;
  const versionIndex = threads[threadIndex].versions.length - 1;
  const promptText = threads[threadIndex].versions[versionIndex]?.prompt;

  // Add new version if prompt has changed
  if (editingText !== promptText) {
    setThreads(prev => {
      const copy = [...prev];
      const t = { ...copy[threadIndex] };
      t.versions = [...t.versions, { prompt: editingText, answer: null }];
      t.currentIndex = t.versions.length - 1;
      copy[threadIndex] = t;
      return copy;
    });

    const response = await fetch(
      "https://llm1.hochschule-stralsund.de:8000/answer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: editingText,
          temperature: 0.7,
          fileIds: [],
        }),
      }
    );
    const data: { answer: string } = await response.json();
    const answer: string = data.answer;

    setThreads(prev => {
      const copy = [...prev];
      const t = { ...copy[threadIndex] };
      const versions = [...t.versions];
      versions[t.currentIndex] = { prompt: editingText, answer };
      t.versions = versions;
      copy[threadIndex] = t;
      return copy;
    });
    handleReset();
  }
};

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [threads]);

  const handlePrevVersion = (threadIndex: number) => {
    setThreads(prev => {
      const copy = [...prev];
      if (!copy[threadIndex]) return prev;
      const t = { ...copy[threadIndex] };
      t.currentIndex = Math.max(0, t.currentIndex - 1);
      copy[threadIndex] = t;
      return copy;
    });
  };
  const handleNextVersion = (threadIndex: number) => {
    setThreads(prev => {
      const copy = [...prev];
      if (!copy[threadIndex]) return prev;
      const t = { ...copy[threadIndex] };
      t.currentIndex = Math.min(t.versions.length - 1, t.currentIndex + 1);
      copy[threadIndex] = t;
      return copy;
    });
  };

  return (
    <div className="min-h-screen max-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-4">
        <div className="flex gap-8 h-[calc(100vh-8rem)]">
          {/* Left Sidebar */}
          <div className="flex-none h-full">
            <div className="sticky top-4 h-[calc(100vh-8rem)]">
              {/* --- REFACTORED: Passing consolidated props to PromptControls --- */}
              <PromptControls
                parameters={parameters}
                onParameterChange={handleParameterChange}
                onReset={handleReset}
                onOptimize={submitAnswerForLatestVersion}
                onUndo={handleUndo}
                chatValue={editingText}
                onChatChange={setEditingText}
                onChatSubmit={handleChatSubmit}
                chatSubmitButtonId="prompt-playground-submit"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 flex flex-col h-[calc(100vh-8rem)]">
            <div className='flex-1 overflow-y-auto' ref={chatEndRef}>
              <ChatBody
                threads={threads}
                onPrevVersion={handlePrevVersion}
                onNextVersion={handleNextVersion}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex-none">
            <EvaluationPanel initialIsOpen={false} />
          </div>
        </div>
      </main >
    </div >
  );
};

export default PromptPlayground;