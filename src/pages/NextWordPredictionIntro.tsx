import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NextWordPredictionIntro = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/module/next-word-prediction");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <Breadcrumb />
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[600px] relative">
          <Card 
            className="transition-all duration-200"
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '40px 50px 50px',
              gap: '30px',
              isolation: 'isolate',
              position: 'absolute',
              width: '845px',
              height: '450px',
              left: 'calc(50% - 845px/2 + 0.5px)',
              top: '80px',
              background: '#FFFFFF',
              border: '1px solid #C5C5C5',
              boxShadow: '0px 6px 15px rgba(62, 62, 62, 0.15)',
              borderRadius: '20px'
            }}
          >
            <CardContent className="p-0 w-full h-full flex flex-col justify-between">
              {/* Learning label */}
              <div className="flex items-center justify-between w-full">
                <span className="text-gray-500 text-sm">Learning 1: Next word prediction</span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Content section with illustration */}
              <div className="flex-1 flex items-center gap-8">
                {/* Left side - Illustration */}
                <div className="flex-shrink-0">
                  <div className="relative w-48 h-48">
                    {/* 3D blocks illustration */}
                    <svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Bottom block */}
                      <rect x="20" y="140" width="40" height="20" fill="#A5D6A7" rx="2"/>
                      <rect x="20" y="138" width="40" height="4" fill="#81C784" rx="2"/>
                      
                      {/* Second block */}
                      <rect x="35" y="115" width="40" height="25" fill="#A5D6A7" rx="2"/>
                      <rect x="35" y="113" width="40" height="4" fill="#81C784" rx="2"/>
                      
                      {/* Third block */}
                      <rect x="50" y="88" width="40" height="27" fill="#A5D6A7" rx="2"/>
                      <rect x="50" y="86" width="40" height="4" fill="#81C784" rx="2"/>
                      
                      {/* Fourth block */}
                      <rect x="65" y="58" width="40" height="30" fill="#A5D6A7" rx="2"/>
                      <rect x="65" y="56" width="40" height="4" fill="#81C784" rx="2"/>
                      
                      {/* Fifth block */}
                      <rect x="80" y="25" width="40" height="33" fill="#A5D6A7" rx="2"/>
                      <rect x="80" y="23" width="40" height="4" fill="#81C784" rx="2"/>
                      
                      {/* Sixth block */}
                      <rect x="95" y="10" width="40" height="15" fill="#A5D6A7" rx="2"/>
                      <rect x="95" y="8" width="40" height="4" fill="#81C784" rx="2"/>
                    </svg>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1">
                  {/* Main heading */}
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                    How do LLMs form responses to user prompts?
                  </h1>

                  {/* Description */}
                  <p className="text-gray-600 text-lg leading-relaxed">
                    LLMs generate text by predicting what word should come next. For each prediction, previous words are analysed to calculate probabilities for all possible next words. The most probable word is selected, added to the text, and then used in this updated context to predict the next word, continuing until complete.
                  </p>
                </div>
              </div>

              {/* Continue button */}
              <div className="w-full flex justify-end">
                <Button 
                  onClick={handleContinue}
                  className="transition-all duration-200"
                  style={{ 
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '15px 30px',
                    gap: '12px',
                    width: '140px',
                    height: '50px',
                    background: '#64DB96',
                    borderRadius: '100px',
                    border: 'none',
                    color: '#1F1F1F',
                    fontFamily: 'Manrope',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    fontSize: '16px',
                    lineHeight: '24px'
                  }}
                >
                  Continue
                  <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5H11M11 5L7 1M11 5L7 9" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NextWordPredictionIntro;