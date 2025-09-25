import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { listRegistrations, Registration } from "../services/api";

interface RegistrationsPageProps {
  onNavigate: (screen: string) => void;
}

export function RegistrationsPage({ onNavigate }: RegistrationsPageProps) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [entries, setEntries] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const result = await listRegistrations(month);
        setEntries(result.items || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  // Map backend category to frontend type
  const mapCategoryToType = (category: string): string => {
    const mapping: Record<string, string> = {
      'common_incoming': 'koina-incoming',
      'common_outgoing': 'koina-outgoing',
      'confidential_incoming': 'secret-incoming',
      'confidential_outgoing': 'secret-outgoing',
      'signals_incoming': 'signals-incoming',
      'signals_outgoing': 'signals-outgoing'
    };
    return mapping[category] || category;
  };

  const getTypeLabel = (category: string) => {
    const type = mapCategoryToType(category);
    const labels: Record<string, string> = {
      "koina-incoming": "ΚΟΙΝΑ ΕΙΣΕΡΧΟΜΕΝΑ",
      "koina-outgoing": "ΚΟΙΝΑ ΕΞΕΡΧΟΜΕΝΑ",
      "secret-incoming": "ΑΠΟΡΡΗΤΑ ΕΙΣΕΡΧΟΜΕΝΑ", 
      "secret-outgoing": "ΑΠΟΡΡΗΤΑ ΕΞΕΡΧΟΜΕΝΑ",
      "signals-incoming": "ΣΗΜΑΤΑ ΕΙΣΕΡΧΟΜΕΝΑ",
      "signals-outgoing": "ΣΗΜΑΤΑ ΕΞΕΡΧΟΜΕΝΑ"
    };
    return labels[type] || type;
  };

  const getTypeCategory = (category: string) => {
    const type = mapCategoryToType(category);
    if (type.includes("koina")) return "ΚΟΙΝΑ";
    if (type.includes("secret")) return "ΑΠΟΡΡΗΤΑ";
    if (type.includes("signals")) return "ΣΗΜΑΤΑ";
    return "";
  };

  const getBadgeVariant = (category: string): "default" | "secondary" | "destructive" | "outline" => {
    const type = mapCategoryToType(category);
    if (type.includes("koina")) return "default";
    if (type.includes("secret")) return "destructive";
    if (type.includes("signals")) return "secondary";
    return "outline";
  };

  const filteredEntries = entries.filter(entry => {
    if (filter === "all") return true;
    return getTypeCategory(entry.category) === filter;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "protocol") {
      return (b.protocolNumber || 0) - (a.protocolNumber || 0);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="p-8 shadow-lg border-0 bg-white">
          <div className="mb-8">
            <h1 className="text-2xl mb-2 text-slate-800">Συνολικές Καταχωρίσεις</h1>
            <p className="text-slate-600">Προβολή όλων των καταχωρίσεων εγγράφων</p>
            <div className="w-12 h-1 bg-blue-600 rounded mt-4"></div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-slate-600">Φόρτωση καταχωρίσεων...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">Σφάλμα: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Επανάληψη
              </Button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Φίλτρο:</span>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλα</SelectItem>
                  <SelectItem value="ΚΟΙΝΑ">ΚΟΙΝΑ</SelectItem>
                  <SelectItem value="ΑΠΟΡΡΗΤΑ">ΑΠΟΡΡΗΤΑ</SelectItem>
                  <SelectItem value="ΣΗΜΑΤΑ">ΣΗΜΑΤΑ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Ταξινόμηση:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Ημερομηνία</SelectItem>
                  <SelectItem value="protocol">Αρ. Πρωτοκόλλου</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {sortedEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">📄</div>
              <p className="text-slate-600">Δεν υπάρχουν καταχωρίσεις</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-slate-700">Τύπος</TableHead>
                    <TableHead className="text-slate-700">Αρ. Πρωτοκόλλου</TableHead>
                    <TableHead className="text-slate-700">Εκδότης</TableHead>
                    <TableHead className="text-slate-700">Θέμα</TableHead>
                    <TableHead className="text-slate-700">Ημερομηνία</TableHead>
                    <TableHead className="text-slate-700">Γραφεία</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEntries.map((entry, index) => (
                    <TableRow key={entry.id || index} className="hover:bg-slate-50">
                      <TableCell>
                        <Badge variant={getBadgeVariant(entry.category)} className="text-xs">
                          {getTypeCategory(entry.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {entry.protocolNumber || '-'}
                      </TableCell>
                      <TableCell className="max-w-32 truncate">
                        {entry.issuer || '-'}
                      </TableCell>
                      <TableCell className="max-w-48 truncate">
                        {entry.subject || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(entry.createdAt).toLocaleDateString('el-GR')}
                      </TableCell>
                      <TableCell>
                        {entry.offices && entry.offices.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {entry.offices.slice(0, 2).map((office: string) => (
                              <span
                                key={office}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                              >
                                {office}
                              </span>
                            ))}
                            {entry.offices.length > 2 && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                +{entry.offices.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button 
              onClick={() => onNavigate("home")}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Επιστροφή στο Μενού
            </Button>
          </div>

              <div className="mt-6 text-center text-sm text-slate-500">
                Σύνολο καταχωρίσεων: {entries.length}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}