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
    <div className="relative">
      <Textarea
        placeholder="Type your message here..."
        className="pr-12 pb-10"
        disabled={!canType}
        defaultValue={text}
      />
      {/* Pass the ID to the SubmitButton */}
      <SubmitButton onClick={onSubmit} id={submitButtonId} /> 
      <UploadFile onClick={onUpload} fileName={fileName} />
    </div>
  );
};

export default Chatbox;