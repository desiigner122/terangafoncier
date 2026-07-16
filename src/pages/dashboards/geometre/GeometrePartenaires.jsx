import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Phone,
  Mail,
  Plus,
  Eye,
  MessageSquare,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Annuaire professionnel INDICATIF (contenu statique).
// Il n'existe pas de table de partenaires géomètre dans le schéma (banking_partners
// concerne les banques et est vide). On présente donc un annuaire de contacts
// professionnels sans métriques chiffrées prétendues réelles (collaborations,
// notes, statistiques). Le suivi réel des collaborations sera branché plus tard.
const GeometrePartenaires = () => {
  const partenaires = {
    notaires: [
      {
        id: 1,
        name: 'Me Fatou Sow Sarr',
        office: 'Étude Notariale Centrale',
        location: 'Plateau, Dakar',
        email: 'contact@etude-centrale.sn',
        phone: '+221 33 821 45 67',
        specialities: ['Foncier', 'Immobilier', 'Succession']
      },
      {
        id: 2,
        name: 'Me Abdou Karim Diop',
        office: 'SCP Diop & Associés',
        location: 'Almadies, Dakar',
        email: 'diop.associes@notaire.sn',
        phone: '+221 33 864 32 10',
        specialities: ['Urbanisme', 'Cadastre']
      }
    ],
    bureaux: [
      {
        id: 3,
        name: 'Bureau d\'Études TEKNIKA',
        type: 'Ingénierie & VRD',
        location: 'Sacré-Cœur, Dakar',
        email: 'contact@teknika.sn',
        phone: '+221 77 654 32 18',
        specialities: ['VRD', 'Assainissement', 'Routes']
      },
      {
        id: 4,
        name: 'CONSULTING PLUS',
        type: 'Études Techniques',
        location: 'Mermoz, Dakar',
        email: 'info@consultingplus.sn',
        phone: '+221 78 432 65 91',
        specialities: ['Géotechnique', 'Environnement']
      }
    ],
    entreprises: [
      {
        id: 5,
        name: 'EIFFAGE Sénégal',
        type: 'BTP & Construction',
        location: 'Zone Industrielle, Dakar',
        email: 'senegal@eiffage.com',
        phone: '+221 33 832 45 67',
        specialities: ['Gros œuvre', 'Infrastructure']
      },
      {
        id: 6,
        name: 'Groupe CCBM',
        type: 'Matériaux & Construction',
        location: 'Rufisque',
        email: 'contact@ccbm.sn',
        phone: '+221 33 954 78 32',
        specialities: ['Béton', 'Préfabriqué']
      }
    ]
  };

  const renderPartenaireCard = (partenaire) => (
    <Card key={partenaire.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{partenaire.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {partenaire.office || partenaire.type} • {partenaire.location}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {partenaire.specialities.map((spec, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {partenaire.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {partenaire.phone}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Collaborer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            Réseau Partenaires Professionnels
          </h1>
          <p className="text-gray-600 mt-2">
            Collaboration avec Notaires, Bureaux d'études et Entreprises BTP
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Partenaire
        </Button>
      </motion.div>

      {/* Note honnête : annuaire indicatif, pas de suivi chiffré réel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-blue-50/80 backdrop-blur-sm border border-blue-100 shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Annuaire indicatif</p>
              <p className="text-sm text-gray-600">
                Ce répertoire présente des contacts professionnels de référence.
                Le suivi des collaborations et les statistiques de partenariat seront bientôt disponibles.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets Partenaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="notaires" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="notaires" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Notaires ({partenaires.notaires.length})
            </TabsTrigger>
            <TabsTrigger value="bureaux" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Bureaux d'Études ({partenaires.bureaux.length})
            </TabsTrigger>
            <TabsTrigger value="entreprises" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Entreprises BTP ({partenaires.entreprises.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notaires" className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Études Notariales Partenaires</h3>
              <p className="text-sm text-gray-600">Collaboration pour les actes authentiques et certifications foncières</p>
            </div>
            <div className="grid gap-6">
              {partenaires.notaires.map(renderPartenaireCard)}
            </div>
          </TabsContent>

          <TabsContent value="bureaux" className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bureaux d'Études Techniques</h3>
              <p className="text-sm text-gray-600">Partenariat pour les études d'ingénierie et projets techniques</p>
            </div>
            <div className="grid gap-6">
              {partenaires.bureaux.map(renderPartenaireCard)}
            </div>
          </TabsContent>

          <TabsContent value="entreprises" className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Entreprises BTP & Construction</h3>
              <p className="text-sm text-gray-600">Collaboration pour la réalisation des projets d'aménagement</p>
            </div>
            <div className="grid gap-6">
              {partenaires.entreprises.map(renderPartenaireCard)}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default GeometrePartenaires;
