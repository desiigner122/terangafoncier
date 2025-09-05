import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  UploadCloud, 
  File, 
  UserPlus, 
  Building, 
  AlertCircle, 
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const FileUploadField = ({ id, label, required, onFileChange, fileName, description }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>{label}</Label>
    <div className="flex items-center justify-center w-full">
      <label htmlFor={id} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {fileName ? (
            <>
              <File className="w-8 h-8 mb-2 text-primary" />
              <p className="text-sm text-foreground font-semibold truncate max-w-xs">{fileName}</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Cliquez pour téléverser</span></p>
            </>
          )}
          <p className="text-xs text-muted-foreground">{description || 'PDF, PNG, JPG (MAX. 5MB)'}</p>
        </div>
        <Input id={id} type="file" className="hidden" onChange={onFileChange} required={required} accept=".pdf,.png,.jpg,.jpeg" />
      </label>
    </div>
  </div>
);

const BecomeSellerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sellerType, setSellerType] = useState('particulier');
  const [formData, setFormData] = useState({
    motivation: '',
    experience: '',
    businessName: '',
    businessDescription: ''
  });
  const [files, setFiles] = useState({
    idCardFront: null,
    idCardBack: null,
    residenceCert: null,
    businessDocs: null,
    propertyDocs: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { id } = e.target;
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setFiles(prev => ({ ...prev, [id]: file }));
      setError('');
    } else if (file) {
      setError('Le fichier ne doit pas dépasser 5MB.');
    }
  };

  const uploadFile = async (file, fileName) => {
    const { data, error } = await supabase.storage
      .from('FileTexts')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('FileTexts')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    // Validation
    if (!files.idCardFront || !files.idCardBack) {
      setError('Les pièces d\'identité sont obligatoires');
      return;
    }

    if (sellerType === 'professionnel' && !files.businessDocs) {
      setError('Les FileTexts d\'entreprise sont obligatoires pour un vendeur professionnel');
      return;
    }

    if (!formData.motivation.trim()) {
      setError('Veuillez expliquer votre motivation');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Upload des fichiers
      const FileTextUploadPromises = [];
      const timestamp = Date.now();
      const userId = user.id;

      if (files.idCardFront) {
        FileTextUploadPromises.push(
          uploadFile(files.idCardFront, `seller-applications/${userId}/id_card_front_${timestamp}.${files.idCardFront.name.split('.').pop()}`)
        );
      }
      if (files.idCardBack) {
        FileTextUploadPromises.push(
          uploadFile(files.idCardBack, `seller-applications/${userId}/id_card_back_${timestamp}.${files.idCardBack.name.split('.').pop()}`)
        );
      }
      if (files.residenceCert) {
        FileTextUploadPromises.push(
          uploadFile(files.residenceCert, `seller-applications/${userId}/residence_cert_${timestamp}.${files.residenceCert.name.split('.').pop()}`)
        );
      }
      if (files.businessDocs) {
        FileTextUploadPromises.push(
          uploadFile(files.businessDocs, `seller-applications/${userId}/business_docs_${timestamp}.${files.businessDocs.name.split('.').pop()}`)
        );
      }
      if (files.propertyDocs) {
        FileTextUploadPromises.push(
          uploadFile(files.propertyDocs, `seller-applications/${userId}/property_docs_${timestamp}.${files.propertyDocs.name.split('.').pop()}`)
        );
      }

      const uploadedUrls = await Promise.all(FileTextUploadPromises);

      // Créer la demande de vendeur
      const requestData = {
        user_id: user.id,
        request_type: 'account_upgrade',
        status: 'pending',
        message: JSON.stringify({
          requestedRole: sellerType === 'particulier' ? 'Vendeur Particulier' : 'Vendeur Pro',
          currentRole: user?.user_metadata?.role || 'Particulier',
          sellerType,
          motivation: formData.motivation,
          experience: formData.experience,
          businessName: sellerType === 'professionnel' ? formData.businessName : null,
          businessDescription: sellerType === 'professionnel' ? formData.businessDescription : null,
          FileTexts: {
            idCardFront: uploadedUrls[0] || null,
            idCardBack: uploadedUrls[1] || null,
            residenceCert: uploadedUrls[2] || null,
            businessDocs: uploadedUrls[3] || null,
            propertyDocs: uploadedUrls[4] || null
          },
          timestamp: new Date().toISOString()
        }),
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('requests')
        .insert([requestData])
        .select();

      if (error) throw error;

      window.safeGlobalToast('Demande de statut vendeur soumise avec succès ! Vous recevrez une réponse sous 24-48h.', 'success');
      navigate('/dashboard');

    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError('Erreur lors de l\'envoi de votre demande. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Rediriger si déjà vendeur
  if (user?.user_metadata?.role?.includes('Vendeur') || user?.role?.includes('Vendeur')) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <UserPlus className="w-12 h-12 mx-auto text-primary" />
            <CardTitle className="text-3xl font-bold mt-2">Devenir Vendeur</CardTitle>
            <CardDescription className="text-base">
              Rejoignez notre réseau de vendeurs certifiés et commencez à vendre vos biens immobiliers en toute sécurité.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Type de vendeur */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Type de vendeur</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                      sellerType === 'particulier' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSellerType('particulier')}
                  >
                    <Input 
                      type="radio" 
                      name="sellerType" 
                      value="particulier" 
                      checked={sellerType === 'particulier'}
                      onChange={(e) => setSellerType(e.target.value)}
                      className="w-4 h-4" 
                    />
                    <Label className="cursor-pointer flex-1">
                      <div className="flex items-center space-x-3">
                        <UserPlus className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-semibold">Vendeur Particulier</div>
                          <div className="text-sm text-muted-foreground">Je vends mes biens personnels occasionnellement</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div 
                    className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                      sellerType === 'professionnel' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSellerType('professionnel')}
                  >
                    <Input 
                      type="radio" 
                      name="sellerType" 
                      value="professionnel" 
                      checked={sellerType === 'professionnel'}
                      onChange={(e) => setSellerType(e.target.value)}
                      className="w-4 h-4" 
                    />
                    <Label className="cursor-pointer flex-1">
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-semibold">Vendeur Professionnel</div>
                          <div className="text-sm text-muted-foreground">J'ai une entreprise immobilière ou je vends régulièrement</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Informations et Motivation</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="motivation">Motivation *</Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      placeholder="Pourquoi souhaitez-vous devenir vendeur sur notre plateforme ?"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      required
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Expérience dans l'immobilier</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      placeholder="Décrivez votre expérience dans l'immobilier (optionnel)"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Informations entreprise (si professionnel) */}
              {sellerType === 'professionnel' && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Informations Entreprise</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Nom de l'entreprise *</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        placeholder="Ex: Immobilier Dakar SARL"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required={sellerType === 'professionnel'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessDescription">Description de l'activité</Label>
                      <Textarea
                        id="businessDescription"
                        name="businessDescription"
                        placeholder="Décrivez votre activité immobilière"
                        value={formData.businessDescription}
                        onChange={handleInputChange}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* FileTexts requis */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">FileTexts Requis</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadField
                    id="idCardFront"
                    label="Carte d'identité (Recto) *"
                    required
                    onFileChange={handleFileChange}
                    fileName={files.idCardFront?.name}
                    description="Scan de la face avant de votre CNI"
                  />
                  <FileUploadField
                    id="idCardBack"
                    label="Carte d'identité (Verso) *"
                    required
                    onFileChange={handleFileChange}
                    fileName={files.idCardBack?.name}
                    description="Scan de la face arrière de votre CNI"
                  />
                  <FileUploadField
                    id="residenceCert"
                    label="Certificat de résidence"
                    onFileChange={handleFileChange}
                    fileName={files.residenceCert?.name}
                    description="FileText prouvant votre adresse"
                  />
                  {sellerType === 'professionnel' && (
                    <FileUploadField
                      id="businessDocs"
                      label="FileTexts d'entreprise *"
                      required
                      onFileChange={handleFileChange}
                      fileName={files.businessDocs?.name}
                      description="NINEA, RCCM, ou autre FileText officiel"
                    />
                  )}
                  <FileUploadField
                    id="propertyDocs"
                    label="Titres de propriété"
                    onFileChange={handleFileChange}
                    fileName={files.propertyDocs?.name}
                    description="FileTexts de vos biens à vendre (optionnel)"
                  />
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center space-x-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <span className="text-destructive">{error}</span>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Soumettre ma demande
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BecomeSellerPage;
