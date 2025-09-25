import { useState } from "react";
import { createRegistration, mapFrontendTypeToBackendCategory } from "../services/api";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface DocumentFormProps {
  type: string;
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function DocumentForm({ type, onNavigate, onBack }: DocumentFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('el-GR');
  };

  const getFormConfig = () => {
    switch (type) {
      case "koina-incoming":
        return {
          title: "ΚΟΙΝΑ ΕΙΣΕΡΧΟΜΕΝΑ",
          fields: [
            { id: "publisher", label: "ΕΚΔΟΤΗΣ ΕΓΓΡΑΦΟΥ", required: true },
            { id: "phi", label: "φ", required: true },
            { id: "dateDoc", label: "ΗΜΕΡ. Φ", required: true, type: "date" },
            { id: "subject", label: "ΘΕΜΑ Φ", required: true },
            { id: "dateEntry", label: "ΗΜΕΡ. ΕΙΣΟΔΟΥ", value: getCurrentDate(), readonly: true }
          ],
          needsSelection: true
        };
      
      case "koina-outgoing":
        return {
          title: "ΚΟΙΝΑ ΕΞΕΡΧΟΜΕΝΑ",
          fields: [
            { id: "publisher", label: "ΕΚΔΟΤΗΣ ΕΓΓΡΑΦΟΥ", required: true },
            { id: "phi", label: "φ", required: true },
            { id: "dateDoc", label: "ΗΜΕΡ. Φ", required: true, type: "date" },
            { id: "subject", label: "ΘΕΜΑ Φ", required: true },
            { id: "dateEntry", label: "ΗΜΕΡ. ΕΙΣΟΔΟΥ", value: getCurrentDate(), readonly: true },
            { id: "recipient", label: "ΠΑΡΑΛΗΠΤΗΣ", required: true }
          ],
          needsSelection: false
        };

      case "secret-incoming":
        return {
          title: "ΑΠΟΡΡΗΤΑ ΕΙΣΕΡΧΟΜΕΝΑ",
          fields: [
            { id: "publisher", label: "ΕΚΔΟΤΗΣ ΑΠΟΡΡΗΤΟΥ", required: true },
            { id: "phi", label: "φ", required: true },
            { id: "dateDoc", label: "ΗΜΕΡ. Φ", required: true, type: "date" },
            { id: "subject", label: "ΘΕΜΑ Φ", required: true },
            { id: "dateEntry", label: "ΗΜΕΡ. ΕΙΣΟΔΟΥ", value: getCurrentDate(), readonly: true }
          ],
          needsSelection: true
        };

      case "secret-outgoing":
        return {
          title: "ΑΠΟΡΡΗΤΑ ΕΞΕΡΧΟΜΕΝΑ",
          fields: [
            { id: "publisher", label: "ΕΚΔΟΤΗΣ ΑΠΟΡΡΗΤΟΥ", required: true },
            { id: "phi", label: "φ", required: true },
            { id: "dateDoc", label: "ΗΜΕΡ. Φ", required: true, type: "date" },
            { id: "subject", label: "ΘΕΜΑ Φ", required: true },
            { id: "dateEntry", label: "ΗΜΕΡ. ΕΙΣΟΔΟΥ", value: getCurrentDate(), readonly: true },
            { id: "recipient", label: "ΠΑΡΑΛΗΠΤΗΣ", required: true }
          ],
          needsSelection: false
        };

      case "signals-incoming":
        return {
          title: "ΣΗΜΑΤΑ ΕΙΣΕΡΧΟΜΕΝΑ",
          fields: [
            { id: "publisher", label: "ΕΚΔΟΤΗΣ ΣΗΜΑΤΟΣ", required: true },
            { id: "sic", label: "SIC", required: true },
            { id: "dateSignal", label: "ΗΜΕΡ. ΣΗΜΑΤΟΣ", required: true, type: "date" },
            { id: "subject", label: "ΘΕΜΑ ΣΗΜΑΤΟΣ", required: true },
            { id: "dateEntry", label: "ΗΜΕΡ. ΕΙΣΟΔΟΥ", value: getCurrentDate(), readonly: true }
          ],
          needsSelection: true
        };

      case "signals-outgoing":
        return {
          title: "ΣΗΜΑΤΑ ΕΞΕΡΧΟΜΕΝΑ",
          fields: [
            { id: "publisher", label: "ΕΚΔΟΤΗΣ ΣΗΜΑΤΟΣ", required: true },
            { id: "sic", label: "SIC", required: true },
            { id: "dateSic", label: "ΗΜΕΡ. SIC", required: true, type: "date" },
            { id: "subject", label: "ΘΕΜΑ ΣΗΜΑΤΟΣ", required: true },
            { id: "dateEntry", label: "ΗΜΕΡ. ΕΙΣΟΔΟΥ", value: getCurrentDate(), readonly: true },
            { id: "recipient", label: "ΠΑΡΑΛΗΠΤΗΣ", required: true }
          ],
          needsSelection: false
        };

      default:
        return { title: "", fields: [], needsSelection: false };
    }
  };

  const config = getFormConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, type, timestamp: new Date().toISOString() };

    if (config.needsSelection) {
      onNavigate("selection", data);
      return;
    }

    const category = mapFrontendTypeToBackendCategory(type);
    if (!category) {
      alert("Unsupported category");
      return;
    }
    try {
      const payload: any = {
        issuer: formData.publisher || "",
        referenceNumber: formData.phi || "",
        subject: formData.subject || "",
      };
      if (type.endsWith("outgoing")) {
        payload.recipient = formData.recipient || "";
      }
      const created = await createRegistration(category, payload);
      onNavigate("completion", { ...data, protocolNumber: created.protocolNumber, schemaNumber: created.draftNumber ?? undefined });
    } catch (err: any) {
      alert(err.message || String(err));
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg border-0 bg-white">
          <div className="mb-8">
            <h1 className="text-2xl mb-2 text-slate-800">{config.title}</h1>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {config.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-slate-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  id={field.id}
                  type={field.type || "text"}
                  value={field.value || formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  readOnly={field.readonly}
                  className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Συνέχεια
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Επιστροφή
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}