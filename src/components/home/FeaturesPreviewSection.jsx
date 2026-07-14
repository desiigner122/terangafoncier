import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Hammer, Eye, Camera, Blocks, Brain, Shield, Users, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const FeaturesPreviewSection = () => {
  const [projectsPreview, setProjectsPreview] = useState([]);
  const [requestsPreview, setRequestsPreview] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [platformStats, setPlatformStats] = useState({ nftCount: null, smartContractCount: null });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, name, price, location, city, status, nft_token_id, property_photos(url, is_primary)')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setProjectsPreview(data || []);
      } catch (error) {
        console.error('Erreur chargement projets:', error);
        setProjectsPreview([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    const loadRequests = async () => {
      try {
        setLoadingRequests(true);
        const { data, error } = await supabase
          .from('construction_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setRequestsPreview(data || []);
      } catch (error) {
        console.error('Erreur chargement demandes de construction:', error);
        setRequestsPreview([]);
      } finally {
        setLoadingRequests(false);
      }
    };

    const loadPlatformStats = async () => {
      try {
        const [nftRes, contractsRes] = await Promise.all([
          supabase.from('properties').select('id', { count: 'exact', head: true }).not('nft_token_id', 'is', null),
          supabase.from('properties').select('id', { count: 'exact', head: true }).not('smart_contract_address', 'is', null)
        ]);
        setPlatformStats({
          nftCount: nftRes.count || 0,
          smartContractCount: contractsRes.count || 0
        });
      } catch (error) {
        console.error('Erreur chargement statistiques plateforme:', error);
      }
    };

    loadProjects();
    loadRequests();
    loadPlatformStats();
  }, []);

  const platformFeatures = [
    {
      icon: Blocks,
      title: "NFT Propriétés",
      description: "Chaque bien tokenisé sur blockchain Ethereum",
      stats: platformStats.nftCount === null ? '…' : `${platformStats.nftCount} NFT créés`,
      color: "from-blue-500 to-purple-500",
      href: "/nft-properties"
    },
    {
      icon: Brain,
      title: "IA de Surveillance",
      description: "Suivi construction par satellite et IA",
      // NOTE: aucune table ne mesure une "précision IA" - laissé tel quel (voir rapport)
      stats: "Analyse continue",
      color: "from-emerald-500 to-teal-500",
      href: "/guide-projets"
    },
    {
      icon: Shield,
      title: "Smart Contracts",
      description: "Paiements automatisés et sécurisés",
      stats: platformStats.smartContractCount === null ? '…' : `${platformStats.smartContractCount} contrats actifs`,
      color: "from-purple-500 to-pink-500",
      href: "/smart-contracts"
    },
    {
      icon: Users,
      title: "Matching IA",
      description: "Connexion intelligente clients-promoteurs",
      // NOTE: aucune table ne mesure une "satisfaction" - laissé tel quel (voir rapport)
      stats: "Mise en relation intelligente",
      color: "from-orange-500 to-red-500",
      href: "/guide-demandes"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Projets Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Projets Construction <span className="text-blue-600">Blockchain</span>
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez les projets immobiliers avec suivi IA et NFT
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/promoters-projects">
                Voir tous les projets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : projectsPreview.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Aucun projet disponible pour le moment
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projectsPreview.map((project, index) => {
                const primaryPhoto = project.property_photos?.find(p => p.is_primary) || project.property_photos?.[0];
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative">
                        {primaryPhoto?.url ? (
                          <img
                            src={primaryPhoto.url}
                            alt={project.title || project.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200" />
                        )}
                        <div className="absolute top-3 left-3">
                          {project.nft_token_id && (
                            <Badge className="bg-purple-600 text-white">
                              <Blocks className="w-3 h-3 mr-1" />
                              NFT
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-black/50 text-white">
                            <Camera className="w-3 h-3 mr-1" />
                            IA
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2">{project.title || project.name}</h3>

                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          {project.location || project.city || '—'}
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <span className="text-2xl font-bold text-blue-600">
                            {project.price ? `${project.price} FCFA` : '—'}
                          </span>
                          {project.status && (
                            <Badge variant="secondary">
                              {project.status}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Demandes Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Demandes de <span className="text-emerald-600">Construction</span>
              </h2>
              <p className="text-xl text-gray-600">
                Trouvez le promoteur idéal avec notre IA de matching
              </p>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/promoter-requests">
                Faire une demande
                <Hammer className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {loadingRequests ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : requestsPreview.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Aucune demande de construction pour le moment
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {requestsPreview.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Building2 className="w-8 h-8 text-emerald-600" />
                      </div>
                      <CardTitle className="text-lg">{request.type || request.title || 'Demande de construction'}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {request.budget && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Budget:</span>
                            <span className="font-semibold">{request.budget}</span>
                          </div>
                        )}
                        {(request.location || request.city) && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Localisation:</span>
                            <span className="font-semibold">{request.location || request.city}</span>
                          </div>
                        )}
                        {request.deadline && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Délai:</span>
                            <span className="font-semibold">{request.deadline}</span>
                          </div>
                        )}
                        {request.status && (
                          <div className="pt-2">
                            <Badge className="w-full justify-center bg-emerald-100 text-emerald-800">
                              {request.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Platform Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités <span className="text-purple-600">Innovantes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme révolutionnaire qui combine blockchain, IA et immobilier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={feature.href}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.color} mb-4`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-3">{feature.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {feature.stats}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesPreviewSection;
