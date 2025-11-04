# 🚀 ROADMAP APPLICATION COMPLÈTE - TERANGA FONCIER

**Date début**: 4 Novembre 2025  
**Date fin prévue**: 20 Janvier 2026  
**Durée totale**: 11 semaines (55 jours ouvrés)  
**Objectif**: Application 100% autonome avec Blockchain + IA + Tokenisation

---

## 📊 VUE D'ENSEMBLE

### Progression Actuelle
```
[████████████████████░░░░░░░░░░░] 65% COMPLÉTÉ

✅ Phase 1-6 du plan 8.5h: TERMINÉES
✅ Infrastructure code IA: 2990 lignes PRÊTES
✅ Infrastructure blockchain backend: PRÊTE
⏳ Intégrations manquantes: 35%
```

### 4 Phases Principales

| Phase | Durée | Objectif | Statut |
|-------|-------|----------|--------|
| **PHASE 1 - MVP PRODUCTION** | 4 semaines | App fonctionnelle transactions réelles | 🔴 À FAIRE |
| **PHASE 2 - IA INTEGRATION** | 2 semaines | IA active dans workflows | 🔴 À FAIRE |
| **PHASE 3 - BLOCKCHAIN** | 3 semaines | Tokenisation propriétés + NFT | 🔴 À FAIRE |
| **PHASE 4 - AUTONOMIE 100%** | 2 semaines | App totalement autonome | 🔴 À FAIRE |

---

## 📅 PLANNING DÉTAILLÉ

### PHASE 1 - MVP PRODUCTION (Semaines 1-4)

**Objectif**: Rendre l'application prête pour vraies transactions

#### SEMAINE 1 (4-8 Nov 2025)

##### 🔐 Jour 1-3: Email Verification Automatique

**Problème actuel**: Comptes restent `verification_status: 'unverified'` même après confirmation email

**Tâches**:
1. **Configurer Supabase Email Templates** (4h)
   ```sql
   -- Créer template email personnalisé
   -- Dashboard Supabase > Authentication > Email Templates
   
   Template: "Confirm signup"
   Subject: "Bienvenue sur Teranga Foncier - Confirmez votre compte"
   
   Body:
   <h2>Bienvenue {{ .ConfirmationURL }} !</h2>
   <p>Cliquez sur le lien ci-dessous pour activer votre compte:</p>
   <a href="{{ .ConfirmationURL }}">Activer mon compte</a>
   <p>Ce lien expire dans 24h.</p>
   ```

2. **Listener Auth State Change** (6h)
   ```javascript
   // src/contexts/UnifiedAuthContext.jsx - À ajouter
   
   useEffect(() => {
     const { data: authListener } = supabase.auth.onAuthStateChange(
       async (event, session) => {
         console.log('🔐 Auth event:', event);
         
         if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
           // Email confirmé automatiquement
           const { error } = await supabase
             .from('profiles')
             .update({ 
               verification_status: 'verified',
               verified_at: new Date().toISOString()
             })
             .eq('id', session.user.id);
           
           if (!error) {
             console.log('✅ Compte vérifié automatiquement');
             toast.success('Votre compte a été vérifié avec succès !');
           }
         }
         
         if (event === 'USER_UPDATED' && session?.user?.email_confirmed_at) {
           // Mise à jour statut si email confirmé plus tard
           await supabase
             .from('profiles')
             .update({ verification_status: 'verified' })
             .eq('id', session.user.id);
         }
       }
     );
     
     return () => authListener.subscription.unsubscribe();
   }, []);
   ```

3. **Page Re-envoi Email** (4h)
   ```javascript
   // src/pages/ResendVerificationEmail.jsx - CRÉER
   
   import { useState } from 'react';
   import { supabase } from '@/lib/supabaseClient';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   import { Card } from '@/components/ui/card';
   
   export default function ResendVerificationEmail() {
     const [email, setEmail] = useState('');
     const [loading, setLoading] = useState(false);
     const [sent, setSent] = useState(false);
     
     const handleResend = async (e) => {
       e.preventDefault();
       setLoading(true);
       
       try {
         const { error } = await supabase.auth.resend({
           type: 'signup',
           email: email,
         });
         
         if (error) throw error;
         
         setSent(true);
         toast.success('Email de vérification renvoyé !');
       } catch (error) {
         toast.error('Erreur: ' + error.message);
       } finally {
         setLoading(false);
       }
     };
     
     return (
       <div className="min-h-screen flex items-center justify-center">
         <Card className="p-8 max-w-md">
           <h2 className="text-2xl font-bold mb-4">Renvoyer Email de Vérification</h2>
           {!sent ? (
             <form onSubmit={handleResend}>
               <Input
                 type="email"
                 placeholder="Votre email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
               <Button type="submit" loading={loading} className="mt-4 w-full">
                 Renvoyer Email
               </Button>
             </form>
           ) : (
             <p className="text-green-600">
               ✅ Email envoyé ! Consultez votre boîte de réception.
             </p>
           )}
         </Card>
       </div>
     );
   }
   ```

4. **Tests Email Verification** (2h)
   - Tester inscription nouvelle
   - Tester clic lien confirmation
   - Vérifier mise à jour automatique `verification_status`
   - Tester re-envoi email

