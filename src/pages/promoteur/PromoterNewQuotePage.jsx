import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  Plus, 
  Calendar,
  MapPin,
  DollarSign,
  User,
  Phone,
  Mail,
  Eye,
  Edit,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Helmet } from 'react-helmet-async';

const PromoterNewQuotePage = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    projectTitle: '',
    projectType: '',
    location: '',
    budget: '',
    timeline: '',
    description: '',
    services: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectTypes = [
    'Villa individuelle',
    'Immeuble résidentiel',
    'Complexe commercial',
    'Projet mixte',
    'Rénovation',
    'Extension'
  ];

  const availableServices = [
    { id: 'architecture', name: 'Conception architecturale', price: 5000000 },
    { id: 'construction', name: 'Construction clé en main', price: 25000000 },
    { id: 'genie-civil', name: 'Gros œuvre', price: 15000000 },
    { id: 'finitions', name: 'Finitions haut standing', price: 8000000 },
    { id: 'piscine', name: 'Piscine', price: 6000000 },
    { id: 'jardinage', name: 'Aménagement paysager', price: 3000000 },
    { id: 'suivi', name: 'Suivi de chantier', price: 2000000 },
    { id: 'demarches', name: 'Démarches administratives', price: 1500000 }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const calculateTotal = () => {
    return formData.services.reduce((total, serviceId) => {
      const service = availableServices.find(s => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation de soumission
    setTimeout(() => {
      setIsSubmitting(false);
      window.safeGlobalToast('Devis envoyé avec succès !', 'success');
      // Redirection ou reset du formulaire
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Nouveau Devis - Dashboard Promoteur | Teranga Foncier</title>
        <meta name="description" content="Créez et envoyez un devis personnalisé pour vos services de construction." />
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouveau Devis</h1>
            <p className="text-gray-600">Créez un devis personnalisé pour votre client</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Nom complet *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="Ex: Aminata Diallo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="Ex: aminata@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="clientPhone">Téléphone *</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  placeholder="Ex: +221 77 123 45 67"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Détails du projet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Détails du Projet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectTitle">Titre du projet *</Label>
                <Input
                  id="projectTitle"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                  placeholder="Ex: Villa moderne 4 chambres avec piscine"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectType">Type de projet *</Label>
                  <Select onValueChange={(value) => handleInputChange('projectType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Localisation *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ex: Almadies, Dakar"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget indicatif</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="Ex: 80-120M FCFA"
                  />
                </div>
                <div>
                  <Label htmlFor="timeline">Délai souhaité</Label>
                  <Input
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    placeholder="Ex: 12 mois"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez les spécificités du projet, les exigences particulières, etc."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Services proposés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Services Proposés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableServices.map((service) => (
                  <div
                    key={service.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.services.includes(service.id)
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="mr-3"
                      />
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <span className="text-emerald-600 font-semibold">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                ))}
              </div>

              {formData.services.length > 0 && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total estimé:</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-700 mt-2">
                    Prix indicatif - Devis final après étude détaillée
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              asChild
            >
              <Link to="/dashboard">Annuler</Link>
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={isSubmitting || !formData.clientName || !formData.clientEmail || !formData.projectTitle}
            >
              {isSubmitting ? (
                'Envoi en cours...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le Devis
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PromoterNewQuotePage;
