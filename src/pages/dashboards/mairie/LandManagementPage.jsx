import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LandPlot, PlusCircle, Search, Filter, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/spinner';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/context/SupabaseAuthContext';

const LandManagementPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMunicipalParcels = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .eq('owner_type', 'Mairie'); // Assuming the admin/mairie user is associated with one
      
      if (error) {
        console.error("Error fetching municipal parcels:", error);
        toast({ title: "Erreur", description: "Impossible de charger le patrimoine foncier.", variant: "destructive" });
      } else {
        setParcels(data);
      }
      setLoading(false);
    };
    fetchMunicipalParcels();
  }, [user, toast]);

  const handleAddParcel = () => {
    toast({ title: "Action non implémentée", description: "Utilisez la page 'Ajouter une parcelle' pour créer de nouvelles annonces." });
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 md:p-6 lg:p-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center"><LandPlot className="mr-3 h-8 w-8"/>Gestion Foncière Communale</h1>
        <Button asChild>
          <Link to="/add-parcel">
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Terrain
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patrimoine Foncier de la Commune</CardTitle>
          <div className="flex space-x-2 pt-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une parcelle..." className="pl-8" />
            </div>
            <Button variant="outline" onClick={() => toast({title: "Filtres appliqués"})}><Filter className="mr-2 h-4 w-4" /> Filtrer</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Référence</th>
                  <th className="text-left p-2 font-semibold">Localisation</th>
                  <th className="text-left p-2 font-semibold">Surface (m²)</th>
                  <th className="text-left p-2 font-semibold">Statut</th>
                  <th className="text-right p-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map(p => (
                  <tr key={p.id} className="border-b hover:bg-muted/30">
                    <td className="p-2 font-mono">{p.reference}</td>
                    <td className="p-2">{p.location_name}</td>
                    <td className="p-2">{p.area_sqm}</td>
                    <td className="p-2"><Badge variant={p.status === 'Attribution sur demande' ? 'info' : 'secondary'}>{p.status}</Badge></td>
                    <td className="p-2 text-right">
                      <Button asChild variant="outline" size="sm"><Link to={`/parcelles/${p.id}`}><Eye className="mr-1 h-4 w-4" />Détails</Link></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LandManagementPage;