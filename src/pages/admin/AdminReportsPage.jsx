
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart2, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { sampleAdminDashboardData } from '@/data/index.js';
import { LoadingSpinner } from '@/components/ui/spinner';

const AdminReportsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateReport = () => {
    toast({
      title: "Génération de Rapport (Simulation)",
      description: "Le rapport CSV est en cours de préparation et sera téléchargé.",
    });
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
      <h1 className="text-3xl font-bold">Rapports et Statistiques</h1>

      <Card>
        <CardHeader>
          <CardTitle>Générer un Rapport</CardTitle>
          <CardDescription>Sélectionnez les critères pour générer un rapport personnalisé.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label className="text-sm font-medium block mb-1">Type de Rapport</label>
                <select className="w-full p-2 border rounded">
                    <option>Ventes</option>
                    <option>Demandes</option>
                    <option>Utilisateurs</option>
                    <option>Performance Agent</option>
                </select>
             </div>
             <div>
                <label className="text-sm font-medium block mb-1">Période</label>
                 <input type="date" className="w-full p-2 border rounded" />
             </div>
             <div>
                <label className="text-sm font-medium block mb-1">Zone Géographique</label>
                <select className="w-full p-2 border rounded">
                    <option>Toutes</option>
                    <option>Dakar</option>
                    <option>Thiès</option>
                </select>
             </div>
          </div>
          <Button onClick={handleGenerateReport}>
            <Download className="mr-2 h-4 w-4" /> Générer et Télécharger (CSV)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques Clés</CardTitle>
          <CardDescription>Aperçu rapide des performances.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
             <div className="p-4 bg-muted rounded">
                <BarChart2 className="h-8 w-8 mx-auto mb-2 text-primary"/>
                <p className="text-xl font-bold">75%</p>
                <p className="text-sm text-muted-foreground">Taux de Conversion (Demande → Visite)</p>
             </div>
             <div className="p-4 bg-muted rounded">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary"/>
                <p className="text-xl font-bold">Diamniadio</p>
                <p className="text-sm text-muted-foreground">Zone la Plus Demandée (Mois)</p>
             </div>
          </div>
          <p className="mt-6 text-center text-muted-foreground">Plus de graphiques et d'analyses seront disponibles ici.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminReportsPage;
