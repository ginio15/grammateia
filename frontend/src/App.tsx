import { useState } from "react";
import { HomePanel } from "./components/HomePanel";
import { DocumentForm } from "./components/DocumentForm";
import { SelectionPage } from "./components/SelectionPage";
import { CompletionPage } from "./components/CompletionPage";
import { RegistrationsPage } from "./components/RegistrationsPage";
import { createRegistration, mapFrontendTypeToBackendCategory, RegistrationCreate } from "./services/api";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [currentData, setCurrentData] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (screen: string, data?: any) => {
    setCurrentScreen(screen);
    if (data) {
      setCurrentData(data);
    }
  };

  const handleBack = () => {
    setCurrentScreen("home");
    setCurrentData(null);
  };

  const handleSaveEntry = async (entry: any) => {
    setIsLoading(true);
    try {
      // Map frontend type to backend category
      const category = mapFrontendTypeToBackendCategory(entry.type);
      if (!category) {
        throw new Error(`Unknown registration type: ${entry.type}`);
      }

      // Map frontend form data to backend API format
      const apiPayload: RegistrationCreate = {
        issuer: entry.publisher || entry.issuer,
        referenceNumber: entry.phi || entry.sic || entry.referenceNumber,
        subject: entry.subject,
        recipient: entry.recipient,
        offices: entry.selectedOffices,
        entryDate: entry.dateEntry ? new Date(entry.dateEntry).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };

      // Call the backend API
      const savedRegistration = await createRegistration(category, apiPayload);
      
      // Update local state with the saved registration for immediate UI feedback
      const frontendEntry = {
        ...entry,
        id: savedRegistration.id,
        protocolNumber: savedRegistration.protocolNumber,
        draftNumber: savedRegistration.draftNumber,
        createdAt: savedRegistration.createdAt,
        timestamp: savedRegistration.createdAt
      };
      
      setEntries(prev => [...prev, frontendEntry]);
      
      alert("Η καταχώριση αποθηκεύτηκε επιτυχώς στη βάση δεδομένων!");
    } catch (error) {
      console.error('Failed to save registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Σφάλμα κατά την αποθήκευση: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomePanel onNavigate={handleNavigate} />;
      
      case "koina-incoming":
      case "koina-outgoing":
      case "secret-incoming":
      case "secret-outgoing":
      case "signals-incoming":
      case "signals-outgoing":
        return (
          <DocumentForm
            type={currentScreen}
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        );
      
      case "selection":
        return (
          <SelectionPage
            data={currentData}
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        );
      
      case "completion":
        return (
          <CompletionPage
            data={currentData}
            onNavigate={handleNavigate}
            onSaveEntry={handleSaveEntry}
            isLoading={isLoading}
          />
        );
      
      case "registrations":
        return (
          <RegistrationsPage
            onNavigate={handleNavigate}
          />
        );
      
      default:
        return <HomePanel onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {renderScreen()}
    </div>
  );
}