import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Chatbox from "@/components/ChatBox";
import Breadcrumb from "@/components/Breadcrumb";
import { PopoverSeries } from "@/components/PopoverSeries";

export default function NextWordPrediction() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const handleClick = () => {
      if (!buttonClicked) {
        setClickCount(prev => prev + 1);
      }
    };

    const handleDocumentClick = () => {
      handleClick();
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [buttonClicked]);

  useEffect(() => {
    if (clickCount >= 3 && !buttonClicked) {
      setShowPopover(true);
    }
  }, [clickCount, buttonClicked]);

  const handleSubmit = () => {
    setButtonClicked(true);
    navigate("/module/headline-response");
  };

  const popoverSteps = [
    {
      id: "submit-hint",
      trigger: "#chatbox-submit-button",
      content: (
        <div>
          <p className="font-medium mb-2">Ready to submit?</p>
          <p className="text-sm text-muted-foreground">
            Click the submit button to proceed with your headline to the next step.
          </p>
        </div>
      ),
    },
  ];


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Breadcrumb />
        <div className="mb-5"></div>
        <div className="max-w-2xl mx-auto relative min-h-[600px]">
          <Chatbox 
            canType={false} 
            text="Write a headline for a long form journalistic article about ai ethics agreement reached across the eu" 
            fileName="EU_AI_Act.pdf"
            submitButtonId="chatbox-submit-button" // Pass the ID here
            onSubmit={handleSubmit}
          />
        </div>
      </main>
      
      {showPopover && (
        <PopoverSeries 
          steps={popoverSteps}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  );
}