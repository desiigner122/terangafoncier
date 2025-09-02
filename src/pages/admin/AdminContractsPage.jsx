
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { jsPDF } from "jspdf"; 
import { useToast } from "@/components/ui/use-toast-simple"; 
import { LoadingSpinner } from '@/components/ui/spinner';

const initialSampleContracts = [
  { id: 'CONTR-001', type: 'Vente', parcelId: 'SL042', userName: 'Client A', date: '2025-04-10', status: 'Signé' },
  { id: 'CONTR-002', type: 'Réservation', parcelId: 'TH015', userName: 'Client B', date: '2025-04-20', status: 'En attente signature' },
];

const AdminContractsPage = () => {
  const { toast } = useToast(); 
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContracts(initialSampleContracts);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const generatePdf = (contract) => {
     const doc = new jsPDF();
     doc.setFontSize(16);
     doc.text(`Contrat ${contract.type} - ${contract.id}`, 10, 10);
     doc.setFontSize(12);
     doc.text(`Date: ${contract.date}`, 10, 20);
     doc.text(`Client: ${contract.userName}`, 10, 30);
     doc.text(`Parcelle: ${contract.parcelId}`, 10, 40);
     doc.text(`Statut: ${contract.status}`, 10, 50);
     doc.text("--------------------------------------------------", 10, 60);
     doc.text("Contenu du contrat (placeholder)...", 10, 70);
     doc.text("Signatures (placeholder)...", 10, 100);
     doc.save(`contrat_${contract.id}.pdf`);

     toast({
        title: "PDF Généré",
        description: `Le fichier contrat_${contract.id}.pdf a été téléchargé.`,
     });
  };

  const handleSimulatedAction = (message) => {
    toast({ title: "Action Simulée", description: message });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Gestion des Contrats</h1>

      <Card>
        <CardHeader>
          <CardTitle>Contrats Générés</CardTitle>
          <CardDescription>Consultez et gérez les contrats de vente et de réservation.</CardDescription>
           <div className="flex space-x-2 pt-4">
              <div className="relative flex-1">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Rechercher par ID, Parcelle, Client..." className="pl-8" />
              </div>
              <Button variant="outline" onClick={() => handleSimulatedAction("Ouverture des filtres de contrats.")}><Filter className="mr-2 h-4 w-4"/> Filtrer</Button>
           </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID Contrat</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Parcelle ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.parcelId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" title="Télécharger PDF" onClick={() => generatePdf(contract)}>
                         <Download className="h-4 w-4"/>
                      </Button>
                      <Button variant="link" size="sm" onClick={() => handleSimulatedAction(`Affichage des détails du contrat ${contract.id}.`)}>Détails</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {contracts.length === 0 && <p className="text-center text-muted-foreground py-4">Aucun contrat trouvé.</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminContractsPage;
