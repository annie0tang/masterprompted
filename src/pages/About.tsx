import Header from "@/components/Header";
import { useState, useRef, useEffect } from "react";
import ControlledPopup from "@/components/DialogPopup";
import { PopoverSeries } from "@/components/PopoverSeries";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {t('about.title')}
          </h1>

          <div className="bg-card rounded-lg border p-8">
            <p className="text-muted-foreground text-lg">
              {t('about.description')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;