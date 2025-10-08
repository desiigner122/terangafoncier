/**
 * ÉTAPES AVANCÉES DU FORMULAIRE - Documents, Photos, IA, Blockchain
 */

import React from 'react';
import {
  Shield, Image as ImageIcon, Sparkles, Brain, TrendingUp, Zap,
  Globe, Lock, Eye, CheckCircle, AlertCircle, Loader2, Upload,
  X, Plus, FileText, User, Phone, Mail, DollarSign, MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// ============================================================================
// ÉTAPE 5: DOCUMENTS JURIDIQUES
// ============================================================================

export const Step5Documents = ({ formData, setFormData }) => {
  const updateSeller = (key, value) => {
    setFormData(prev => ({
      ...prev,
      seller: { ...prev.seller, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Documents Juridiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Documents Juridiques
          </CardTitle>
          <CardDescription>
            Informations légales et documents officiels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Titre de propriété */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Titre de Propriété (TF)</Label>
              <p className="text-sm text-gray-600">Terrain immatriculé avec titre foncier</p>
            </div>
            <Switch
              checked={formData.titleDeed}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, titleDeed: checked }))}
            />
          </div>

          {formData.titleDeed && (
            <div>
              <Label htmlFor="titleDeedNumber">Numéro du Titre Foncier</Label>
              <Input
                id="titleDeedNumber"
                placeholder="Ex: TF 12345/DK"
                value={formData.titleDeedNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, titleDeedNumber: e.target.value }))}
              />
            </div>
          )}

          {/* Référence cadastrale */}
          <div>
            <Label htmlFor="cadastralReference">Référence Cadastrale</Label>
            <Input
              id="cadastralReference"
              placeholder="Ex: Section A, Lot 123"
              value={formData.cadastralReference}
              onChange={(e) => setFormData(prev => ({ ...prev, cadastralReference: e.target.value }))}
            />
          </div>

          {/* Conservation foncière */}
          <div>
            <Label htmlFor="landRegistry">Conservation Foncière</Label>
            <Input
              id="landRegistry"
              placeholder="Ex: Conservation de Dakar"
              value={formData.landRegistry}
              onChange={(e) => setFormData(prev => ({ ...prev, landRegistry: e.target.value }))}
            />
          </div>

          {/* Zonage */}
          <div>
            <Label htmlFor="zoning">Zonage / Affectation</Label>
            <Select
              value={formData.zoning}
              onValueChange={(value) => setFormData(prev => ({ ...prev, zoning: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residentiel">Résidentiel</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industriel">Industriel</SelectItem>
                <SelectItem value="mixte">Mixte</SelectItem>
                <SelectItem value="agricole">Agricole</SelectItem>
                <SelectItem value="zone_verte">Zone Verte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Informations Vendeur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            Informations du Vendeur
          </CardTitle>
          <CardDescription>
            Coordonnées pour être contacté par les acheteurs potentiels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sellerName">Nom Complet *</Label>
            <Input
              id="sellerName"
              placeholder="Prénom et Nom"
              value={formData.seller.name}
              onChange={(e) => updateSeller('name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="sellerPhone">Téléphone *</Label>
            <Input
              id="sellerPhone"
              type="tel"
              placeholder="+221 77 123 45 67"
              value={formData.seller.phone}
              onChange={(e) => updateSeller('phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="sellerEmail">Email</Label>
            <Input
              id="sellerEmail"
              type="email"
              placeholder="email@exemple.com"
              value={formData.seller.email}
              onChange={(e) => updateSeller('email', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="sellerWhatsapp">WhatsApp</Label>
            <Input
              id="sellerWhatsapp"
              type="tel"
              placeholder="+221 77 123 45 67"
              value={formData.seller.whatsapp}
              onChange={(e) => updateSeller('whatsapp', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// ÉTAPE 6: PHOTOS
// ============================================================================

export const Step6Photos = ({ 
  formData, 
  setFormData, 
  handleImageUpload, 
  removeImage, 
  setMainImage, 
  uploadingImages 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-blue-600" />
          Photos de la Propriété
        </CardTitle>
        <CardDescription>
          Ajoutez des photos de qualité pour attirer plus d'acheteurs (minimum 3, maximum 10)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zone d'upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            id="imageUpload"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploadingImages || formData.images.length >= 10}
          />
          <label htmlFor="imageUpload" className="cursor-pointer">
            {uploadingImages ? (
              <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )}
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Cliquez pour ajouter des photos
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG ou JPEG (max. 5MB par image)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {formData.images.length}/10 images ajoutées
            </p>
          </label>
        </div>

        {/* Grille des images */}
        {formData.images.length > 0 && (
          <div>
            <Label className="mb-3 block">Images téléchargées</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative group rounded-lg overflow-hidden border-2 ${
                    index === formData.mainImageIndex
                      ? 'border-blue-500 ring-2 ring-blue-300'
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />
                  
                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setMainImage(index)}
                      className="bg-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Badge image principale */}
                  {index === formData.mainImageIndex && (
                    <Badge className="absolute top-2 left-2 bg-blue-600">
                      Photo Principale
                    </Badge>
                  )}

                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                      Photo {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Alert className="mt-4">
              <Eye className="h-4 w-4" />
              <AlertDescription>
                Cliquez sur l'icône œil pour définir une photo comme image principale. 
                C'est elle qui sera affichée en premier dans l'annonce.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {formData.images.length < 3 && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ajoutez au moins 3 photos pour une annonce attractive
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================================================
// ÉTAPE 7: IA ET BLOCKCHAIN
// ============================================================================

export const Step7AIBlockchain = ({ 
  formData, 
  setFormData, 
  aiInsights, 
  analyzeWithAI, 
  aiLoading 
}) => {
  const updateBlockchain = (key, value) => {
    setFormData(prev => ({
      ...prev,
      blockchain: { ...prev.blockchain, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Analyse IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Analyse Intelligente par IA
          </CardTitle>
          <CardDescription>
            Obtenez une évaluation automatique et des recommandations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!aiInsights.priceEstimate ? (
            <div className="text-center py-8">
              <Brain className="h-16 w-16 text-purple-200 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Lancez l'analyse IA pour obtenir une estimation de prix et des recommandations
              </p>
              <Button
                onClick={analyzeWithAI}
                disabled={aiLoading || !formData.price || !formData.surface}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyser avec l'IA
                  </>
                )}
              </Button>
              {(!formData.price || !formData.surface) && (
                <p className="text-sm text-red-500 mt-2">
                  Complétez d'abord le prix et la superficie
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Estimation de prix */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <Label className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Estimation de Prix IA
                </Label>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Minimum</p>
                    <p className="text-lg font-bold text-purple-600">
                      {aiInsights.priceEstimate.min.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Recommandé</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {aiInsights.priceEstimate.recommended.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Maximum</p>
                    <p className="text-lg font-bold text-purple-600">
                      {aiInsights.priceEstimate.max.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <Badge variant="secondary">
                    Confiance: {aiInsights.priceEstimate.confidence}%
                  </Badge>
                </div>
              </div>

              {/* Tendance du marché */}
              {aiInsights.marketTrend && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Label className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Tendance du Marché
                  </Label>
                  <p className="text-lg">
                    <span className="font-bold text-green-600">
                      +{aiInsights.marketTrend.percentage}%
                    </span>
                    <span className="text-gray-600 ml-2">
                      sur {aiInsights.marketTrend.period}
                    </span>
                  </p>
                </div>
              )}

              {/* Recommandations */}
              {aiInsights.recommendations.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Recommandations IA
                  </Label>
                  {aiInsights.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Risques */}
              {aiInsights.risks.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    Points d'Attention
                  </Label>
                  {aiInsights.risks.map((risk, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                      <p className="text-sm text-gray-700">{risk}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Opportunités */}
              {aiInsights.opportunities.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    Opportunités
                  </Label>
                  {aiInsights.opportunities.map((opp, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                      <p className="text-sm text-gray-700">{opp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blockchain/NFT */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-orange-600" />
            Blockchain & Tokenisation NFT
          </CardTitle>
          <CardDescription>
            Sécurisez votre propriété avec la technologie blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Activer blockchain */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50">
            <div>
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Activer la Blockchain
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Enregistrement sécurisé et transparent sur la blockchain
              </p>
            </div>
            <Switch
              checked={formData.blockchain.enabled}
              onCheckedChange={(checked) => updateBlockchain('enabled', checked)}
            />
          </div>

          {formData.blockchain.enabled && (
            <>
              {/* Choix du réseau */}
              <div>
                <Label>Réseau Blockchain</Label>
                <Select
                  value={formData.blockchain.network}
                  onValueChange={(value) => updateBlockchain('network', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="polygon">Polygon (Recommandé)</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                    <SelectItem value="avalanche">Avalanche</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tokenisation NFT */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Créer un NFT</Label>
                  <p className="text-sm text-gray-600">
                    Tokenisez votre propriété en NFT unique
                  </p>
                </div>
                <Switch
                  checked={formData.blockchain.tokenize}
                  onCheckedChange={(checked) => updateBlockchain('tokenize', checked)}
                />
              </div>

              {/* Smart Contract */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Smart Contract</Label>
                  <p className="text-sm text-gray-600">
                    Contrat intelligent pour la transaction
                  </p>
                </div>
                <Switch
                  checked={formData.blockchain.smartContract}
                  onCheckedChange={(checked) => updateBlockchain('smartContract', checked)}
                />
              </div>

              {/* Avantages */}
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Avantages de la Blockchain:</p>
                  <ul className="text-sm space-y-1">
                    <li>✅ Propriété vérifiable et transparente</li>
                    <li>✅ Historique immuable des transactions</li>
                    <li>✅ Transferts sécurisés et rapides</li>
                    <li>✅ Réduction des fraudes</li>
                    <li>✅ Accessibilité internationale</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// ÉTAPE 8: CONFIRMATION
// ============================================================================

export const Step8Confirmation = ({ formData, aiInsights }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Confirmation et Récapitulatif
        </CardTitle>
        <CardDescription>
          Vérifiez les informations avant de publier votre annonce
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Label className="text-blue-900">Titre</Label>
            <p className="font-semibold">{formData.title}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <Label className="text-purple-900">Type</Label>
            <p className="font-semibold capitalize">{formData.propertyType.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Localisation */}
        <div className="p-4 bg-green-50 rounded-lg">
          <Label className="flex items-center gap-2 text-green-900 mb-2">
            <MapPin className="h-4 w-4" />
            Localisation
          </Label>
          <p className="font-semibold">
            {formData.neighborhood}, {formData.city}, {formData.region}
          </p>
        </div>

        {/* Prix et superficie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <Label className="flex items-center gap-2 text-orange-900">
              <DollarSign className="h-4 w-4" />
              Prix Total
            </Label>
            <p className="text-2xl font-bold text-orange-700">
              {parseInt(formData.price).toLocaleString('fr-FR')} FCFA
            </p>
            {formData.priceNegotiable && (
              <Badge variant="secondary" className="mt-2">Négociable</Badge>
            )}
          </div>
          <div className="p-4 bg-teal-50 rounded-lg">
            <Label className="text-teal-900">Superficie</Label>
            <p className="text-2xl font-bold text-teal-700">
              {formData.surface} m²
            </p>
            <p className="text-sm text-teal-600 mt-1">
              {parseInt(formData.pricePerSqm).toLocaleString('fr-FR')} FCFA/m²
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label>Caractéristiques</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(formData.utilities).filter(([_, value]) => value).map(([key]) => (
              <Badge key={key} variant="outline" className="justify-center">
                {key === 'water' && '💧 Eau'}
                {key === 'electricity' && '⚡ Électricité'}
                {key === 'sewage' && '🚰 Assainissement'}
                {key === 'internet' && '📡 Internet'}
                {key === 'phone' && '📞 Téléphone'}
                {key === 'gas' && '🔥 Gaz'}
              </Badge>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <Label className="mb-2 block">Photos ({formData.images.length})</Label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {formData.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Preview ${index + 1}`}
                className={`w-full h-20 object-cover rounded-lg ${
                  index === formData.mainImageIndex ? 'ring-2 ring-blue-500' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* IA Insights */}
        {aiInsights.priceEstimate && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Label className="flex items-center gap-2 text-purple-900 mb-2">
              <Brain className="h-4 w-4" />
              Évaluation IA
            </Label>
            <p className="text-sm text-purple-700">
              Prix recommandé: <span className="font-bold">
                {aiInsights.priceEstimate.recommended.toLocaleString('fr-FR')} FCFA
              </span>
              <Badge variant="secondary" className="ml-2">
                {aiInsights.priceEstimate.confidence}% de confiance
              </Badge>
            </p>
          </div>
        )}

        {/* Blockchain */}
        {formData.blockchain.enabled && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <Label className="flex items-center gap-2 text-orange-900 mb-2">
              <Zap className="h-4 w-4" />
              Blockchain Activée
            </Label>
            <div className="space-y-1 text-sm text-orange-700">
              <p>Réseau: <span className="font-semibold">{formData.blockchain.network}</span></p>
              {formData.blockchain.tokenize && (
                <p>✅ NFT sera créé pour cette propriété</p>
              )}
              {formData.blockchain.smartContract && (
                <p>✅ Smart Contract pour la transaction</p>
              )}
            </div>
          </div>
        )}

        {/* Avertissement final */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            En publiant cette annonce, vous confirmez que toutes les informations fournies sont exactes 
            et que vous êtes le propriétaire légitime ou avez l'autorisation de vendre ce bien.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default { Step5Documents, Step6Photos, Step7AIBlockchain, Step8Confirmation };