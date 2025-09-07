import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Shield, 
  CreditCard, 
  Banknote, 
  Calculator,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
  Calendar,
  Users,
  Home,
  Zap,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  Database,
  Blocks,
  Link as LinkIcon,
  Lock,
  Eye,
  Camera,
  Video
} from 'lucide-react';

// Données simulées pour la démonstration - Version NFT Blockchain
const mockParcel = {
  id: 'TF-NFT-2024-001',
  nft_id: 'NFT_TERRAIN_001',
  title: 'Terrain NFT Premium - Almadies Blockchain',
  location: 'Almadies, Dakar',
  size: '500 m²',
  price: 125000000, // En FCFA
  pricePerSquareMeter: 250000,
  status: 'NFT Vérifié',
  blockchain_status: 'Tokenisé',
  smart_contract_address: '0x742d35cc6634c0532925a3b8d',
  coordinates: { lat: 14.7379, lng: -17.5007 },
  description: 'Terrain premium tokenisé en NFT sur blockchain avec smart contract automatique. Financement bancaire intégré et suivi construction temps réel.',
  seller_type: 'Vendeur Pro',
  seller_name: 'Teranga Développement SARL',
  features: [
    'NFT Blockchain sécurisé',
    'Smart Contract automatique',
    'Financement bancaire intégré',
    'Accès route bitumée',
    'Vue sur océan',
    'Environnement calme et sécurisé'
  ],
  documents: [
    { name: 'Titre Foncier', status: 'verified', date: '2024-01-15' },
    { name: 'Certificat de Viabilité', status: 'verified', date: '2024-01-10' },
    { name: 'Plan de Bornage', status: 'verified', date: '2024-01-12' }
  ],
  seller: {
    name: 'Amadou Diallo',
    phone: '+221 77 123 45 67',
    email: 'amadou.diallo@example.com',
    verified: true
  }
};

