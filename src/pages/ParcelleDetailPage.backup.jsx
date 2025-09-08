import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  MapPin, Euro, CreditCard, Building2, Zap, Star, Heart, Eye, 
  Shield, Calendar, FileText, Calculator, Phone, Mail, Share2,
  CheckCircle, Camera, Map, TrendingUp, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ParcelleDetailPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [calculatedPayment, setCalculatedPayment] = useState(null);

  // Données simulées de la parcelle
  const parcelle = {
    id: id,
    title: "Parcelle Résidentielle Premium - Almadies",
    surface: "500m²",
    price: 75000000,
    location: "Almadies, Dakar",
    seller: {
      name: "SARL Immobilier Plus",
      type: "Professionnel",
      rating: 4.8,
      phone: "+221 77 123 45 67",
      email: "contact@immobilierplus.sn",
      verified: true
    },
    type: "Résidentiel",
    paymentOptions: ["direct", "installments", "bank_financing"],
    features: ["Viabilisé", "Titre foncier", "Vue mer", "Sécurisé"],
    rating: 4.8,
    views: 234,
    images: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ],
    verified: true,
    blockchain: {
      verified: true,
      transactionHash: "0x1234567890abcdef...",
      smartContract: "0xabcdef1234567890...",
      lastVerification: "2025-01-15T10:30:00Z"
    },
    description: `
      Magnifique parcelle située dans le quartier résidentiel des Almadies, 
      offrant une vue imprenable sur l'océan Atlantique. Entièrement viabilisée 
      avec accès à tous les services urbains. Idéale pour construction d'une 
      villa familiale ou investissement locatif.
    `,
    specifications: {
      orientation: "Sud-Est",
      zonage: "Résidentiel R1",
      cos: "0.6",
      hauteurMax: "R+2",
      servitudes: "Aucune"
    },
    nearbyAmenities: [
      { name: "École Internationale", distance: "500m" },
      { name: "Hôpital Principal", distance: "1.2km" },
      { name: "Centre Commercial", distance: "800m" },
      { name: "Plage", distance: "200m" }
    ],
    documents: [
      "Titre foncier",
      "Certificat de viabilisation",
      "Plan cadastral",
      "Étude de sol"
    ],
    priceHistory: [
      { date: "Jan 2025", price: 75000000 },
      { date: "Dec 2024", price: 73000000 },
      { date: "Nov 2024", price: 72000000 }
    ]
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentTypeLabel = (type) => {
    const labels = {
      direct: "Achat direct",
      installments: "Paiement échelonné",
      bank_financing: "Financement bancaire"
    };
    return labels[type] || type;
  };

  const PaymentCalculator = () => {
    const [paymentType, setPaymentType] = useState('installments');
    const [duration, setDuration] = useState('24');
    const [downPayment, setDownPayment] = useState('30');

    const calculatePayment = () => {
      const price = parcelle.price;
      const downPaymentAmount = (price * parseInt(downPayment)) / 100;
      const loanAmount = price - downPaymentAmount;
      const monthlyPayment = loanAmount / parseInt(duration);
      
      return {
        downPayment: downPaymentAmount,
        monthlyPayment: monthlyPayment,
        totalAmount: price + (loanAmount * 0.05) // 5% d'intérêt
      };
    };

    const payment = calculatePayment();

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Calculateur de financement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Type de financement</Label>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="installments">Paiement échelonné</SelectItem>
                <SelectItem value="bank_financing">Financement bancaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Apport initial (%)</Label>
            <Select value={downPayment} onValueChange={setDownPayment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20%</SelectItem>
                <SelectItem value="30">30%</SelectItem>
                <SelectItem value="40">40%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Durée (mois)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 mois</SelectItem>
                <SelectItem value="24">24 mois</SelectItem>
                <SelectItem value="36">36 mois</SelectItem>
                <SelectItem value="48">48 mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Apport initial:</span>
              <span className="font-medium">{formatPrice(payment.downPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Mensualité:</span>
              <span className="font-medium text-blue-600">{formatPrice(payment.monthlyPayment)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total à payer:</span>
              <span className="font-bold">{formatPrice(payment.totalAmount)}</span>
            </div>
          </div>
          
          <Button className="w-full">
            Demander ce financement
          </Button>
        </CardContent>
      </Card>
    );
  };

  const ContactModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      message: '',
      financingType: 'direct'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Contact envoyé:', formData);
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Phone className="w-4 h-4 mr-2" />
            Contacter le vendeur
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter {parcelle.seller.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone *</Label>
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
              <Label htmlFor="financingType">Type d'achat</Label>
              <Select value={formData.financingType} onValueChange={(value) => setFormData({...formData, financingType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Achat direct</SelectItem>
                  <SelectItem value="installments">Paiement échelonné</SelectItem>
                  <SelectItem value="bank_financing">Financement bancaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Votre message au vendeur..."
              />
            </div>
            
            <Button type="submit" className="w-full">
              Envoyer le message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Images */}
      <section className="relative">
        <div className="relative h-96">
          <img 
            src={parcelle.images[currentImageIndex]} 
            alt={parcelle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Image Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {parcelle.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {parcelle.verified && (
              <Badge className="bg-green-500 text-white">
                <Building2 className="w-3 h-3 mr-1" />
                Vérifié
              </Badge>
            )}
            {parcelle.blockchain.verified && (
              <Badge className="bg-purple-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                Blockchain
              </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/80 hover:bg-white"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart 
                className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/80 hover:bg-white"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {parcelle.title}
              </h1>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {parcelle.location}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                    {parcelle.rating}
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Eye className="w-4 h-4" />
                    {parcelle.views} vues
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatPrice(parcelle.price)}
                  </p>
                  <p className="text-gray-500">
                    Surface: {parcelle.surface}
                  </p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {parcelle.type}
                </Badge>
              </div>
            </div>

            {/* Blockchain Verification */}
            {parcelle.blockchain.verified && (
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-purple-900">Propriété vérifiée par Blockchain</h3>
                      <p className="text-sm text-purple-700">
                        Transaction: {parcelle.blockchain.transactionHash}
                      </p>
                      <p className="text-xs text-purple-600">
                        Dernière vérification: {new Date(parcelle.blockchain.lastVerification).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Options de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {parcelle.paymentOptions.map((option) => (
                    <div key={option} className="p-4 border rounded-lg text-center hover:border-blue-500 transition-colors">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        {option === 'direct' && <Euro className="w-6 h-6 text-blue-600" />}
                        {option === 'installments' && <Calendar className="w-6 h-6 text-blue-600" />}
                        {option === 'bank_financing' && <Building2 className="w-6 h-6 text-blue-600" />}
                      </div>
                      <h4 className="font-medium text-gray-900">
                        {getPaymentTypeLabel(option)}
                      </h4>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Détails</TabsTrigger>
                <TabsTrigger value="amenities">Proximité</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {parcelle.description}
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Caractéristiques:</h4>
                      <div className="flex flex-wrap gap-2">
                        {parcelle.features.map((feature, index) => (
                          <Badge key={index} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(parcelle.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="amenities" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {parcelle.nearbyAmenities.map((amenity, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <span className="text-gray-700">{amenity.name}</span>
                          <Badge variant="outline">{amenity.distance}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {parcelle.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700">{doc}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{parcelle.seller.name}</h4>
                      <p className="text-sm text-gray-600">{parcelle.seller.type}</p>
                    </div>
                    {parcelle.seller.verified && (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{parcelle.seller.rating}</span>
                    <span className="text-gray-500 text-sm ml-2">Note vendeur</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {parcelle.seller.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {parcelle.seller.email}
                    </div>
                  </div>
                  
                  <ContactModal />
                </div>
              </CardContent>
            </Card>

            {/* Payment Calculator */}
            <PaymentCalculator />

            {/* Price History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Évolution du prix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parcelle.priceHistory.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.date}</span>
                      <span className="font-medium">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button className="w-full" size="lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Programmer une visite
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Map className="w-4 h-4 mr-2" />
                  Voir sur la carte
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <FileText className="w-4 h-4 mr-2" />
                  Demander plus d'infos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelleDetailPage;
