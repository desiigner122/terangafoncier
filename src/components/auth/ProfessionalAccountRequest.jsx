/**
 * @file ProfessionalAccountRequest.jsx
 * @description Formulaire demande compte professionnel avec upload documents
 * @created 2025-11-03
 * @week 1 - Day 4-5
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X, Building2, Phone, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';

const ProfessionalAccountRequest = ({ currentRole, userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    requestedRole: '',
    companyName: '',
    companyAddress: '',
    phoneNumber: '',
    professionalExperience: '',
    reason: '',
  });

  const [documents, setDocuments] = useState({
    businessRegistration: null, // NINEA, RCCM
    professionalLicense: null, // Licence professionnelle
    identityCard: null, // CNI, Passeport
    taxCertificate: null, // Attestation fiscale
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const professionalRoles = [
    { value: 'vendeur_pro', label: 'Vendeur Professionnel', docs: ['businessRegistration', 'identityCard', 'taxCertificate'] },
    { value: 'notaire', label: 'Notaire', docs: ['professionalLicense', 'identityCard', 'businessRegistration'] },
    { value: 'agent_foncier', label: 'Agent Foncier', docs: ['professionalLicense', 'identityCard'] },
    { value: 'geometre', label: 'Géomètre', docs: ['professionalLicense', 'identityCard'] },
    { value: 'promoteur', label: 'Promoteur Immobilier', docs: ['businessRegistration', 'identityCard', 'taxCertificate'] },
    { value: 'banque', label: 'Institution Bancaire', docs: ['businessRegistration', 'professionalLicense', 'taxCertificate'] },
  ];

  const documentLabels = {
    businessRegistration: 'Enregistrement Entreprise (NINEA/RCCM)',
    professionalLicense: 'Licence Professionnelle',
    identityCard: 'Pièce d\'identité (CNI/Passeport)',
    taxCertificate: 'Attestation Fiscale',
  };

  /**
   * Obtenir documents requis selon rôle
   */
  const getRequiredDocs = () => {
    const role = professionalRoles.find(r => r.value === formData.requestedRole);
    return role ? role.docs : [];
  };

  /**
   * Handler changement fichier
   */
  const handleFileChange = (docType, file) => {
    if (!file) return;

    // Vérifier taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${documentLabels[docType]}: Fichier trop volumineux (max 5MB)`);
      return;
    }

    // Vérifier type (PDF, JPG, PNG uniquement)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`${documentLabels[docType]}: Format invalide (PDF, JPG, PNG uniquement)`);
      return;
    }

    setDocuments(prev => ({
      ...prev,
      [docType]: file,
    }));
  };

  /**
   * Supprimer fichier sélectionné
   */
  const handleRemoveFile = (docType) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: null,
    }));
  };

  /**
   * Upload fichier vers Supabase Storage
   */
  const uploadFile = async (file, docType) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${docType}_${Date.now()}.${fileExt}`;

      setUploadProgress(prev => ({ ...prev, [docType]: 10 }));

      const { data, error } = await supabase.storage
        .from('professional-docs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      setUploadProgress(prev => ({ ...prev, [docType]: 100 }));

      // Obtenir URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('professional-docs')
        .getPublicUrl(fileName);

      return publicUrl;

    } catch (error) {
      console.error(`❌ Erreur upload ${docType}:`, error);
      toast.error(`Échec upload ${documentLabels[docType]}`);
      throw error;
    }
  };

  /**
   * Soumettre demande
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Validation
      if (!formData.requestedRole) {
        toast.error('Sélectionnez un type de compte');
        setIsSubmitting(false);
        return;
      }

      const requiredDocs = getRequiredDocs();
      const missingDocs = requiredDocs.filter(doc => !documents[doc]);
      
      if (missingDocs.length > 0) {
        toast.error(`Documents manquants: ${missingDocs.map(d => documentLabels[d]).join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      // 2. Upload documents
      const uploadedUrls = {};
      
      for (const docType of requiredDocs) {
        if (documents[docType]) {
          const url = await uploadFile(documents[docType], docType);
          uploadedUrls[docType] = url;
        }
      }

      // 3. Créer demande dans DB
      const { data, error } = await supabase
        .from('role_change_requests')
        .insert({
          user_id: userId,
          current_role: currentRole,
          requested_role: formData.requestedRole,
          status: 'pending',
          business_registration_doc: uploadedUrls.businessRegistration || null,
          professional_license_doc: uploadedUrls.professionalLicense || null,
          identity_card_doc: uploadedUrls.identityCard || null,
          tax_certificate_doc: uploadedUrls.taxCertificate || null,
          company_name: formData.companyName,
          company_address: formData.companyAddress,
          phone_number: formData.phoneNumber,
          professional_experience: formData.professionalExperience,
          reason: formData.reason,
        })
        .select()
        .single();

      if (error) throw error;

      setSubmitSuccess(true);
      toast.success('Demande envoyée avec succès ! Un administrateur va l\'examiner.');
      
      if (onSuccess) onSuccess(data);

    } catch (error) {
      console.error('❌ Erreur soumission:', error);
      toast.error('Erreur lors de la soumission de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Demande envoyée !</h3>
        <p className="text-gray-600">
          Votre demande de compte professionnel a été soumise avec succès.
          Un administrateur va l'examiner sous 24-48h.
        </p>
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Vous recevrez un email dès que votre compte sera validé.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demande de Compte Professionnel</CardTitle>
          <CardDescription>
            Remplissez ce formulaire pour passer à un compte professionnel. Vos documents seront vérifiés par notre équipe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection rôle */}
          <div className="space-y-2">
            <Label htmlFor="requestedRole">Type de compte professionnel *</Label>
            <Select
              value={formData.requestedRole}
              onValueChange={(value) => setFormData(prev => ({ ...prev, requestedRole: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de compte" />
              </SelectTrigger>
              <SelectContent>
                {professionalRoles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Informations entreprise */}
          {formData.requestedRole && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Nom de l'entreprise *
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Ex: Teranga Immobilier SARL"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Adresse *
                </Label>
                <Input
                  id="companyAddress"
                  value={formData.companyAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyAddress: e.target.value }))}
                  placeholder="Ex: Avenue Bourguiba, Dakar"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Téléphone *
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+221 77 123 45 67"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="professionalExperience">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Expérience professionnelle
                </Label>
                <Textarea
                  id="professionalExperience"
                  value={formData.professionalExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, professionalExperience: e.target.value }))}
                  placeholder="Décrivez brièvement votre expérience dans le secteur..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivation *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Pourquoi souhaitez-vous un compte professionnel ?"
                  rows={3}
                  required
                />
              </div>

              {/* Upload documents */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Documents requis</h4>
                
                {getRequiredDocs().map(docType => (
                  <div key={docType} className="space-y-2">
                    <Label>{documentLabels[docType]} *</Label>
                    
                    {!documents[docType] ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors cursor-pointer">
                        <input
                          type="file"
                          id={`file-${docType}`}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(docType, e.target.files[0])}
                        />
                        <label htmlFor={`file-${docType}`} className="cursor-pointer flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-600">
                          <Upload className="w-5 h-5" />
                          <span>Cliquez pour télécharger (PDF, JPG, PNG - Max 5MB)</span>
                        </label>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{documents[docType].name}</p>
                            <p className="text-xs text-gray-500">{(documents[docType].size / 1024).toFixed(0)} KB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(docType)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {uploadProgress[docType] > 0 && uploadProgress[docType] < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress[docType]}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  <strong>Important:</strong> Tous les documents doivent être lisibles et valides.
                  Toute information frauduleuse entraînera le refus de votre demande.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Soumettre la demande
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export default ProfessionalAccountRequest;
