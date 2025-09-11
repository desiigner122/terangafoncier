import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, 
  Building2, 
  Users, 
  Shield, 
  FileCheck, 
  Clock, 
  Filter,
  Grid,
  List,
  ArrowRight,
  Info,
  Calculator,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const CommunalLandsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');

  // DonnÃ©es d'exemple des terrains communaux
  const communalLands = [
    {
      id: 1,
      title: "Parcelle Communale GuÃ©diawaye",
      zone: "GuÃ©diawaye",
      area: "300mÂ²",
      status: "Disponible",
      price: "Attribution selon revenus",
      requirements: ["RÃ©sidence au SÃ©nÃ©gal", "Revenus < 500K FCFA/mois", "Premier logement"],
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop",
      description: "Terrain communal destinÃ© Ã  l'habitat social avec toutes les commoditÃ©s."
    },
    {
      id: 2,
      title: "Lotissement Communal Pikine",
      zone: "Pikine",
      area: "250mÂ²",
      status: "En cours",
      price: "Attribution selon critÃ¨res",
      requirements: ["Domiciliation Pikine", "Famille nombreuse", "Projet dÃ©fini"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      description: "Nouveau lotissement communal avec infrastructure moderne."
    },
    {
      id: 3,
      title: "Zone Communale Rufisque",
      zone: "Rufisque",
      area: "400mÂ²",
      status: "BientÃ´t disponible",
      price: "Programme d'attribution 2025",
      requirements: ["RÃ©sidence Rufisque 2+ ans", "ActivitÃ© Ã©conomique", "Dossier complet"],
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
      description: "Grande parcelle communale avec accÃ¨s facilitÃ©s."
    }
  ];

  const zones = ['all', 'GuÃ©diawaye', 'Pikine', 'Rufisque', 'Dakar', 'Thiaroye'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible': return 'bg-green-500';
      case 'En cours': return 'bg-yellow-500';
      case 'BientÃ´t disponible': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredLands = communalLands.filter(land => {
    const matchesSearch = land.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'all' || land.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  return (
    <>
      <Helmet>
        <title>Terrains Communaux - Attribution et Lotissements | Teranga Foncier</title>
        <meta name="description" content="DÃ©couvrez les terrains communaux disponibles pour attribution. Processus transparent, critÃ¨res d'Ã©ligibilitÃ© et lotissements sociaux au SÃ©nÃ©gal." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20">
        
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Terrains Communaux
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Attribution transparente de terrains communaux pour l'habitat social
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Building2 className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">150+ Parcelles</div>
                  <div className="text-sm opacity-80">Disponibles Ã  l'attribution</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Shield className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Processus Transparent</div>
                  <div className="text-sm opacity-80">CritÃ¨res d'attribution clairs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">500+ Familles</div>
                  <div className="text-sm opacity-80">DÃ©jÃ  bÃ©nÃ©ficiaires</div>
                </div>
              </div>

              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold" asChild>
                <Link to="#terrains-disponibles">
                  Voir les terrains disponibles
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Information Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Comment fonctionne l'attribution ?
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">VÃ©rification d'Ã©ligibilitÃ©</h3>
                      <p className="text-gray-600">VÃ©rifiez si vous rÃ©pondez aux critÃ¨res selon votre zone de rÃ©sidence et vos revenus.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Constitution du dossier</h3>
                      <p className="text-gray-600">Rassemblez les documents requis : justificatifs de revenus, de rÃ©sidence, projet de construction.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">DÃ©pÃ´t et Ã©valuation</h3>
                      <p className="text-gray-600">DÃ©posez votre dossier qui sera Ã©valuÃ© selon les critÃ¨res d'attribution transparents.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Attribution et formalitÃ©s</h3>
                      <p className="text-gray-600">En cas d'acceptation, finalisation des dÃ©marches administratives et remise du titre.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                    <Link to="/guide-attribution-communale">
                      <Info className="h-4 w-4 mr-2" />
                      Guide complet d'attribution
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
                  alt="Terrain communal"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Calculateur d'Ã©ligibilitÃ©</div>
                      <div className="text-sm text-gray-600">Gratuit et instantanÃ©</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Terrains disponibles */}
        <section id="terrains-disponibles" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Terrains Communaux Disponibles
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                DÃ©couvrez les derniÃ¨res opportunitÃ©s d'attribution dans votre rÃ©gion
              </p>
            </motion.div>

            {/* Filtres et recherche */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    YOUR_API_KEY="Rechercher par zone ou titre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {zones.map(zone => (
                    <option key={zone} value={zone}>
                      {zone === 'all' ? 'Toutes les zones' : zone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Liste des terrains */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredLands.map((land, index) => (
                <motion.div
                  key={land.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <div className="relative">
                      <img 
                        src={land.image}
                        alt={land.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge className={`absolute top-3 right-3 ${getStatusColor(land.status)} text-white text-xs`}>
                        {land.status}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition-colors">
                          {land.title}
                        </h3>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{land.zone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm">{land.area}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{land.description}</p>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">CritÃ¨res d'Ã©ligibilitÃ© :</h4>
                        <ul className="space-y-1">
                          {land.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <Shield className="h-3 w-3 text-green-500" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-green-600 font-semibold">{land.price}</div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                          <Link to={`/zone-communale/${land.id}`}>
                            Voir dÃ©tails
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredLands.length === 0 && (
              <div className="text-center py-12">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun terrain trouvÃ©</h3>
                <p className="text-gray-600">Essayez de modifier vos critÃ¨res de recherche.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                PrÃªt Ã  faire votre demande ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Notre Ã©quipe vous accompagne dans toutes les dÃ©marches
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold" asChild>
                  <Link to="/demande-terrain-communal">
                    <FileCheck className="h-5 w-5 mr-2" />
                    Faire une demande
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 font-semibold" asChild>
                  <Link to="/contact">
                    <Users className="h-5 w-5 mr-2" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CommunalLandsPage;
