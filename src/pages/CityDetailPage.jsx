import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  MapPin,
  Users,
  Building,
  Landmark,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Calendar,
  FileText,
  Award,
  TrendingUp,
  Home,
  Car,
  Wifi,
  Zap,
  Droplets,
  TreePine,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const CityDetailPage = () => {
  const { cityId } = useParams();
  const { user, profile } = useAuth();
  const [city, setCity] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    parcelInterest: ''
  });

  useEffect(() => {
    let cancelled = false;

    const loadCity = async () => {
      setLoading(true);
      try {
        const { data: cityRow, error } = await supabase
          .from('cities')
          .select('*')
          .eq('slug', cityId)
          .maybeSingle();

        if (error) throw error;
        if (cancelled) return;

        setCity(cityRow || null);

        if (cityRow?.name) {
          const { data: props, error: propsError } = await supabase
            .from('properties')
            .select('id, title, name, surface, price, status, type, location')
            .ilike('city', cityRow.name)
            .limit(12);

          if (!propsError && !cancelled) {
            setParcels(props || []);
          }
        }
      } catch (err) {
        console.error('Erreur chargement ville:', err);
        if (!cancelled) setCity(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCity();
    return () => { cancelled = true; };
  }, [cityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setSubmitStatus({ type: 'error', message: 'Veuillez vous connecter pour envoyer une demande.' });
      return;
    }
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const { error } = await supabase.from('communal_requests').insert({
        applicant_id: user.id,
        applicant_name: formData.name || profile?.full_name || null,
        commune: city?.name || null,
        type: formData.parcelInterest || null,
        status: 'pending'
      });
      if (error) throw error;
      setSubmitStatus({ type: 'success', message: 'Votre demande a bien été envoyée à la mairie.' });
      setFormData({ name: '', email: '', phone: '', message: '', parcelInterest: '' });
    } catch (err) {
      console.error('Erreur soumission demande:', err);
      setSubmitStatus({ type: 'error', message: "Une erreur est survenue lors de l'envoi de la demande." });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === '' || isNaN(Number(price))) return '—';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const parcelStatusLabel = (status) => {
    if (!status) return 'Non renseigné';
    const map = {
      available: 'Disponible',
      disponible: 'Disponible',
      reserved: 'Réservé',
      reserve: 'Réservé',
      sold: 'Vendu',
      vendu: 'Vendu'
    };
    return map[String(status).toLowerCase()] || status;
  };

  const advantages = Array.isArray(city?.advantages) ? city.advantages : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement de la ville...</span>
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
          <div className="text-center max-w-md mx-auto px-4">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Ville introuvable</h1>
            <p className="text-gray-600 mb-6">
              Aucune ville ne correspond à « {cityId} ».
            </p>
            <Button asChild>
              <Link to="/villes-partenaires">
                Voir les villes partenaires <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{city.name} - Terrains et Investissements | Teranga Foncier</title>
        <meta name="description" content={`Découvrez les opportunités d'investissement immobilier à ${city.name}. ${city.description || ''}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <section className="relative h-96 overflow-hidden">
          {city.hero_image_url ? (
            <img
              src={city.hero_image_url}
              alt={city.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-600" />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white max-w-3xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-6 w-6" />
                  <span className="text-lg">{city.region || 'Région non renseignée'}</span>
                </div>
                <h1 className="text-5xl font-bold mb-4">{city.name}</h1>
                <p className="text-xl text-gray-200 mb-6">{city.description || ''}</p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 text-white">
                    <Building className="mr-2 h-5 w-5" />
                    Voir les Terrains
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                    <FileText className="mr-2 h-5 w-5" />
                    Faire une Demande
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{parcels.length}</div>
                <div className="text-sm text-gray-600">Terrains disponibles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{formatPrice(city.average_price_m2)}</div>
                <div className="text-sm text-gray-600">Prix moyen / m²</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {city.population ? Number(city.population).toLocaleString('fr-FR') : '—'}
                </div>
                <div className="text-sm text-gray-600">Habitants</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Array.isArray(city.available_zones) && city.available_zones.length > 0
                    ? city.available_zones.length
                    : '—'}
                </div>
                <div className="text-sm text-gray-600">Zones disponibles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">—</div>
                <div className="text-sm text-gray-600">Niveau de demande</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">—</div>
                <div className="text-sm text-gray-600">Croissance annuelle</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="parcels" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="parcels">Terrains Disponibles</TabsTrigger>
              <TabsTrigger value="info">Informations Ville</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructures</TabsTrigger>
              <TabsTrigger value="contact">Contact Mairie</TabsTrigger>
            </TabsList>

            <TabsContent value="parcels" className="space-y-6">
              {parcels.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-600">
                    Aucun terrain disponible pour le moment à {city.name}.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {parcels.map((parcel) => (
                    <Card key={parcel.id} className="overflow-hidden">
                      <div className="aspect-video relative bg-gray-200 flex items-center justify-center">
                        <Home className="h-10 w-10 text-gray-400" />
                        <Badge
                          className={`absolute top-3 right-3 ${
                            parcelStatusLabel(parcel.status) === 'Disponible'
                              ? 'bg-green-500'
                              : parcelStatusLabel(parcel.status) === 'Réservé'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {parcelStatusLabel(parcel.status)}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{parcel.title || parcel.name || 'Terrain'}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-600">{parcel.surface ? `${parcel.surface} m²` : '—'}</span>
                          <Badge variant="outline">{parcel.type || 'Non renseigné'}</Badge>
                        </div>
                        <div className="text-xl font-bold text-primary mb-3">
                          {formatPrice(parcel.price)}
                        </div>
                        <Button className="w-full" asChild>
                          <Link to={`/parcelles/${parcel.id}`}>
                            Voir Détails <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="info" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Avantages de {city.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {advantages.length === 0 ? (
                      <p className="text-gray-600">Aucun avantage renseigné pour le moment.</p>
                    ) : (
                      <div className="space-y-3">
                        {advantages.map((advantage, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span>{typeof advantage === 'string' ? advantage : advantage?.label || advantage?.name || ''}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informations Générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population:</span>
                      <span className="font-semibold">
                        {city.population ? `${Number(city.population).toLocaleString('fr-FR')} habitants` : 'Non renseigné'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Région:</span>
                      <span className="font-semibold">{city.region || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ville partenaire:</span>
                      <Badge className={city.is_partner ? 'bg-primary' : 'bg-gray-400'}>
                        {city.is_partner ? 'Oui' : 'Non'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix moyen / m²:</span>
                      <span className="font-semibold text-green-600">{formatPrice(city.average_price_m2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="infrastructure" className="space-y-6">
              {Array.isArray(city.available_zones) && city.available_zones.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {city.available_zones.map((zone, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {typeof zone === 'string' ? zone : zone?.name || zone?.label || 'Zone'}
                          </div>
                          <Badge variant="outline" className="border-blue-500 text-blue-700">
                            Zone disponible
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-600">
                    Informations sur les infrastructures et zones bientôt disponibles.
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Mairie</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Maire</div>
                        <div className="text-gray-600">{city.mayor_name || 'Non renseigné'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Téléphone</div>
                        {city.mayor_phone ? (
                          <a href={`tel:${city.mayor_phone}`} className="text-primary hover:underline">
                            {city.mayor_phone}
                          </a>
                        ) : (
                          <span className="text-gray-600">Non renseigné</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Email</div>
                        {city.mayor_email ? (
                          <a href={`mailto:${city.mayor_email}`} className="text-primary hover:underline">
                            {city.mayor_email}
                          </a>
                        ) : (
                          <span className="text-gray-600">Non renseigné</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Site Web</div>
                        <span className="text-gray-600">Non renseigné</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Faire une Demande Municipale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!user ? (
                      <div className="text-center py-6">
                        <p className="text-gray-600 mb-4">
                          Connectez-vous pour soumettre une demande municipale à {city.name}.
                        </p>
                        <Button asChild>
                          <Link to="/login">Se connecter</Link>
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Nom complet</label>
                          <input
                            type="text"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <input
                            type="email"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Téléphone</label>
                          <input
                            type="tel"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Type de terrain souhaité</label>
                          <select
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={formData.parcelInterest}
                            onChange={(e) => setFormData({...formData, parcelInterest: e.target.value})}
                          >
                            <option value="">Sélectionner</option>
                            <option value="residential">Résidentiel</option>
                            <option value="commercial">Commercial</option>
                            <option value="industrial">Industriel</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Message</label>
                          <textarea
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                          />
                        </div>
                        {submitStatus && (
                          <p className={`text-sm ${submitStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {submitStatus.message}
                          </p>
                        )}
                        <Button type="submit" className="w-full" disabled={submitting}>
                          {submitting ? 'Envoi en cours...' : 'Envoyer la Demande'}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CityDetailPage;
