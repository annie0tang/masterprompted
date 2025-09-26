import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, ArrowUp } from "lucide-react";
import { forwardRef, useState, useEffect } from 'react';

// Accept an 'id' prop
function SubmitButton({ onClick, id, shouldAnimate }: { onClick?: () => void; id?: string; shouldAnimate?: boolean }) {
  return (
    <Button
      id={id}
      onClick={onClick}
      variant="secondary"
      size="icon"
      className={`absolute top-4 right-4 rounded-full p-3 h-10 w-10 transition-all duration-300 ${
        shouldAnimate ? 'animate-pulse hover:scale-105 animate-[wiggle_0.5s_ease-in-out_infinite]' : ''
      }`}
      style={{
        background: '#1F1F1F',
        border: 'none'
      }}
    >
      <ArrowUp className="h-5 w-5 text-white" />
    </Button>
  );
};

function UploadFile({ onClick, fileName }: { onClick?: () => void; fileName?: string }) {
  return (
    <div className="flex items-center gap-2 mt-4">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full p-1 h-6 w-6"
        onClick={onClick}
      >
        <Paperclip className="h-4 w-4 text-gray-600" />
      </Button>
      {fileName && (
        <span className="text-sm text-gray-600 overflow-hidden text-ellipsis max-w-[200px]">
          {fileName}
        </span>
      )}
    </div>
  );
}

type ChatboxProps = {
  canType?: boolean;
  text?: string;
  onSubmit?: () => void;
  onUpload?: () => void;
  fileName?: string;
  submitButtonId?: string; // Add a new prop for the button ID
};

// No need for forwardRef on Chatbox itself anymore
const Chatbox = ({ canType = true, text = "", onSubmit, onUpload, fileName, submitButtonId }: ChatboxProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Start animation after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Track clicks and start animation after 3 clicks without submission
  const handleChatboxClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShouldAnimate(true);
      }
      return newCount;
    });
  };

  // Reset animation when submit is clicked
  const handleSubmit = () => {
    setShouldAnimate(false);
    setClickCount(0);
    onSubmit?.();
  };

  return (
    <div 
      className="relative mb-8"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E5E5',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: '20px',
        padding: '24px',
        maxWidth: '100%'
      }}
      onClick={handleChatboxClick}
    >
      <Textarea
        placeholder="Type your message here..."
        className="border-none bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 min-h-[60px]"
        disabled={!canType}
        defaultValue={text}
        style={{
          fontFamily: 'Manrope',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#1F1F1F'
        }}
      />
      
      <SubmitButton onClick={handleSubmit} id={submitButtonId} shouldAnimate={shouldAnimate} />
      <UploadFile onClick={onUpload} fileName={fileName} />
    </div>
  );
};

export default Chatbox;