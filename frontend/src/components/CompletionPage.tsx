import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CheckCircle } from "lucide-react";

interface CompletionPageProps {
  data: any;
  onNavigate: (screen: string) => void;
  onSaveEntry: (entry: any) => void;
}

export function CompletionPage({ data, onNavigate, onSaveEntry }: CompletionPageProps) {
  const isOutgoing = data.type.includes("outgoing");
  
  const getTitle = () => {
    switch (data.type) {
      case "koina-incoming": return "ΚΟΙΝΑ ΕΙΣΕΡΧΟΜΕΝΑ";
      case "koina-outgoing": return "ΚΟΙΝΑ ΕΞΕΡΧΟΜΕΝΑ";
      case "secret-incoming": return "ΑΠΟΡΡΗΤΑ ΕΙΣΕΡΧΟΜΕΝΑ";
      case "secret-outgoing": return "ΑΠΟΡΡΗΤΑ ΕΞΕΡΧΟΜΕΝΑ";
      case "signals-incoming": return "ΣΗΜΑΤΑ ΕΙΣΕΡΧΟΜΕΝΑ";
      case "signals-outgoing": return "ΣΗΜΑΤΑ ΕΞΕΡΧΟΜΕΝΑ";
      default: return "";
    }
  };

  const handleSave = () => {
    onSaveEntry(data);
    alert("Η καταχώριση ολοκληρώθηκε επιτυχώς!");
  };

  const handleNewEntry = () => {
    onNavigate(data.type);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg border-0 bg-white">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-2xl mb-2 text-slate-800">Ολοκλήρωση Καταχώρισης</h1>
            <p className="text-slate-600">{getTitle()}</p>
            <div className="w-12 h-1 bg-green-500 rounded mx-auto mt-4"></div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-green-700">ΑΡΙΘΜ. ΠΡΩΤΟΚ:</span>
                  <div className="text-lg text-green-800">{data.protocolNumber}</div>
                </div>
                {isOutgoing && (
                  <div>
                    <span className="text-sm text-green-700">ΑΡΙΘΜ. ΣΧΕΔΙΟΥ:</span>
                    <div className="text-lg text-green-800">{data.schemaNumber}</div>
                  </div>
                )}
              </div>
            </div>

            {data.selectedOffices && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <span className="text-sm text-blue-700 block mb-2">Επιλεγμένα Γραφεία:</span>
                <div className="flex flex-wrap gap-1">
                  {data.selectedOffices.map((office: string) => (
                    <span
                      key={office}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                    >
                      {office}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div><span className="text-slate-600">Ημερομηνία:</span> <span className="text-slate-800">{new Date().toLocaleDateString('el-GR')}</span></div>
                <div><span className="text-slate-600">Ώρα:</span> <span className="text-slate-800">{new Date().toLocaleTimeString('el-GR')}</span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Καταχώριση
            </Button>
            <Button 
              onClick={handleNewEntry}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Νέα Καταχώριση
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => onNavigate("home")}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Επιστροφή στο Μενού
            </Button>
            <Button 
              onClick={() => onNavigate("registrations")}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Προβολή Συνολικών Καταχωρίσεων
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}