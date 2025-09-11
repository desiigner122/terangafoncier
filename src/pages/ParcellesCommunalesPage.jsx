import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, FileText, Calendar, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ProfileLink from '@/components/common/ProfileLink';

const ParcellesCommunalesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedZone, setSelectedZone] = useState(null);

  // DonnÃ©es simulÃ©es des parcelles/zones communales
  const zonesCommunales = [
    {
      id: 1,
      name: "Zone RÃ©sidentielle Keur Massar",
      commune: "Keur Massar",
      communeId: "keur-massar-001",
      region: "Dakar",
      totalParcels: 150,
      availableParcels: 73,
      surface: "300-500mÂ²",
      feesRange: "450K - 750K FCFA (attribution) + viabilisation",
      description: "Zone rÃ©sidentielle moderne avec toutes les commoditÃ©s",
      amenities: ["Ã‰lectricitÃ©", "Eau courante", "Routes pavÃ©es", "Ã‰clairage public"],
      status: "active",
      deadline: "2025-12-31",
      image: "https://images.unsplash.com/photo-1517390344737-d75bc62ccd13?w=400&h=300&fit=crop",
      requirements: ["Revenus stables", "PremiÃ¨re acquisition", "RÃ©sidence principale"]
    },
    {
      id: 2,
      name: "Lotissement Social Rufisque",
      commune: "Rufisque",
      communeId: "rufisque-001",
      region: "Dakar",
      totalParcels: 200,
      availableParcels: 156,
      surface: "250-400mÂ²",
      feesRange: "375K - 600K FCFA (attribution) + viabilisation",
      description: "Programme de logement social pour familles modestes",
      amenities: ["Eau", "Ã‰lectricitÃ© prÃ©parÃ©e", "Transport public"],
      status: "active",
      deadline: "2025-10-15",
      image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&h=300&fit=crop",
      requirements: ["Revenus < 200,000 FCFA/mois", "Famille avec enfants", "PremiÃ¨re acquisition"]
    },
    {
      id: 3,
      name: "Zone Industrielle Diamniadio",
      commune: "Diamniadio",
      communeId: "diamniadio-001",
      region: "Dakar",
      totalParcels: 50,
      availableParcels: 23,
      surface: "1000-5000mÂ²",
      priceRange: "20-80 millions FCFA",
      description: "Zone dÃ©diÃ©e aux activitÃ©s industrielles et commerciales",
      amenities: ["Ã‰lectricitÃ© industrielle", "Fibre optique", "Route nationale"],
      status: "coming_soon",
      deadline: "2025-11-30",
      image: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400&h=300&fit=crop",
      requirements: ["Entreprise constituÃ©e", "Plan d'affaires", "Emplois crÃ©Ã©s"]
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'coming_soon': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Demandes ouvertes';
      case 'coming_soon': return 'BientÃ´t disponible';
      case 'closed': return 'Demandes fermÃ©es';
      default: return status;
    }
  };

  const DemandeModal = ({ zone }) => {
    const [formData, setFormData] = useState({
      fullName: '',
      phone: '',
      email: '',
      familySize: '',
      income: '',
      motivation: '',
      documents: []
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Logique de soumission de demande
      console.log('Demande soumise:', { zone: zone.id, ...formData });
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Faire une demande
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Demande d'attribution - {zone.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nom complet *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">TÃ©lÃ©phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="familySize">Taille de la famille</Label>
              <Select value={formData.familySize} onValueChange={(value) => setFormData({...formData, familySize: value})}>
                <SelectTrigger>
                  <SelectValue YOUR_API_KEY="SÃ©lectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">1-2 personnes</SelectItem>
                  <SelectItem value="3-5">3-5 personnes</SelectItem>
                  <SelectItem value="6+">6+ personnes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="income">Revenus mensuels (FCFA)</Label>
              <Select value={formData.income} onValueChange={(value) => setFormData({...formData, income: value})}>
                <SelectTrigger>
                  <SelectValue YOUR_API_KEY="SÃ©lectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100000">0 - 100,000 FCFA</SelectItem>
                  <SelectItem value="100000-200000">100,000 - 200,000 FCFA</SelectItem>
                  <SelectItem value="200000-500000">200,000 - 500,000 FCFA</SelectItem>
                  <SelectItem value="500000+">500,000+ FCFA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="motivation">Motivation de la demande *</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                YOUR_API_KEY="Expliquez pourquoi vous souhaitez acquÃ©rir cette parcelle..."
                required
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Documents requis:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>â€¢ Carte d'identitÃ© nationale</li>
                <li>â€¢ Certificat de revenus</li>
                <li>â€¢ Attestation de rÃ©sidence</li>
                <li>â€¢ Certificat de situation matrimoniale</li>
              </ul>
            </div>
            
            <Button type="submit" className="w-full">
              Soumettre la demande
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const ZoneCard = ({ zone }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden border-2 hover:border-blue-500 transition-all duration-300">
        <div className="relative">
          <img 
            src={zone.image} 
            alt={zone.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className={`${getStatusColor(zone.status)} text-white`}>
              {getStatusLabel(zone.status)}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className="bg-blue-500 text-white">
              <Building2 className="w-3 h-3 mr-1" />
              Communal
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
            {zone.name}
          </CardTitle>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <ProfileLink 
              type="municipality" 
              id={zone.communeId} 
              className="text-blue-600 hover:text-blue-800 hover:underline"
              external={true}
            >
              {zone.commune}
            </ProfileLink>
            , {zone.region}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-700 text-sm">
            {zone.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Parcelles totales:</p>
              <p className="text-blue-600 font-bold">{zone.totalParcels}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Disponibles:</p>
              <p className="text-green-600 font-bold">{zone.availableParcels}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Surface:</p>
              <p className="text-gray-900">{zone.surface}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Frais d'attribution:</p>
              <p className="text-gray-900">{zone.feesRange}</p>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">CommoditÃ©s:</p>
            <div className="flex flex-wrap gap-1">
              {zone.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">CritÃ¨res requis:</p>
            <div className="space-y-1">
              {zone.requirements.map((req, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  {req}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              Jusqu'au {new Date(zone.deadline).toLocaleDateString('fr-FR')}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate(`/zone-communale/${zone.id}`)}
            >
              Voir dÃ©tails
            </Button>
            {zone.status === 'active' && (
              <div className="flex-1">
                <DemandeModal zone={zone} />
              </div>
            )}
            {zone.status === 'coming_soon' && (
              <Button variant="outline" className="flex-1" disabled>
                <Clock className="w-4 h-4 mr-2" />
                BientÃ´t
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Parcelles Communales
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Parcelles publiques disponibles sur demande d'attribution
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Building2 className="w-4 h-4 mr-2" />
                Logement social
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                <FileText className="w-4 h-4 mr-2" />
                Demande d'attribution
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Programme public
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-8 bg-yellow-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4 p-4 bg-yellow-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-2">Information importante</h3>
              <p className="text-yellow-700 text-sm">
                Les parcelles communales sont attribuÃ©es selon des critÃ¨res sociaux spÃ©cifiques. 
                Les demandes sont Ã©tudiÃ©es par les autoritÃ©s locales et l'attribution se fait sur 
                la base du mÃ©rite et des besoins familiaux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                YOUR_API_KEY="Rechercher par commune, rÃ©gion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue YOUR_API_KEY="RÃ©gion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les rÃ©gions</SelectItem>
                  <SelectItem value="dakar">Dakar</SelectItem>
                  <SelectItem value="thies">ThiÃ¨s</SelectItem>
                  <SelectItem value="saint-louis">Saint-Louis</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue YOUR_API_KEY="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Demandes ouvertes</SelectItem>
                  <SelectItem value="coming_soon">BientÃ´t disponible</SelectItem>
                  <SelectItem value="closed">Demandes fermÃ©es</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {zonesCommunales.length} zones disponibles
            </h2>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {zonesCommunales.map((zone) => (
              <ZoneCard key={zone.id} zone={zone} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Processus de demande d'attribution
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Choisir une zone",
                description: "SÃ©lectionnez la zone qui correspond Ã  vos besoins",
                icon: MapPin
              },
              {
                step: 2,
                title: "Soumettre la demande",
                description: "Remplissez le formulaire avec vos informations",
                icon: FileText
              },
              {
                step: 3,
                title: "Ã‰tude du dossier",
                description: "La mairie Ã©tudie votre demande selon les critÃ¨res",
                icon: Clock
              },
              {
                step: 4,
                title: "Attribution",
                description: "Vous recevez la notification de dÃ©cision",
                icon: CheckCircle
              }
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.step * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  Ã‰tape {item.step}: {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ParcellesCommunalesPage;
