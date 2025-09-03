import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LandPlot, PlusCircle, Map, BookOpen } from 'lucide-react';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/spinner';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/context/SupabaseAuthContext';

const MyLandsPage = () => {
  // toast remplacÃ© par window.safeGlobalToast
  const { user } = useAuth();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .eq('seller_id', user.id)
        .eq('type', 'Agricole');
      
      if (error) {
        console.error("Error fetching agricultural lands:", error);
        window.safeGlobalToast({ title: "Erreur", description: "Impossible de charger vos parcelles agricoles.", variant: "destructive" });
      } else {
        setLands(data);
      }
      setLoading(false);
    };
    fetchLands();
  }, [user, toast]);

  const handleAction = (message) => {
    window.safeGlobalToast({ title: "Action Simulée", description: message });
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
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center"><LandPlot className="mr-3 h-8 w-8"/>Mes Parcelles Agricoles</h1>
        <Button onClick={() => handleAction("Recherche de nouvelles parcelles agricoles.")}>
          <PlusCircle className="mr-2 h-4 w-4" /> Trouver une nouvelle parcelle
        </Button>
      </div>

      {lands.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lands.map(land => (
            <Card key={land.id}>
              <CardHeader>
                <CardTitle>{land.name}</CardTitle>
                <CardDescription>Culture principale: {land.culture || 'Non spécifiée'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Surface: {land.area_sqm} m²</p>
                <p className="text-sm">Santé de la culture: <Badge variant="default">{land.sante || 'Bonne'}</Badge></p>
                <div className="flex space-x-2 mt-4">
                  <Button asChild variant="outline" size="sm"><Link to={`/parcelles/${land.id}`}><Map className="mr-1 h-4 w-4" /> Carte</Link></Button>
                  <Button asChild variant="outline" size="sm"><Link to="/dashboard/logbook"><BookOpen className="mr-1 h-4 w-4" /> Journal</Link></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Vous n'avez aucune parcelle agricole enregistrée.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default MyLandsPage;