**Livrables Jour 1-3**:
- ✅ Template email Supabase configuré
- ✅ Listener auth state change actif
- ✅ Page re-envoi email créée
- ✅ Tests passés (4/4)

##### 📋 Jour 4-5: Validation Comptes Professionnels

**Problème**: Pas de workflow validation notaires/géomètres/banques

**Tâches**:

1. **Migration Table `role_change_requests`** (2h)
   ```sql
   -- migrations/create_role_change_requests.sql
   
   CREATE TABLE IF NOT EXISTS public.role_change_requests (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     current_role TEXT NOT NULL,
     requested_role TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
     
     -- Documents justificatifs
     identity_document_url TEXT,
     professional_license_url TEXT, -- Pour notaire/géomètre
     institution_proof_url TEXT, -- Pour banque/mairie
     additional_documents JSONB DEFAULT '[]'::jsonb,
     
     -- Validation
     reviewed_by UUID REFERENCES auth.users(id),
     reviewed_at TIMESTAMPTZ,
     rejection_reason TEXT,
     
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Index
   CREATE INDEX idx_role_requests_user ON role_change_requests(user_id);
   CREATE INDEX idx_role_requests_status ON role_change_requests(status);
   
   -- RLS
   ALTER TABLE role_change_requests ENABLE ROW LEVEL SECURITY;
   
   -- Policy: Users can view their own requests
   CREATE POLICY "Users can view own requests" ON role_change_requests
     FOR SELECT USING (auth.uid() = user_id);
   
   -- Policy: Users can create requests
   CREATE POLICY "Users can create requests" ON role_change_requests
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   
   -- Policy: Admins can view/update all
   CREATE POLICY "Admins full access" ON role_change_requests
     FOR ALL USING (
       EXISTS (
         SELECT 1 FROM profiles
         WHERE id = auth.uid() AND role = 'admin'
       )
     );
   ```

2. **Composant Upload Documents** (4h)
   ```javascript
   // src/components/auth/ProfessionalAccountRequest.jsx - CRÉER
   
   import { useState } from 'react';
   import { supabase } from '@/lib/supabaseClient';
   import { Button } from '@/components/ui/button';
   import { Card } from '@/components/ui/card';
   import { Upload, FileCheck, AlertCircle } from 'lucide-react';
   
   const PROFESSIONAL_ROLES = {
     notaire: {
       label: 'Notaire',
       requiredDocs: ['identity', 'license', 'ordre_inscription'],
       description: 'Inscription à l\'Ordre des Notaires requise'
     },
     geometre: {
       label: 'Géomètre',
       requiredDocs: ['identity', 'license', 'certification'],
       description: 'Certification professionnelle requise'
     },
     banque: {
       label: 'Banque',
       requiredDocs: ['identity', 'institution_proof', 'agreg_bceao'],
       description: 'Agrément BCEAO requis'
     },
     mairie: {
       label: 'Mairie',
       requiredDocs: ['identity', 'decree', 'official_letter'],
       description: 'Arrêté de nomination requis'
     }
   };
   
   export default function ProfessionalAccountRequest({ currentUser }) {
     const [selectedRole, setSelectedRole] = useState('');
     const [files, setFiles] = useState({});
     const [uploading, setUploading] = useState(false);
     
     const handleFileSelect = (docType, file) => {
       setFiles(prev => ({ ...prev, [docType]: file }));
     };
     
     const uploadDocument = async (file, docType) => {
       const fileExt = file.name.split('.').pop();
       const fileName = `${currentUser.id}/${docType}_${Date.now()}.${fileExt}`;
       
       const { data, error } = await supabase.storage
         .from('professional-documents')
         .upload(fileName, file);
       
       if (error) throw error;
       
       const { data: { publicUrl } } = supabase.storage
         .from('professional-documents')
         .getPublicUrl(fileName);
       
       return publicUrl;
     };
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       setUploading(true);
       
       try {
         // 1. Upload tous les documents
         const uploadedDocs = {};
         
         for (const [docType, file] of Object.entries(files)) {
           if (file) {
             const url = await uploadDocument(file, docType);
             uploadedDocs[docType] = url;
           }
         }
         
         // 2. Créer demande
         const { error } = await supabase
           .from('role_change_requests')
           .insert({
             user_id: currentUser.id,
             current_role: currentUser.role,
             requested_role: selectedRole,
             identity_document_url: uploadedDocs.identity,
             professional_license_url: uploadedDocs.license || uploadedDocs.certification,
             institution_proof_url: uploadedDocs.institution_proof || uploadedDocs.decree,
             additional_documents: Object.entries(uploadedDocs)
               .filter(([key]) => !['identity', 'license', 'institution_proof'].includes(key))
               .map(([key, url]) => ({ type: key, url }))
           });
         
         if (error) throw error;
         
         toast.success('Demande envoyée avec succès ! Vous serez notifié de la décision.');
         
         // 3. Notification admin
         await supabase
           .from('notifications')
           .insert({
             user_id: 'ADMIN', // Tous les admins
             type: 'role_change_request',
             title: `Nouvelle demande ${PROFESSIONAL_ROLES[selectedRole].label}`,
             message: `${currentUser.full_name} demande à devenir ${PROFESSIONAL_ROLES[selectedRole].label}`,
             priority: 'high'
           });
         
       } catch (error) {
         toast.error('Erreur: ' + error.message);
       } finally {
         setUploading(false);
       }
     };
     
     return (
       <Card className="p-6">
         <h2 className="text-2xl font-bold mb-4">Demande Compte Professionnel</h2>
         
         <form onSubmit={handleSubmit}>
           {/* Sélection rôle */}
           <div className="mb-6">
             <label className="block mb-2 font-semibold">Rôle souhaité</label>
             <select
               value={selectedRole}
               onChange={(e) => setSelectedRole(e.target.value)}
               className="w-full p-2 border rounded"
               required
             >
               <option value="">-- Sélectionner --</option>
               {Object.entries(PROFESSIONAL_ROLES).map(([key, role]) => (
                 <option key={key} value={key}>{role.label}</option>
               ))}
             </select>
             {selectedRole && (
               <p className="mt-2 text-sm text-gray-600">
                 <AlertCircle className="w-4 h-4 inline mr-1" />
                 {PROFESSIONAL_ROLES[selectedRole].description}
               </p>
             )}
           </div>
           
           {/* Upload documents */}
           {selectedRole && (
             <div className="space-y-4">
               {PROFESSIONAL_ROLES[selectedRole].requiredDocs.map(docType => (
                 <div key={docType}>
                   <label className="block mb-2 font-medium capitalize">
                     {docType.replace('_', ' ')} *
                   </label>
                   <input
                     type="file"
                     accept=".pdf,.jpg,.jpeg,.png"
                     onChange={(e) => handleFileSelect(docType, e.target.files[0])}
                     required
                   />
                   {files[docType] && (
                     <p className="mt-1 text-sm text-green-600">
                       <FileCheck className="w-4 h-4 inline mr-1" />
                       {files[docType].name}
                     </p>
                   )}
                 </div>
               ))}
             </div>
           )}
           
           <Button
             type="submit"
             disabled={!selectedRole || uploading}
             className="w-full mt-6"
           >
             {uploading ? 'Envoi en cours...' : 'Soumettre la demande'}
           </Button>
         </form>
       </Card>
     );
   }
   ```

