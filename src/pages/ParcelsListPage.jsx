
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParcelCard from '@/components/parcels/ParcelCard';
import ParcelFilters from '@/components/parcels/ParcelFilters';
import ParcelListSkeleton from '@/components/parcels/ParcelListSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ListFilter, Map, Save, Landmark } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import ParcelsHeroSearch from '@/components/parcels/ParcelsHeroSearch';
import { Helmet } from 'react-helmet-async';
import NoResultsFound from '@/components/parcels/NoResultsFound';
import { supabase } from '@/lib/customSupabaseClient';

const ParcelsListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFiltersAside, setShowFiltersAside] = useState(false);

  const initialFiltersFromUrl = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      search: searchParams.get('search') || '',
      zone: searchParams.get('zone') || 'all',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minArea: searchParams.get('minArea') || '',
      maxArea: searchParams.get('maxArea') || '',
      sortBy: searchParams.get('sortBy') || 'date_desc',
      ownerType: searchParams.get('ownerType') || 'all',
    };
  }, [location.search]);

  const [activeFilters, setActiveFilters] = useState(initialFiltersFromUrl);

  useEffect(() => {
    const fetchParcels = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('parcels')
                .select('*')
                .in('status', ['Disponible', 'Attribution sur demande']);
            
            if (fetchError) throw fetchError;

            setParcels(data);
        } catch (err) {
            console.error("Erreur de chargement des parcelles:", err);
            setError("Impossible de charger les parcelles pour le moment.");
        } finally {
            setLoading(false);
        }
    };
    fetchParcels();
  }, []);

  useEffect(() => {
    let tempParcels = [...parcels];

    if (activeFilters.search) {
      tempParcels = tempParcels.filter(p =>
        p.name.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
        p.reference.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(activeFilters.search.toLowerCase()))
      );
    }
    if (activeFilters.zone && activeFilters.zone !== 'all') {
        tempParcels = tempParcels.filter(p => p.zone === activeFilters.zone);
    }
    if (activeFilters.ownerType && activeFilters.ownerType !== 'all') {
        tempParcels = tempParcels.filter(p => p.owner_type === activeFilters.ownerType);
    }

    if (activeFilters.minPrice) {
      tempParcels = tempParcels.filter(p => p.price >= parseFloat(activeFilters.minPrice));
    }
    if (activeFilters.maxPrice) {
      tempParcels = tempParcels.filter(p => p.price <= parseFloat(activeFilters.maxPrice));
    }
    if (activeFilters.minArea) {
      tempParcels = tempParcels.filter(p => p.area_sqm >= parseInt(activeFilters.minArea, 10));
    }
    if (activeFilters.maxArea) {
      tempParcels = tempParcels.filter(p => p.area_sqm <= parseInt(activeFilters.maxArea, 10));
    }
    
    switch (activeFilters.sortBy) {
      case 'price_asc': tempParcels.sort((a, b) => (a.price || Infinity) - (b.price || Infinity)); break;
      case 'price_desc': tempParcels.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'area_asc': tempParcels.sort((a, b) => a.area_sqm - b.area_sqm); break;
      case 'area_desc': tempParcels.sort((a, b) => b.area_sqm - a.area_sqm); break;
      case 'date_desc': 
      default: 
        tempParcels.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); 
        break;
    }

    setFilteredParcels(tempParcels);

    const queryParams = new URLSearchParams();
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== false && value !== '') {
        queryParams.set(key, value);
      }
    });
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });

  }, [activeFilters, parcels, navigate, location.pathname]);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '', zone: 'all', minPrice: '', maxPrice: '',
      minArea: '', maxArea: '', sortBy: 'date_desc', ownerType: 'all',
    };
    setActiveFilters(defaultFilters);
  };

  const handleSaveSearch = () => {
    toast({
      title: "Sauvegarder la Recherche",
      description: "🚧 Cette fonctionnalité est en cours de développement. Bientôt, vous pourrez sauvegarder vos critères et recevoir des alertes !",
      duration: 5000,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <>
    <Helmet>
        <title>Terrains à Vendre au Sénégal - Teranga Foncier</title>
        <meta name="description" content="Parcourez notre catalogue de terrains et parcelles vérifiés à vendre à Dakar, Saly, Thiès et partout au Sénégal. Filtrez par prix, surface et statut juridique." />
        <meta name="keywords" content="terrains à vendre, parcelles Sénégal, immobilier Dakar, acheter terrain Saly, foncier Thiès" />
        <link rel="canonical" href="https://www.terangafoncier.com/parcelles" />
    </Helmet>
    <div className="bg-muted/20">
      <ParcelsHeroSearch onSearch={handleFilterChange} initialFilters={activeFilters} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className={`w-full md:w-1/3 lg:w-1/4 ${showFiltersAside ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-24">
              <ParcelFilters
                filters={activeFilters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                parcelCount={filteredParcels.length}
              />
              <Card className="mt-4 p-4 text-center bg-secondary/30">
                  <CardTitle className="text-base mb-2 flex items-center justify-center"><Landmark className="h-5 w-5 mr-2"/>Besoin d'un terrain communal ?</CardTitle>
                  <CardDescription className="text-xs mb-3">Faites une demande directe auprès des mairies partenaires pour des parcelles spécifiques.</CardDescription>
                  <Button asChild size="sm" className="w-full">
                      <Link to="/request-municipal-land">Faire une Demande</Link>
                  </Button>
              </Card>
            </div>
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <p className="text-sm text-muted-foreground">
                {loading ? 'Chargement...' : `${filteredParcels.length} parcelle(s) trouvée(s).`}
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                <Button variant="outline" onClick={() => setShowFiltersAside(!showFiltersAside)} className="md:hidden">
                  <ListFilter className="mr-2 h-4 w-4" /> {showFiltersAside ? 'Cacher' : 'Afficher'} les Filtres
                </Button>
                <Button variant="outline" onClick={handleSaveSearch}>
                  <Save className="mr-2 h-4 w-4" /> Sauvegarder
                </Button>
                <Button variant="default" asChild>
                  <Link to="/map"><Map className="mr-2 h-4 w-4" /> Carte</Link>
                </Button>
              </div>
            </div>

            {loading ? (
              <ParcelListSkeleton />
            ) : error ? (
              <div className="text-center py-10 text-red-600 bg-red-50 p-6 rounded-lg border border-red-200">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-red-500"/>
                <p className="text-lg font-medium">{error}</p>
                <p className="text-sm">Veuillez réessayer plus tard.</p>
              </div>
            ) : filteredParcels.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredParcels.map(parcel => (
                  <ParcelCard key={parcel.id} parcel={parcel} />
                ))}
              </motion.div>
            ) : (
              <NoResultsFound 
                searchedZone={activeFilters.zone !== 'all' ? activeFilters.zone : 'cette zone'}
                onResetFilters={handleResetFilters}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ParcelsListPage;
