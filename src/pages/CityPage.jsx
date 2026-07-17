import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import {
  MapPin,
  Users,
  TrendingUp,
  Building,
  Landmark,
  Star,
  CheckCircle,
  Info,
  ArrowRight,
  Send,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Home,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

const CityPage = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parcels, setParcels] = useState([]);
  const [currentParcelIndex, setCurrentParcelIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', message }
  const [requestForm, setRequestForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredLocation: '',
    budgetRange: '',
    landSize: '',
    purpose: '',
    timeline: '',
    additionalInfo: ''
  });

  useEffect(() => {
    let cancelled = false;

    const loadCity = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .eq('slug', cityId)
          .maybeSingle();

        if (cancelled) return;

        if (error || !data) {
          setCity(null);
          setParcels([]);
          return;
        }

        setCity(data);

        // Parcelles réelles de la ville (lecture anonyme autorisée)
        if (data.name) {
          const { data: props, error: propsError } = await supabase
            .from('properties')
            .select('*')
            .ilike('city', `%${data.name}%`)
            .limit(6);

          if (!cancelled) {
            setParcels(!propsError && Array.isArray(props) ? props : []);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setCity(null);
          setParcels([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCity();
    return () => { cancelled = true; };
  }, [cityId]);

  const advantages = Array.isArray(city?.advantages) ? city.advantages : [];
  const availableZones = Array.isArray(city?.available_zones) ? city.available_zones : [];

  const nextParcel = () => {
    if (parcels.length === 0) return;
    setCurrentParcelIndex((prev) => (prev + 1) % parcels.length);
  };

  const prevParcel = () => {
    if (parcels.length === 0) return;
    setCurrentParcelIndex((prev) => (prev - 1 + parcels.length) % parcels.length);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: `/villes/${cityId}` } });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const { error } = await supabase
        .from('communal_requests')
        .insert({
          applicant_id: user.id,
          applicant_name: requestForm.fullName,
          commune: city?.name || cityId,
          zone: requestForm.preferredLocation || null,
          type: requestForm.purpose || null,
          surface: requestForm.landSize || null,
          status: 'pending'
        });

      if (error) throw error;

      setSubmitStatus({
        type: 'success',
        message: 'Votre demande a été soumise avec succès. La mairie vous contactera.'
      });
      setRequestForm({
        fullName: '',
        email: '',
        phone: '',
        preferredLocation: '',
        budgetRange: '',
        landSize: '',
        purpose: '',
        timeline: '',
        additionalInfo: ''
      });
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer."
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Chargement de la ville...</p>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <>
        <Helmet>
          <title>Ville introuvable | Teranga Foncier</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center space-y-4">
              <Landmark className="h-12 w-12 text-gray-400 mx-auto" />
              <h1 className="text-2xl font-bold">Ville introuvable</h1>
              <p className="text-gray-600">
                Cette ville n'est pas encore référencée sur Teranga Foncier.
              </p>
              <Button asChild className="w-full">
                <Link to="/villes-partenaires">
                  <MapPin className="h-4 w-4 mr-2" />
                  Voir les villes partenaires
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const hasMayorContact = city.mayor_name || city.mayor_phone || city.mayor_email;

  return (
    <>
      <Helmet>
        <title>{city.name} - Terrains Communaux | Teranga Foncier</title>
        <meta name="description" content={`Découvrez les opportunités foncières à ${city.name}. Soumettez votre demande de terrain communal et explorez les parcelles disponibles.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section Ville */}
        <section className="relative h-[400px] overflow-hidden">
          {city.hero_image_url ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${city.hero_image_url})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-gray-900" />
          )}
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {city.is_partner && (
                    <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                      <Landmark className="h-4 w-4 mr-2" />
                      Ville Partenaire
                    </Badge>
                  )}

                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    {city.name}
                  </h1>

                  <p className="text-xl text-gray-200 mb-6">
                    {city.region || 'Région non renseignée'}
                    {city.population ? ` • ${Number(city.population).toLocaleString()} habitants` : ''}
                  </p>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    {city.description || 'Description bientôt disponible.'}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-8">

              {/* Statistiques */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {city.population ? Number(city.population).toLocaleString() : '—'}
                      </div>
                      <div className="text-sm text-gray-600">Population</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {city.average_price_m2 ? `${Number(city.average_price_m2).toLocaleString()} F` : '—'}
                      </div>
                      <div className="text-sm text-gray-600">Prix moyen/m²</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {parcels.length > 0 ? parcels.length : '—'}
                      </div>
                      <div className="text-sm text-gray-600">Terrains en vente</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {availableZones.length > 0 ? availableZones.length : '—'}
                      </div>
                      <div className="text-sm text-gray-600">Zones disponibles</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Onglets */}
              <Tabs defaultValue="advantages" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="advantages">Avantages</TabsTrigger>
                  <TabsTrigger value="zones">Zones Disponibles</TabsTrigger>
                  <TabsTrigger value="parcels">Terrains Vendeurs</TabsTrigger>
                </TabsList>

                <TabsContent value="advantages" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pourquoi Investir à {city.name} ?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {advantages.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {advantages.map((advantage, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span>{typeof advantage === 'string' ? advantage : (advantage?.title || advantage?.label || '')}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Aucun avantage renseigné pour le moment.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="zones" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Zones d'Extension Urbaine</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {availableZones.length > 0 ? (
                        <div className="grid gap-4">
                          {availableZones.map((zone, index) => {
                            const zoneName = typeof zone === 'string' ? zone : (zone?.name || zone?.nom || '');
                            return (
                              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <span className="font-medium">{zoneName}</span>
                                  </div>
                                  <Button asChild variant="outline" size="sm">
                                    <Link to="/contact">Demander Info</Link>
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500">Aucune zone disponible renseignée pour le moment.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="parcels" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Terrains de nos Vendeurs</CardTitle>
                        {parcels.length > 1 && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={prevParcel}>
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={nextParcel}>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {parcels.length > 0 ? (
                        <div className="relative overflow-hidden">
                          <motion.div
                            className="flex"
                            animate={{ x: -currentParcelIndex * 100 + '%' }}
                            transition={{ duration: 0.5 }}
                          >
                            {parcels.map((parcel) => (
                              <div key={parcel.id} className="w-full flex-shrink-0">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="w-full h-48 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <Building className="h-12 w-12 text-gray-400" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold mb-2">{parcel.title || parcel.name || 'Terrain'}</h3>
                                    <p className="text-gray-600 mb-4">
                                      {parcel.location || parcel.commune || 'Localisation non renseignée'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <div>
                                        <div className="text-sm text-gray-500">Superficie</div>
                                        <div className="font-semibold">
                                          {parcel.surface ? `${Number(parcel.surface).toLocaleString()} m²` : '—'}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Prix</div>
                                        <div className="font-semibold text-primary">
                                          {parcel.price ? `${Number(parcel.price).toLocaleString()} F` : '—'}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {parcel.type && <Badge variant="outline">{parcel.type}</Badge>}
                                      {parcel.status && <Badge variant="outline">{parcel.status}</Badge>}
                                      {parcel.verification_status === 'verified' && (
                                        <Badge variant="outline">Vérifié</Badge>
                                      )}
                                    </div>

                                    <Button asChild className="w-full">
                                      <Link to={`/parcelles/${parcel.id}`}>
                                        Voir les Détails
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Aucun terrain en vente référencé dans cette ville pour le moment.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Formulaire de demande */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Demande de Terrain Communal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitRequest} className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Nom complet *</Label>
                      <Input
                        id="fullName"
                        value={requestForm.fullName}
                        onChange={(e) => setRequestForm({...requestForm, fullName: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={requestForm.email}
                          onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                          id="phone"
                          value={requestForm.phone}
                          onChange={(e) => setRequestForm({...requestForm, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="preferredLocation">Zone préférée</Label>
                      <Select
                        value={requestForm.preferredLocation}
                        onValueChange={(value) => setRequestForm({...requestForm, preferredLocation: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={availableZones.length > 0 ? 'Sélectionnez une zone' : 'Aucune zone renseignée'} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableZones.map((zone, index) => {
                            const zoneName = typeof zone === 'string' ? zone : (zone?.name || zone?.nom || '');
                            return zoneName ? (
                              <SelectItem key={index} value={zoneName}>{zoneName}</SelectItem>
                            ) : null;
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budgetRange">Budget (FCFA)</Label>
                        <Select
                          value={requestForm.budgetRange}
                          onValueChange={(value) => setRequestForm({...requestForm, budgetRange: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-20M">0 - 20M</SelectItem>
                            <SelectItem value="20M-50M">20M - 50M</SelectItem>
                            <SelectItem value="50M-100M">50M - 100M</SelectItem>
                            <SelectItem value="100M+">100M+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="landSize">Superficie souhaitée</Label>
                        <Select
                          value={requestForm.landSize}
                          onValueChange={(value) => setRequestForm({...requestForm, landSize: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Superficie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="200-400">200-400 m²</SelectItem>
                            <SelectItem value="400-600">400-600 m²</SelectItem>
                            <SelectItem value="600-1000">600-1000 m²</SelectItem>
                            <SelectItem value="1000+">1000+ m²</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="purpose">Objectif du projet</Label>
                      <Select
                        value={requestForm.purpose}
                        onValueChange={(value) => setRequestForm({...requestForm, purpose: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type de projet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residence">Résidence principale</SelectItem>
                          <SelectItem value="investment">Investissement locatif</SelectItem>
                          <SelectItem value="commercial">Projet commercial</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="additionalInfo">Informations complémentaires</Label>
                      <Textarea
                        id="additionalInfo"
                        value={requestForm.additionalInfo}
                        onChange={(e) => setRequestForm({...requestForm, additionalInfo: e.target.value})}
                        rows={3}
                        placeholder="Détails spécifiques, délais souhaités..."
                      />
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        {user
                          ? 'Votre demande sera transmise directement à la mairie.'
                          : 'Connectez-vous pour soumettre votre demande à la mairie.'}
                      </AlertDescription>
                    </Alert>

                    {submitStatus && (
                      <Alert variant={submitStatus.type === 'error' ? 'destructive' : 'default'}>
                        {submitStatus.type === 'success' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Info className="h-4 w-4" />
                        )}
                        <AlertDescription>{submitStatus.message}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {user ? 'Soumettre la Demande' : 'Se connecter pour soumettre'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Mairie */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Mairie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hasMayorContact ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{city.mayor_name || 'Non renseigné'}</span>
                      </div>
                      {city.mayor_phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a href={`tel:${city.mayor_phone}`} className="text-sm text-primary hover:underline">
                            {city.mayor_phone}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Non renseigné</span>
                        </div>
                      )}
                      {city.mayor_email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a href={`mailto:${city.mayor_email}`} className="text-sm text-primary hover:underline">
                            {city.mayor_email}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Non renseigné</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Coordonnées de la mairie non renseignées.</p>
                  )}
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to={`/parcelles?zone=${cityId}`}>
                      <Home className="h-4 w-4 mr-2" />
                      Voir tous les terrains
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/villes-partenaires">
                      <MapPin className="h-4 w-4 mr-2" />
                      Autres villes partenaires
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/contact">
                      <Phone className="h-4 w-4 mr-2" />
                      Nous contacter
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CityPage;
