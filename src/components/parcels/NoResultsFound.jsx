import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Landmark, 
  Heart
} from 'lucide-react';
// useToast import supprimÃ© - utilisation window.safeGlobalToast

const NoResultsFound = ({ searchedZone, onResetFilters }) => {
  // toast remplacÃ© par window.safeGlobalToast

  const handleSaveSearch = () => {
    window.safeGlobalToast({
      title: "Recherche Sauvegardée (Simulation)",
      description: `Nous vous alerterons dès qu'un terrain sera disponible à ${searchedZone}.`,
    });
  };

  return (
    <Card className="w-full text-center py-10 px-6 bg-muted/30 border-dashed">
      <CardHeader>
        <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <CardTitle className="text-2xl font-semibold">Aucun terrain trouvé à {searchedZone}</CardTitle>
        <CardDescription className="max-w-md mx-auto">
          Il n'y a actuellement aucune parcelle disponible auprès de nos vendeurs partenaires dans cette zone. Voici d'autres options :
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link to={`/request-municipal-land?zone=${searchedZone}`}>
            <Landmark className="mr-2 h-5 w-5" />
            Demander à la Mairie
          </Link>
        </Button>
        <Button variant="secondary" size="lg" onClick={handleSaveSearch}>
          <Heart className="mr-2 h-5 w-5" />
          M'alerter si disponible
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoResultsFound;
