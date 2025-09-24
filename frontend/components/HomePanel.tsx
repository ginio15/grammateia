import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface HomePanelProps {
  onNavigate: (screen: string) => void;
}

export function HomePanel({ onNavigate }: HomePanelProps) {
  const categories = [
    { id: "koina-incoming", label: "ΚΟΙΝΑ ΕΙΣΕΡΧΟΜΕΝΑ", icon: "📥" },
    { id: "koina-outgoing", label: "ΚΟΙΝΑ ΕΞΕΡΧΟΜΕΝΑ", icon: "📤" },
    { id: "signals-incoming", label: "ΣΗΜΑΤΑ ΕΙΣΕΡΧΟΜΕΝΑ", icon: "📡" },
    { id: "signals-outgoing", label: "ΣΗΜΑΤΑ ΕΞΕΡΧΟΜΕΝΑ", icon: "📡" },
    { id: "secret-incoming", label: "ΑΠΟΡΡΗΤΑ ΕΙΣΕΡΧΟΜΕΝΑ", icon: "🔒" },
    { id: "secret-outgoing", label: "ΑΠΟΡΡΗΤΑ ΕΞΕΡΧΟΜΕΝΑ", icon: "🔒" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 shadow-lg border-0 bg-white">
          <div className="text-center mb-12">
            <h1 className="text-3xl mb-2 text-slate-800">Κεντρικό Μενού</h1>
            <p className="text-slate-600">Σύστημα Διαχείρισης Εγγράφων</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => onNavigate(category.id)}
                className="h-24 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                </div>
              </Button>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => onNavigate("registrations")}
              variant="outline"
              className="bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
            >
              Προβολή Συνολικών Καταχωρίσεων
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}