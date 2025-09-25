import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";

export default function Takeaways() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Breadcrumb />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Key Takeaways</h1>
          
          <div className="space-y-6">
            <div className="p-6 border border-border rounded-lg bg-card">
              <h2 className="text-xl font-semibold text-foreground mb-4">Understanding AI Text Generation</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• AI models predict the next most likely word based on training data and context</li>
                <li>• Probability scores indicate how confident the model is in each word choice</li>
                <li>• Higher probability doesn't always mean better content quality</li>
              </ul>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-card">
              <h2 className="text-xl font-semibold text-foreground mb-4">Journalistic Evaluation Criteria</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Factual accuracy is paramount when evaluating AI-generated content</li>
                <li>• Consider bias, tone, and appropriate language for your audience</li>
                <li>• Always verify claims and cross-reference with reliable sources</li>
              </ul>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-card">
              <h2 className="text-xl font-semibold text-foreground mb-4">Best Practices</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Use AI as a starting point, not the final product</li>
                <li>• Human oversight and editing remain essential</li>
                <li>• Understanding model behavior helps make better editorial decisions</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}