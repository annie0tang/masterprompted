import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import ModuleNavigation from "@/components/ModuleNavigation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * NextWordPredictionTakeaways - Summary page showing key learnings from the module
 * Displays numbered takeaway points in a consistent format
 */
export default function Takeaways() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleNextTask = () => {
    navigate("/module/prompt-construction");
  };

  const handleDownload = () => {
    const title = t('nextWord.takeaways.title');
    const subtitle = t('nextWord.takeaways.subtitle');
    const points = [
      { title: t('nextWord.takeaways.point1Title'), body: t('nextWord.takeaways.point1') },
      { title: t('nextWord.takeaways.point2Title'), body: t('nextWord.takeaways.point2') },
      { title: t('nextWord.takeaways.point3Title'), body: t('nextWord.takeaways.point3') },
    ];

    const content = [
      `${title} ${subtitle}`,
      '',
      ...points.map((p, i) => `${i + 1}. ${p.title}${p.body}`),
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'next-word-prediction-takeaways.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-6">
        <Breadcrumb />
        <div className="mb-5" />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h2 font-heading text-foreground mb-2">
            {t('nextWord.takeaways.title')}
          </h1>
          <h2 className="text-h2 font-heading text-foreground mb-12">
            {t('nextWord.takeaways.subtitle')}
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                1
              </div>
              <p className="text-body-1 text-foreground pt-2">
                <span className="font-bold">{t('nextWord.takeaways.point1Title')}</span>
                {t('nextWord.takeaways.point1')}
              </p>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                2
              </div>
              <p className="text-body-1 text-foreground pt-2">
                <span className="font-bold">{t('nextWord.takeaways.point2Title')}</span>
                {t('nextWord.takeaways.point2')}
              </p>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                3
              </div>
              <p className="text-body-1 text-foreground pt-2">
                <span className="font-bold">{t('nextWord.takeaways.point3Title')}</span>
                {t('nextWord.takeaways.point3')}
              </p>
            </div>
          </div>
          
          {/* Download Preview */}
          <div className="mt-12 border border-border rounded-lg bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('promptConstructionModule.takeaways.download')} — Preview
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="rounded-full"
              >
                <Download className="h-4 w-4 mr-2" />
                .txt
              </Button>
            </div>
            <div className="font-mono text-sm text-muted-foreground space-y-2 whitespace-pre-line">
              <p className="font-bold text-foreground">{t('nextWord.takeaways.title')} {t('nextWord.takeaways.subtitle')}</p>
              <p>1. {t('nextWord.takeaways.point1Title')}{t('nextWord.takeaways.point1')}</p>
              <p>2. {t('nextWord.takeaways.point2Title')}{t('nextWord.takeaways.point2')}</p>
              <p>3. {t('nextWord.takeaways.point3Title')}{t('nextWord.takeaways.point3')}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Button 
              onClick={handleNextTask}
              className="bg-secondary hover:bg-secondary/90 text-foreground font-bold px-8 py-6 rounded-full transition-colors"
            >
              {t('nextWord.takeaways.nextTask')}
            </Button>
          </div>
        </div>
      </main>
      
      <ModuleNavigation 
        previousRoute="/module/next-word-prediction/response" 
        nextRoute="/module/prompt-construction"
      />
    </div>
  );
}
