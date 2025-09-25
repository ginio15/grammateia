import { useState } from "react";
import { HomePanel } from "./components/HomePanel";
import { DocumentForm } from "./components/DocumentForm";
import { SelectionPage } from "./components/SelectionPage";
import { CompletionPage } from "./components/CompletionPage";
import { RegistrationsPage } from "./components/RegistrationsPage";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [currentData, setCurrentData] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);

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

  const handleSaveEntry = (entry: any) => {
    setEntries(prev => [...prev, entry]);
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
          />
        );
      
      case "registrations":
        return (
          <RegistrationsPage
            entries={entries}
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