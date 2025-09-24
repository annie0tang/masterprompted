import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, ArrowUp } from "lucide-react";
import { forwardRef } from 'react';

// Accept an 'id' prop
const SubmitButton = forwardRef<HTMLButtonElement, { onClick?: () => void; id?: string }>(({ onClick, id }, ref) => {
  return (
    <Button
      id={id} // Apply the id here
      onClick={onClick}
      variant="secondary"
      size="icon"
      className="absolute top-2 right-2 rounded-full p-3 ml-4"
      ref={ref}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
});

function UploadFile({ onClick, fileName }: { onClick?: () => void; fileName?: string }) {
  return (
    <div className="absolute bottom-0 left-0 flex items-center gap-0">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={onClick}
      >
        <Paperclip className="h-2 w-2" />
      </Button>
      {fileName && (
        <span className="text-xs opacity-70 overflow-hidden text-ellipsis max-w-[200px]">
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
  return (
    <div 
      className="relative"
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '30px 40px 40px',
        gap: '20px',
        isolation: 'isolate',
        background: '#FFFFFF',
        border: '1px solid #C5C5C5',
        boxShadow: '0px 6px 15px rgba(62, 62, 62, 0.15)',
        borderRadius: '20px',
        marginBottom: '32px'
      }}
    >
      <Textarea
        placeholder="Type your message here..."
        className="pr-12 pb-10 border-none bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
        disabled={!canType}
        defaultValue={text}
        style={{
          fontFamily: 'Manrope',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#1F1F1F'
        }}
      />
      {/* Pass the ID to the SubmitButton */}
      <SubmitButton onClick={onSubmit} id={submitButtonId} /> 
      <UploadFile onClick={onUpload} fileName={fileName} />
    </div>
  );
};

export default Chatbox;