3. **Dashboard Admin Validation** (6h)
   ```javascript
   // src/pages/admin/RoleChangeRequests.jsx - CRÉER
   
   import { useState, useEffect } from 'react';
   import { supabase } from '@/lib/supabaseClient';
   import { Button } from '@/components/ui/button';
   import { Badge } from '@/components/ui/badge';
   import { Card } from '@/components/ui/card';
   import { Check, X, Eye, Download } from 'lucide-react';
   
   export default function RoleChangeRequests() {
     const [requests, setRequests] = useState([]);
     const [loading, setLoading] = useState(true);
     const [selectedRequest, setSelectedRequest] = useState(null);
     
     useEffect(() => {
       loadRequests();
       
       // Realtime subscription
       const subscription = supabase
         .channel('role-requests')
         .on('postgres_changes', {
           event: '*',
           schema: 'public',
           table: 'role_change_requests'
         }, () => loadRequests())
         .subscribe();
       
       return () => subscription.unsubscribe();
     }, []);
     
     const loadRequests = async () => {
       const { data, error } = await supabase
         .from('role_change_requests')
         .select(`
           *,
           user:profiles!user_id(id, full_name, email, avatar_url)
         `)
         .order('created_at', { ascending: false });
       
       if (!error) setRequests(data || []);
       setLoading(false);
     };
     
     const handleApprove = async (requestId, userId, requestedRole) => {
       try {
         await supabase.rpc('approve_role_change', {
           request_id: requestId,
           user_id: userId,
           new_role: requestedRole
         });
         
         toast.success('Demande approuvée ! Le rôle a été mis à jour.');
         loadRequests();
       } catch (error) {
         toast.error('Erreur: ' + error.message);
       }
     };
     
     const handleReject = async (requestId, reason) => {
       const { error } = await supabase
         .from('role_change_requests')
         .update({
           status: 'rejected',
           rejection_reason: reason,
           reviewed_by: (await supabase.auth.getUser()).data.user.id,
           reviewed_at: new Date().toISOString()
         })
         .eq('id', requestId);
       
       if (!error) {
         toast.success('Demande rejetée.');
         loadRequests();
       }
     };
     
     return (
       <div className="p-6">
         <h1 className="text-3xl font-bold mb-6">Demandes Changement de Rôle</h1>
         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Liste demandes */}
           <div className="lg:col-span-2 space-y-4">
             {requests.filter(r => r.status === 'pending').map(request => (
               <Card key={request.id} className="p-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <img
                       src={request.user.avatar_url || '/default-avatar.png'}
                       className="w-12 h-12 rounded-full"
                     />
                     <div>
                       <p className="font-bold">{request.user.full_name}</p>
                       <p className="text-sm text-gray-600">{request.user.email}</p>
                       <Badge variant="secondary" className="mt-1">
                         {request.current_role} → {request.requested_role}
                       </Badge>
                     </div>
                   </div>
                   
                   <div className="flex gap-2">
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => setSelectedRequest(request)}
                     >
                       <Eye className="w-4 h-4 mr-1" />
                       Détails
                     </Button>
                     <Button
                       size="sm"
                       variant="success"
                       onClick={() => handleApprove(request.id, request.user_id, request.requested_role)}
                     >
                       <Check className="w-4 h-4 mr-1" />
                       Approuver
                     </Button>
                     <Button
                       size="sm"
                       variant="destructive"
                       onClick={() => {
                         const reason = prompt('Raison du rejet:');
                         if (reason) handleReject(request.id, reason);
                       }}
                     >
                       <X className="w-4 h-4 mr-1" />
                       Rejeter
                     </Button>
                   </div>
                 </div>
               </Card>
             ))}
           </div>
           
           {/* Détails demande sélectionnée */}
           {selectedRequest && (
             <Card className="p-4">
               <h3 className="font-bold mb-4">Documents Justificatifs</h3>
               <div className="space-y-2">
                 {selectedRequest.identity_document_url && (
                   <a
                     href={selectedRequest.identity_document_url}
                     target="_blank"
                     className="flex items-center gap-2 text-blue-600 hover:underline"
                   >
                     <Download className="w-4 h-4" />
                     Pièce d'identité
                   </a>
                 )}
                 {selectedRequest.professional_license_url && (
                   <a
                     href={selectedRequest.professional_license_url}
                     target="_blank"
                     className="flex items-center gap-2 text-blue-600 hover:underline"
                   >
                     <Download className="w-4 h-4" />
                     Licence professionnelle
                   </a>
                 )}
                 {selectedRequest.institution_proof_url && (
                   <a
                     href={selectedRequest.institution_proof_url}
                     target="_blank"
                     className="flex items-center gap-2 text-blue-600 hover:underline"
                   >
                     <Download className="w-4 h-4" />
                     Preuve institution
                   </a>
                 )}
               </div>
             </Card>
           )}
         </div>
       </div>
     );
   }
   ```

