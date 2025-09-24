import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface SelectionPageProps {
  data: any;
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function SelectionPage({ data, onNavigate, onBack }: SelectionPageProps) {
  const [selectedOffices, setSelectedOffices] = useState<string[]>([]);

  const offices = [
    "1ο ΓΡΑΦΕΙΟ",
    "2ο ΓΡΑΦΕΙΟ", 
    "3ο ΓΡΑΦΕΙΟ",
    "4ο ΓΡΑΦΕΙΟ",
    "ΓΔΥ",
    "ΓΡΑΦΕΙΟ ΔΟΣΟΛΗΨΕΩΝ",
    "ΣΥΝΔΕΣΜΟΣ ΤΘ",
    "ΤΜΗΜΑ ΠΟΛΙΤΙΚΟΥ ΠΡΟΣ"
  ];

  const handleOfficeChange = (office: string, checked: boolean) => {
    if (checked) {
      setSelectedOffices(prev => [...prev, office]);
    } else {
      setSelectedOffices(prev => prev.filter(o => o !== office));
    }
  };

  const handleSubmit = () => {
    if (selectedOffices.length === 0) {
      alert("Παρακαλώ επιλέξτε τουλάχιστον ένα γραφείο");
      return;
    }

    // Generate protocol number
    const protocolNumber = Math.floor(Math.random() * 10000) + 1000;
    
    const finalData = {
      ...data,
      selectedOffices,
      protocolNumber
    };

    onNavigate("completion", finalData);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg border-0 bg-white">
          <div className="mb-8">
            <h1 className="text-2xl mb-2 text-slate-800">Επιλογή Γραφείων</h1>
            <p className="text-slate-600">Επιλέξτε τα γραφεία που θα λάβουν το έγγραφο</p>
            <div className="w-12 h-1 bg-blue-600 rounded mt-4"></div>
          </div>

          <div className="space-y-4 mb-8">
            {offices.map((office) => (
              <div key={office} className="flex items-center space-x-3">
                <Checkbox
                  id={office}
                  checked={selectedOffices.includes(office)}
                  onCheckedChange={(checked) => handleOfficeChange(office, checked as boolean)}
                  className="border-slate-300"
                />
                <Label 
                  htmlFor={office}
                  className="text-slate-700 cursor-pointer hover:text-slate-900"
                >
                  {office}
                </Label>
              </div>
            ))}
          </div>

          {selectedOffices.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm text-blue-800 mb-2">Επιλεγμένα Γραφεία:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedOffices.map((office) => (
                  <span
                    key={office}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {office}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={selectedOffices.length === 0}
            >
              Ολοκλήρωση
            </Button>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Επιστροφή
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}