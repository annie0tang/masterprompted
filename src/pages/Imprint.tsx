import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

const Imprint = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {t('imprint.title')}
          </h1>
          
          <div className="bg-card rounded-lg border p-8">
            <p className="text-muted-foreground text-lg">
              {t('imprint.description')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Imprint;