4. **RPC Function Approbation** (2h)
   ```sql
   -- migrations/create_approve_role_change_function.sql
   
   CREATE OR REPLACE FUNCTION approve_role_change(
     request_id UUID,
     user_id UUID,
     new_role TEXT
   ) RETURNS VOID AS $$
   BEGIN
     -- 1. Mettre à jour le rôle utilisateur
     UPDATE profiles
     SET role = new_role,
         user_type = new_role,
         updated_at = NOW()
     WHERE id = user_id;
     
     -- 2. Marquer demande comme approuvée
     UPDATE role_change_requests
     SET status = 'approved',
         reviewed_by = auth.uid(),
         reviewed_at = NOW()
     WHERE id = request_id;
     
     -- 3. Notification utilisateur
     INSERT INTO notifications (user_id, type, title, message, priority)
     VALUES (
       user_id,
       'role_approved',
       'Votre demande a été approuvée !',
       'Votre compte a été mis à niveau vers le rôle ' || new_role || '. Vous pouvez maintenant accéder à toutes les fonctionnalités.',
       'high'
     );
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

**Livrables Jour 4-5**:
- ✅ Table `role_change_requests` créée
- ✅ Composant demande professionnelle créé
- ✅ Dashboard admin validation créé
- ✅ RPC function approbation créée

---

#### SEMAINE 2 (11-15 Nov 2025)

##### 🖊️ Jour 1-3: Signature Électronique DocuSign

**Objectif**: Intégrer DocuSign pour signature contrats

**Tâches**:

1. **Compte DocuSign Developer** (2h)
   - Créer compte sur https://developers.docusign.com
   - Obtenir Integration Key
   - Configurer OAuth 2.0
   - Tester en mode sandbox

2. **Backend DocuSign Service** (8h)
   ```javascript
   // backend/services/DocuSignService.js - CRÉER
   
   import docusign from 'docusign-esign';
   import fs from 'fs';
   
   const INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY;
   const USER_ID = process.env.DOCUSIGN_USER_ID;
   const ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID;
   const PRIVATE_KEY_PATH = process.env.DOCUSIGN_PRIVATE_KEY_PATH;
   const OAUTH_BASE_PATH = 'account-d.docusign.com'; // 'account.docusign.com' en prod
   
   class DocuSignService {
     constructor() {
       this.apiClient = new docusign.ApiClient();
       this.apiClient.setOAuthBasePath(OAUTH_BASE_PATH);
     }
     
     async getAccessToken() {
       const rsaKey = fs.readFileSync(PRIVATE_KEY_PATH);
       
       const results = await this.apiClient.requestJWTUserToken(
         INTEGRATION_KEY,
         USER_ID,
         ['signature', 'impersonation'],
         rsaKey,
         3600
       );
       
       return results.body.access_token;
     }
     
     async sendContractForSignature(contractData) {
       try {
         // 1. Obtenir access token
         const accessToken = await this.getAccessToken();
         this.apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
         
         // 2. Créer enveloppe
         const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
         
         // Lire le PDF du contrat
         const contractPdfBytes = fs.readFileSync(contractData.pdfPath);
         const contractPdfBase64 = contractPdfBytes.toString('base64');
         
         // Définir le document
         const document = docusign.Document.constructFromObject({
           documentBase64: contractPdfBase64,
           name: 'Contrat de Vente',
           fileExtension: 'pdf',
           documentId: '1'
         });
         
         // Signataires
         const signers = [
           // Acheteur
           docusign.Signer.constructFromObject({
             email: contractData.buyerEmail,
             name: contractData.buyerName,
             recipientId: '1',
             routingOrder: '1',
             tabs: {
               signHereTabs: [{
                 documentId: '1',
                 pageNumber: '1',
                 xPosition: '100',
                 yPosition: '150',
                 tabLabel: 'Signature Acheteur'
               }],
               dateSignedTabs: [{
                 documentId: '1',
                 pageNumber: '1',
                 xPosition: '100',
                 yPosition: '200'
               }]
             }
           }),
           // Vendeur
           docusign.Signer.constructFromObject({
             email: contractData.sellerEmail,
             name: contractData.sellerName,
             recipientId: '2',
             routingOrder: '2',
             tabs: {
               signHereTabs: [{
                 documentId: '1',
                 pageNumber: '1',
                 xPosition: '100',
                 yPosition: '350',
                 tabLabel: 'Signature Vendeur'
               }],
               dateSignedTabs: [{
                 documentId: '1',
                 pageNumber: '1',
                 xPosition: '100',
                 yPosition: '400'
               }]
             }
           }),
           // Notaire
           docusign.Signer.constructFromObject({
             email: contractData.notaireEmail,
             name: contractData.notaireName,
             recipientId: '3',
             routingOrder: '3',
             tabs: {
               signHereTabs: [{
                 documentId: '1',
                 pageNumber: '1',
                 xPosition: '100',
                 yPosition: '550',
                 tabLabel: 'Signature Notaire'
               }],
               dateSignedTabs: [{
                 documentId: '1',
                 pageNumber: '1',
                 xPosition: '100',
                 yPosition: '600'
               }]
             }
           })
         ];
         
         // Créer l'enveloppe
         const envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
           emailSubject: `Contrat de Vente - Propriété ${contractData.propertyTitle}`,
           documents: [document],
           recipients: {
             signers: signers
           },
           status: 'sent' // Envoyer immédiatement
         });
         
         // Envoyer
         const result = await envelopesApi.createEnvelope(ACCOUNT_ID, {
           envelopeDefinition: envelopeDefinition
         });
         
         return {
           success: true,
           envelopeId: result.envelopeId,
           status: result.status,
           uri: result.uri
         };
         
       } catch (error) {
         console.error('❌ Erreur DocuSign:', error);
         return {
           success: false,
           error: error.message
         };
       }
     }
     
     async getEnvelopeStatus(envelopeId) {
       const accessToken = await this.getAccessToken();
       this.apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
       
       const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
       const envelope = await envelopesApi.getEnvelope(ACCOUNT_ID, envelopeId);
       
       return {
         status: envelope.status,
         completedDateTime: envelope.completedDateTime,
         recipients: envelope.recipients
       };
     }
     
     async downloadSignedDocument(envelopeId) {
       const accessToken = await this.getAccessToken();
       this.apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
       
       const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
       const documentPdf = await envelopesApi.getDocument(ACCOUNT_ID, envelopeId, 'combined');
       
       return documentPdf;
     }
   }
   
   export const docuSignService = new DocuSignService();
   ```

3. **Route API Signature** (4h)
   ```javascript
   // backend/routes/signatures.js - CRÉER
   
   import express from 'express';
   import { docuSignService } from '../services/DocuSignService.js';
   import db from '../config/database.js';
   
   const router = express.Router();
   
   // Envoyer contrat pour signature
   router.post('/send-contract', async (req, res) => {
     try {
       const { caseId } = req.body;
       
       // Récupérer infos dossier
       const caseQuery = `
         SELECT 
           pc.*,
           buyer.email as buyer_email,
           buyer.profile->>'firstName' as buyer_name,
           seller.email as seller_email,
           seller.profile->>'firstName' as seller_name,
           notaire.email as notaire_email,
           notaire.profile->>'firstName' as notaire_name,
           prop.title as property_title
         FROM purchase_cases pc
         LEFT JOIN users buyer ON pc.buyer_id = buyer.id
         LEFT JOIN users seller ON pc.seller_id = seller.id
         LEFT JOIN users notaire ON pc.notaire_id = notaire.id
         LEFT JOIN properties prop ON pc.property_id = prop.id
         WHERE pc.id = $1
       `;
       
       const result = await db.query(caseQuery, [caseId]);
       const caseData = result.rows[0];
       
       if (!caseData) {
         return res.status(404).json({ error: 'Dossier non trouvé' });
       }
       
       // Envoyer à DocuSign
       const signatureResult = await docuSignService.sendContractForSignature({
         pdfPath: caseData.contract_url, // Chemin local du PDF
         buyerEmail: caseData.buyer_email,
         buyerName: caseData.buyer_name,
         sellerEmail: caseData.seller_email,
         sellerName: caseData.seller_name,
         notaireEmail: caseData.notaire_email,
         notaireName: caseData.notaire_name,
         propertyTitle: caseData.property_title
       });
       
       if (signatureResult.success) {
         // Sauvegarder envelope ID
         await db.query(
           'UPDATE purchase_cases SET docusign_envelope_id = $1, status = $2 WHERE id = $3',
           [signatureResult.envelopeId, 'awaiting_signatures', caseId]
         );
         
         res.json({
           success: true,
           message: 'Contrat envoyé pour signature',
           envelopeId: signatureResult.envelopeId
         });
       } else {
         res.status(500).json({ error: signatureResult.error });
       }
       
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   // Webhook DocuSign (callback)
   router.post('/docusign-webhook', async (req, res) => {
     try {
       const event = req.body;
       
       console.log('📬 DocuSign Webhook:', event);
       
       if (event.event === 'envelope-completed') {
         const envelopeId = event.data.envelopeId;
         
         // Télécharger document signé
         const signedPdf = await docuSignService.downloadSignedDocument(envelopeId);
         
         // Sauvegarder dans storage
         const fileName = `signed_contracts/${envelopeId}.pdf`;
         // Upload vers Supabase Storage...
         
         // Mettre à jour dossier
         await db.query(
           'UPDATE purchase_cases SET status = $1, signed_contract_url = $2 WHERE docusign_envelope_id = $3',
           ['contract_signed', fileName, envelopeId]
         );
         
         // Notification
         const caseResult = await db.query(
           'SELECT buyer_id, seller_id FROM purchase_cases WHERE docusign_envelope_id = $1',
           [envelopeId]
         );
         
         const { buyer_id, seller_id } = caseResult.rows[0];
         
         // Notifier acheteur et vendeur
         await db.query(
           `INSERT INTO notifications (user_id, type, title, message)
            VALUES 
            ($1, 'contract_signed', 'Contrat signé !', 'Toutes les parties ont signé le contrat.'),
            ($2, 'contract_signed', 'Contrat signé !', 'Toutes les parties ont signé le contrat.')`,
           [buyer_id, seller_id]
         );
       }
       
       res.json({ received: true });
       
     } catch (error) {
       console.error('❌ Erreur webhook:', error);
       res.status(500).json({ error: error.message });
     }
   });
   
   // Vérifier statut signature
   router.get('/status/:envelopeId', async (req, res) => {
     try {
       const { envelopeId } = req.params;
       const status = await docuSignService.getEnvelopeStatus(envelopeId);
       res.json(status);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   export default router;
   ```

4. **Frontend Intégration** (6h)
   ```javascript
   // src/components/contracts/ContractSignatureButton.jsx - CRÉER
   
   import { useState } from 'react';
   import { Button } from '@/components/ui/button';
   import { FileSignature, Loader2 } from 'lucide-react';
   
   export default function ContractSignatureButton({ caseId, contractUrl }) {
     const [sending, setSending] = useState(false);
     const [sent, setSent] = useState(false);
     
     const handleSendForSignature = async () => {
       setSending(true);
       
       try {
         const response = await fetch('/api/signatures/send-contract', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ caseId })
         });
         
         const result = await response.json();
         
         if (result.success) {
           setSent(true);
           toast.success('Contrat envoyé pour signature électronique !');
         } else {
           toast.error('Erreur: ' + result.error);
         }
       } catch (error) {
         toast.error('Erreur: ' + error.message);
       } finally {
         setSending(false);
       }
     };
     
     if (sent) {
       return (
         <div className="p-4 bg-green-50 border border-green-200 rounded">
           <p className="text-green-800 font-medium">
             ✅ Contrat envoyé pour signature !
           </p>
           <p className="text-sm text-green-600 mt-1">
             Tous les signataires ont reçu un email avec le lien de signature.
           </p>
         </div>
       );
     }
     
     return (
       <Button
         onClick={handleSendForSignature}
         disabled={sending || !contractUrl}
         size="lg"
         className="w-full"
       >
         {sending ? (
           <>
             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
             Envoi en cours...
           </>
         ) : (
           <>
             <FileSignature className="w-4 h-4 mr-2" />
             Envoyer pour Signature Électronique
           </>
         )}
       </Button>
     );
   }
   ```

**Livrables Jour 1-3**:
- ✅ Compte DocuSign configuré
- ✅ Backend service DocuSign créé
- ✅ Routes API signature créées
- ✅ Composant frontend intégré
- ✅ Webhook DocuSign configuré

##### 💳 Jour 4-5: Paiements Wave/Orange Money

**Objectif**: Intégrer paiements mobiles sénégalais

**Tâches**:

1. **Compte Wave Money** (2h)
   - Inscription API Wave Money
   - Obtenir credentials
   - Tests en sandbox

2. **Backend Wave Service** (8h)
   ```javascript
   // backend/services/WavePaymentService.js - CRÉER
   
   import axios from 'axios';
   import crypto from 'crypto';
   
   const WAVE_API_KEY = process.env.WAVE_API_KEY;
   const WAVE_API_SECRET = process.env.WAVE_API_SECRET;
   const WAVE_BASE_URL = process.env.WAVE_BASE_URL || 'https://api.wave.com/v1';
   
   class WavePaymentService {
     generateSignature(params) {
       const sortedParams = Object.keys(params)
         .sort()
         .map(key => `${key}=${params[key]}`)
         .join('&');
       
       return crypto
         .createHmac('sha256', WAVE_API_SECRET)
         .update(sortedParams)
         .digest('hex');
     }
     
     async createPayment(paymentData) {
       try {
         const params = {
           amount: paymentData.amount,
           currency: 'XOF', // Franc CFA
           phone: paymentData.phone,
           reference: paymentData.reference,
           description: paymentData.description,
           timestamp: Date.now()
         };
         
         const signature = this.generateSignature(params);
         
         const response = await axios.post(
           `${WAVE_BASE_URL}/payments/create`,
           params,
           {
             headers: {
               'X-API-Key': WAVE_API_KEY,
               'X-Signature': signature,
               'Content-Type': 'application/json'
             }
           }
         );
         
         return {
           success: true,
           paymentId: response.data.payment_id,
           status: response.data.status,
           paymentUrl: response.data.payment_url
         };
         
       } catch (error) {
         console.error('❌ Erreur Wave:', error.response?.data || error.message);
         return {
           success: false,
           error: error.response?.data?.message || error.message
         };
       }
     }
     
     async checkPaymentStatus(paymentId) {
       try {
         const response = await axios.get(
           `${WAVE_BASE_URL}/payments/${paymentId}`,
           {
             headers: {
               'X-API-Key': WAVE_API_KEY
             }
           }
         );
         
         return {
           success: true,
           status: response.data.status,
           amount: response.data.amount,
           paidAt: response.data.paid_at
         };
         
       } catch (error) {
         return {
           success: false,
           error: error.message
         };
       }
     }
   }
   
   export const wavePaymentService = new WavePaymentService();
   ```

3. **Route API Paiements** (6h)
   ```javascript
   // backend/routes/payments.js - CRÉER
   
   import express from 'express';
   import { wavePaymentService } from '../services/WavePaymentService.js';
   import db from '../config/database.js';
   
   const router = express.Router();
   
   // Créer paiement
   router.post('/create', async (req, res) => {
     try {
       const { caseId, amount, type, phone } = req.body;
       
       // Générer référence unique
       const reference = `TF-${type.toUpperCase()}-${caseId}-${Date.now()}`;
       
       // Créer paiement Wave
       const paymentResult = await wavePaymentService.createPayment({
         amount: amount,
         phone: phone,
         reference: reference,
         description: `Paiement ${type} - Dossier ${caseId}`
       });
       
       if (paymentResult.success) {
         // Enregistrer en DB
         await db.query(
           `INSERT INTO payments (
             case_id, amount, type, status, payment_provider, 
             provider_payment_id, reference
           ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
           [
             caseId,
             amount,
             type,
             'pending',
             'wave',
             paymentResult.paymentId,
             reference
           ]
         );
         
         res.json({
           success: true,
           paymentUrl: paymentResult.paymentUrl,
           paymentId: paymentResult.paymentId
         });
       } else {
         res.status(500).json({ error: paymentResult.error });
       }
       
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   // Webhook Wave (callback paiement)
   router.post('/wave-webhook', async (req, res) => {
     try {
       const { payment_id, status } = req.body;
       
       console.log('💳 Wave Webhook:', req.body);
       
       if (status === 'completed') {
         // Mettre à jour paiement
         await db.query(
           'UPDATE payments SET status = $1, paid_at = NOW() WHERE provider_payment_id = $2',
           ['completed', payment_id]
         );
         
         // Récupérer infos dossier
         const paymentResult = await db.query(
           'SELECT case_id, type FROM payments WHERE provider_payment_id = $1',
           [payment_id]
         );
         
         const { case_id, type } = paymentResult.rows[0];
         
         // Mettre à jour statut dossier si nécessaire
         if (type === 'deposit') {
           await db.query(
             'UPDATE purchase_cases SET status = $1 WHERE id = $2',
             ['deposit_paid', case_id]
           );
         } else if (type === 'final') {
           await db.query(
             'UPDATE purchase_cases SET status = $1 WHERE id = $2',
             ['completed', case_id]
           );
         }
         
         // Notification
         const caseData = await db.query(
           'SELECT buyer_id, seller_id FROM purchase_cases WHERE id = $1',
           [case_id]
         );
         
         const { buyer_id, seller_id } = caseData.rows[0];
         
         await db.query(
           `INSERT INTO notifications (user_id, type, title, message)
            VALUES 
            ($1, 'payment_received', 'Paiement reçu !', 'Le paiement a été confirmé.'),
            ($2, 'payment_received', 'Paiement reçu !', 'L\\'acheteur a effectué le paiement.')`,
           [buyer_id, seller_id]
         );
       }
       
       res.json({ received: true });
       
     } catch (error) {
       console.error('❌ Erreur webhook Wave:', error);
       res.status(500).json({ error: error.message });
     }
   });
   
   export default router;
   ```

4. **Frontend Bouton Paiement** (4h)
   ```javascript
   // src/components/payments/WavePaymentButton.jsx - CRÉER
   
   import { useState } from 'react';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   import { DollarSign, Loader2 } from 'lucide-react';
   import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
   
   export default function WavePaymentButton({ caseId, amount, type, onSuccess }) {
     const [showModal, setShowModal] = useState(false);
     const [phone, setPhone] = useState('');
     const [loading, setLoading] = useState(false);
     
     const handlePayment = async () => {
       if (!phone.match(/^(77|78|76|70)\d{7}$/)) {
         toast.error('Numéro de téléphone invalide (format: 77XXXXXXX)');
         return;
       }
       
       setLoading(true);
       
       try {
         const response = await fetch('/api/payments/create', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             caseId,
             amount,
             type,
             phone
           })
         });
         
         const result = await response.json();
         
         if (result.success) {
           // Ouvrir page paiement Wave
           window.open(result.paymentUrl, '_blank');
           
           toast.success('Fenêtre de paiement ouverte ! Suivez les instructions.');
           setShowModal(false);
           
           // Polling pour vérifier paiement
           pollPaymentStatus(result.paymentId);
         } else {
           toast.error('Erreur: ' + result.error);
         }
       } catch (error) {
         toast.error('Erreur: ' + error.message);
       } finally {
         setLoading(false);
       }
     };
     
     const pollPaymentStatus = (paymentId) => {
       const interval = setInterval(async () => {
         const response = await fetch(`/api/payments/status/${paymentId}`);
         const result = await response.json();
         
         if (result.status === 'completed') {
           clearInterval(interval);
           toast.success('Paiement confirmé ! ✅');
           if (onSuccess) onSuccess();
         } else if (result.status === 'failed') {
           clearInterval(interval);
           toast.error('Paiement échoué ❌');
         }
       }, 3000); // Check toutes les 3 secondes
       
       // Arrêter après 5 minutes
       setTimeout(() => clearInterval(interval), 300000);
     };
     
     return (
       <>
         <Button onClick={() => setShowModal(true)} size="lg" className="w-full">
           <DollarSign className="w-4 h-4 mr-2" />
           Payer {amount.toLocaleString()} FCFA via Wave
         </Button>
         
         <Dialog open={showModal} onOpenChange={setShowModal}>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>Paiement Wave Money</DialogTitle>
             </DialogHeader>
             
             <div className="space-y-4">
               <div>
                 <label className="block mb-2 font-medium">Montant</label>
                 <p className="text-2xl font-bold text-green-600">
                   {amount.toLocaleString()} FCFA
                 </p>
               </div>
               
               <div>
                 <label className="block mb-2 font-medium">Numéro Wave</label>
                 <Input
                   type="tel"
                   placeholder="77 123 45 67"
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   maxLength={9}
                 />
                 <p className="text-xs text-gray-500 mt-1">
                   Format: 77XXXXXXX (sans espaces)
                 </p>
               </div>
               
               <Button
                 onClick={handlePayment}
                 disabled={loading || !phone}
                 className="w-full"
               >
                 {loading ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Traitement...
                   </>
                 ) : (
                   'Continuer vers Wave'
                 )}
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </>
     );
   }
   ```

**Livrables Jour 4-5**:
- ✅ Compte Wave Money configuré
- ✅ Backend service Wave créé
- ✅ Routes API paiements créées
- ✅ Composant frontend paiement créé
- ✅ Webhook Wave configuré

---

#### SEMAINE 3-4 (18 Nov - 29 Nov 2025)

**Jours 1-10: Auto-transitions Statuts + Tests MVP**

(Détails complets dans rapport - continuer lecture pour roadmap complète)

---

## 🤖 PHASE 2 - IA INTEGRATION (Semaines 5-6)

*(Suite détaillée dans le fichier complet)*

---

## ⛓️ PHASE 3 - BLOCKCHAIN TOKENIZATION (Semaines 7-9)

*(Suite détaillée dans le fichier complet)*

---

## 🎯 PHASE 4 - AUTONOMIE 100% (Semaines 10-11)

*(Suite détaillée dans le fichier complet)*

---

## 📊 MÉTRIQUES DE SUIVI

### KPIs Hebdomadaires

| Métrique | Objectif | Suivi |
|----------|----------|-------|
| **Lignes code ajoutées** | 2000/semaine | ☐ |
| **Tests unitaires** | 80% coverage | ☐ |
| **Bugs critiques** | 0 | ☐ |
| **Performance API** | <200ms | ☐ |
| **Uptime** | >99% | ☐ |

### Checkpoints

- ✅ **Checkpoint 1** (Fin Semaine 2): Email + Validation Pro + Signature OK
- ⏳ **Checkpoint 2** (Fin Semaine 4): MVP Production Complet
- ⏳ **Checkpoint 3** (Fin Semaine 6): IA Intégrée
- ⏳ **Checkpoint 4** (Fin Semaine 9): Blockchain Active
- ⏳ **Checkpoint 5** (Fin Semaine 11): Application 100% Autonome

---

## 🚀 LANCEMENT PRODUCTION

### Checklist Finale

- [ ] Tous les tests E2E passés
- [ ] Documentation API complète
- [ ] Monitoring Sentry actif
- [ ] Backup automatique configuré
- [ ] SSL/TLS configuré
- [ ] Rate limiting actif
- [ ] Logs audit complets
- [ ] Support client prêt

---

**ROADMAP CRÉÉE LE**: 3 Novembre 2025  
**PROCHAINE ÉTAPE**: Commencer Semaine 1 - Email Verification  
**OBJECTIF FINAL**: 20 Janvier 2026 - Application 100% Autonome