const PaymentPlanCard = ({ plan, selected, onSelect }) => {
  const { type, title, description, features, monthlyPayment, totalCost, duration, icon: Icon, recommended } = plan;
  
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        selected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
      } ${recommended ? 'border-primary' : ''}`}
      onClick={() => onSelect(type)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {recommended && (
            <Badge variant="default" className="bg-primary">Recommandé</Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Paiement mensuel</p>
            <p className="font-semibold text-lg">{monthlyPayment?.toLocaleString()} FCFA</p>
          </div>
          <div>
            <p className="text-muted-foreground">Coût total</p>
            <p className="font-semibold text-lg">{totalCost?.toLocaleString()} FCFA</p>
          </div>
        </div>
        
        {duration && (
          <div className="text-sm">
            <p className="text-muted-foreground">Durée: <span className="font-medium">{duration}</span></p>
          </div>
        )}
        
        <ul className="text-sm space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const IntelligentParcelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('direct');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    employmentStatus: '',
    monthlyIncome: '',
    downPayment: '',
    specialRequests: ''
  });

  // Plans de paiement disponibles
  const paymentPlans = [
    {
      type: 'direct',
      title: 'Achat Direct',
      description: 'Paiement intégral immédiat',
      icon: Zap,
      monthlyPayment: 45000000,
      totalCost: 45000000,
      duration: 'Immédiat',
      features: [
        'Transfert de propriété immédiat',
        'Aucun intérêt',
        'Remise de 5% pour paiement comptant',
        'Support juridique inclus'
      ],
      recommended: false
    },
    {
      type: 'installments',
      title: 'Paiement Échelonné',
      description: 'Étalez vos paiements sur 12-36 mois',
      icon: Calendar,
      monthlyPayment: 1500000,
      totalCost: 47250000,
      duration: '30 mois',
      features: [
        'Acompte de 30% requis',
        'Taux d\'intérêt réduit (2.5%)',
        'Flexibilité des échéances',
        'Transfert après 50% versé'
      ],
      recommended: true
    },
    {
      type: 'bank_financing',
      title: 'Financement Bancaire',
      description: 'Crédit immobilier avec nos partenaires',
      icon: Banknote,
      monthlyPayment: 280000,
      totalCost: 67200000,
      duration: '20 ans',
      features: [
        'Apport personnel: 20%',
        'Taux négocié: 7.5%',
        'Accompagnement dossier',
        'Partenariat avec 5 banques'
      ],
      recommended: false
    }
  ];

  const selectedPlan = paymentPlans.find(plan => plan.type === selectedPaymentPlan);

  const handlePurchaseStart = () => {
    setShowPaymentDialog(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Ici, vous ajouteriez la logique pour traiter la demande
    console.log('Demande d\'achat soumise:', {
      parcel: mockParcel,
      paymentPlan: selectedPlan,
      customerInfo: paymentForm
    });
    
    // Simulation de redirection vers le processus de paiement
    setShowPaymentDialog(false);
    // navigate('/payment-process');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la parcelle */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/parcelles')}
            className="mb-4"
          >
            ← Retour aux terrains
          </Button>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockParcel.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {mockParcel.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    {mockParcel.size}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {mockParcel.price.toLocaleString()} FCFA
                </p>
                <p className="text-muted-foreground">
                  {mockParcel.pricePerSquareMeter.toLocaleString()} FCFA/m²
                </p>
                <Badge variant="outline" className="mt-2">
                  <Shield className="h-3 w-3 mr-1" />
                  {mockParcel.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informations détaillées */}
          <div className="lg:col-span-2 space-y-6">
            {/* Options de Paiement Intelligentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Options de Paiement Intelligentes
                </CardTitle>
                <CardDescription>
                  Choisissez la solution de financement qui vous convient le mieux
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {paymentPlans.map((plan) => (
                    <PaymentPlanCard
                      key={plan.type}
                      plan={plan}
                      selected={selectedPaymentPlan === plan.type}
                      onSelect={setSelectedPaymentPlan}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Détails de la parcelle */}
            <Card>
              <CardHeader>
                <CardTitle>Détails de la Parcelle</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="description">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="seller">Vendeur</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-4">
                    <p className="text-muted-foreground mb-4">{mockParcel.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Caractéristiques:</h4>
                      <ul className="space-y-1">
                        {mockParcel.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents" className="mt-4">
                    <div className="space-y-3">
                      {mockParcel.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">Vérifié le {new Date(doc.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Vérifié
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="seller" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{mockParcel.seller.name}</p>
                          {mockParcel.seller.verified && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{mockParcel.seller.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{mockParcel.seller.email}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar d'action */}
          <div className="space-y-6">
            {/* Résumé du plan sélectionné */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Sélectionné</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <selectedPlan.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">{selectedPlan.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedPlan.description}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prix de base:</span>
                    <span className="font-medium">{mockParcel.price.toLocaleString()} FCFA</span>
                  </div>
                  
                  {selectedPlan.type !== 'direct' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paiement mensuel:</span>
                        <span className="font-medium">{selectedPlan.monthlyPayment.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Durée:</span>
                        <span className="font-medium">{selectedPlan.duration}</span>
                      </div>
                    </>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Coût total:</span>
                    <span className="text-primary">{selectedPlan.totalCost.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg" onClick={handlePurchaseStart}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Commencer l'Achat
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Finaliser votre Achat</DialogTitle>
                      <DialogDescription>
                        Remplissez vos informations pour commencer le processus d'achat
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nom complet *</Label>
                        <Input
                          id="fullName"
                          value={paymentForm.fullName}
                          onChange={(e) => setPaymentForm({...paymentForm, fullName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={paymentForm.email}
                            onChange={(e) => setPaymentForm({...paymentForm, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone *</Label>
                          <Input
                            id="phone"
                            value={paymentForm.phone}
                            onChange={(e) => setPaymentForm({...paymentForm, phone: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Textarea
                          id="address"
                          value={paymentForm.address}
                          onChange={(e) => setPaymentForm({...paymentForm, address: e.target.value})}
                          rows={2}
                        />
                      </div>
                      
                      {selectedPlan.type === 'bank_financing' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="employmentStatus">Statut professionnel</Label>
                            <Select
                              value={paymentForm.employmentStatus}
                              onValueChange={(value) => setPaymentForm({...paymentForm, employmentStatus: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="employee">Salarié</SelectItem>
                                <SelectItem value="self_employed">Indépendant</SelectItem>
                                <SelectItem value="business_owner">Chef d'entreprise</SelectItem>
                                <SelectItem value="retired">Retraité</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="monthlyIncome">Revenus mensuels (FCFA)</Label>
                            <Input
                              id="monthlyIncome"
                              type="number"
                              value={paymentForm.monthlyIncome}
                              onChange={(e) => setPaymentForm({...paymentForm, monthlyIncome: e.target.value})}
                            />
                          </div>
                        </>
                      )}
                      
                      {selectedPlan.type === 'installments' && (
                        <div className="space-y-2">
                          <Label htmlFor="downPayment">Acompte souhaité (FCFA)</Label>
                          <Input
                            id="downPayment"
                            type="number"
                            placeholder={`Minimum: ${(mockParcel.price * 0.3).toLocaleString()}`}
                            value={paymentForm.downPayment}
                            onChange={(e) => setPaymentForm({...paymentForm, downPayment: e.target.value})}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="specialRequests">Demandes spéciales</Label>
                        <Textarea
                          id="specialRequests"
                          value={paymentForm.specialRequests}
                          onChange={(e) => setPaymentForm({...paymentForm, specialRequests: e.target.value})}
                          rows={2}
                          placeholder="Délais souhaités, questions particulières..."
                        />
                      </div>
                      
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Votre demande sera traitée sous 24h. Un conseiller vous contactera pour finaliser les détails.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowPaymentDialog(false)} className="flex-1">
                          Annuler
                        </Button>
                        <Button type="submit" className="flex-1">
                          Soumettre la Demande
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Informations importantes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Garanties Teranga Foncier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Vérification Légale</p>
                    <p className="text-xs text-muted-foreground">Tous nos terrains sont vérifiés juridiquement</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Garantie Anti-Fraude</p>
                    <p className="text-xs text-muted-foreground">Protection totale contre les arnaques</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Accompagnement Juridique</p>
                    <p className="text-xs text-muted-foreground">Support complet jusqu'au transfert</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact direct */}
            <Card>
              <CardHeader>
                <CardTitle>Besoin d'Aide ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  +221 77 593 42 41
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  contact@terangafoncier.com
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Abdoulaye Diémé, CEO<br />
                  Disponible 7j/7 pour vous accompagner
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentParcelPage;
