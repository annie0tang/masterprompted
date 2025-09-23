import Header from "@/components/Header";
import { useState } from "react";
import ControlledPopup from "@/components/ControlledDialog";
import UncontrolledPopup from "@/components/UncontrolledDialog";
import { PopoverSeries } from "@/components/PopoverSeries";

const About = () => {

  const [isPopupOpen, setIsPopupOpen] = useState(true);
  
    const steps = [
    {
      id: "step-1",
      trigger: <button>Step 1</button>,
      content: <p>Welcome to Step 1lka sndlka sndkasnd kalsjnds kalj
        ndkasnsdkjasndlkasjndlksajndkaj!</p>,
    },
    {
      id: "step-2",
      trigger: <button>Step 2</button>,
      content: <p>This is Step 2.</p>,
    },
    {
      id: "step-3",
      trigger: <button>Step 3</button>,
      content: <p>You're on Step 3.</p>,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            About
          </h1>

          <div className="bg-card rounded-lg border p-8">
            <p className="text-muted-foreground text-lg">
              This is the About page. Information about the project will be added here soon.
            </p>
          </div>
        </div>
        {/* <ControlledPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)} // This is the crucial part
        /> */}
        {/* <UncontrolledPopup isOpen={false}/> */}
        <PopoverSeries steps={steps}/>

      </main>
    </div>
  );
};

export default About;