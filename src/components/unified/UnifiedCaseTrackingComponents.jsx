/**
 * UnifiedCaseTrackingComponents.jsx
 * 
 * Composants auxiliaires pour UnifiedCaseTracking
 */

import React, { useEffect, useRef, useState } from 'react';
import { 
  Upload, Download, FileText, CheckCircle, Clock,
  CreditCard, Building2, Ruler, Star, Send, AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

/**
 * Actions spécifiques selon le rôle de l'utilisateur
 */
export const RoleSpecificActions = ({ 
  userRole, 
  permissions, 
  purchaseCase,
  hasAgent,
  hasSurveying,
  surveyingMission,
  onChooseAgent,
  onRequestSurveying
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos actions</CardTitle>
        <CardDescription>
          Actions disponibles selon votre rôle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {userRole === 'buyer' && (
            <BuyerActions 
              permissions={permissions}
              hasAgent={hasAgent}
              hasSurveying={hasSurveying}
              onChooseAgent={onChooseAgent}
              onRequestSurveying={onRequestSurveying}
            />
          )}

          {userRole === 'seller' && (
            <SellerActions 
              permissions={permissions}
              hasSurveying={hasSurveying}
            />
          )}

          {userRole === 'notaire' && (
            <NotaireActions permissions={permissions} />
          )}

          {userRole === 'agent' && hasAgent && (
            <AgentActions />
          )}

          {userRole === 'geometre' && hasSurveying && (
            <GeometreActions 
              surveyingMission={surveyingMission}
              permissions={permissions}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Actions ACHETEUR
 */
const BuyerActions = ({ permissions, hasAgent, hasSurveying, onChooseAgent, onRequestSurveying }) => {
  return (
    <>
      {/* Choix facultatifs */}
      {!hasAgent && (
        <>
          <Button onClick={onChooseAgent} variant="outline" className="w-full justify-start">
            <Building2 className="w-4 h-4 mr-2" />
            Choisir un agent foncier (Facultatif)
          </Button>
          <p className="text-xs text-muted-foreground px-2">
            Un agent peut vous aider dans les négociations et démarches
          </p>
        </>
      )}

      {!hasSurveying && (
        <>
          <Separator className="my-2" />
          <Button onClick={onRequestSurveying} variant="outline" className="w-full justify-start">
            <Ruler className="w-4 h-4 mr-2" />
            Commander un bornage (Facultatif)
          </Button>
          <p className="text-xs text-muted-foreground px-2">
            Vérifier les limites exactes de la parcelle
          </p>
        </>
      )}

      <Separator className="my-3" />

      {/* Actions principales */}
      <Button className="w-full justify-start">
        <Upload className="w-4 h-4 mr-2" />
        Uploader mes pièces d'identité
      </Button>

      <Button className="w-full justify-start">
        <FileText className="w-4 h-4 mr-2" />
        Consulter projet de contrat
      </Button>

      {permissions?.canConfirmPayment && (
        <Button className="w-full justify-start">
          <CreditCard className="w-4 h-4 mr-2" />
          Payer acompte (10-20%)
        </Button>
      )}

      <Button className="w-full justify-start">
        <CheckCircle className="w-4 h-4 mr-2" />
        Confirmer RDV signature
      </Button>
    </>
  );
};

/**
 * Actions VENDEUR
 */
const SellerActions = ({ permissions, hasSurveying }) => {
  return (
    <>
      <Button className="w-full justify-start">
        <Upload className="w-4 h-4 mr-2" />
        Uploader titre foncier
      </Button>

      {hasSurveying && (
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg mb-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Bornage demandé par l'acheteur
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Un géomètre va vérifier les limites de la parcelle
              </p>
            </div>
          </div>
        </div>
      )}

      {permissions?.canValidateContract && (
        <Button className="w-full justify-start">
          <CheckCircle className="w-4 h-4 mr-2" />
          Valider contrat proposé
        </Button>
      )}

      <Button className="w-full justify-start">
        <CheckCircle className="w-4 h-4 mr-2" />
        Confirmer RDV signature
      </Button>
    </>
  );
};

/**
 * Actions NOTAIRE
 */
const NotaireActions = ({ permissions }) => {
  return (
    <>
      {permissions?.canVerifyDocuments && (
        <Button className="w-full justify-start">
          <CheckCircle className="w-4 h-4 mr-2" />
          Vérifier identités
        </Button>
      )}

      <Button className="w-full justify-start">
        <FileText className="w-4 h-4 mr-2" />
        Contrôler titre foncier au cadastre
      </Button>

      {permissions?.canGenerateContract && (
        <Button className="w-full justify-start">
          <FileText className="w-4 h-4 mr-2" />
          Générer acte de vente
        </Button>
      )}

      {permissions?.canScheduleAppointment && (
        <Button className="w-full justify-start">
          <Clock className="w-4 h-4 mr-2" />
          Proposer dates RDV
        </Button>
      )}

      <Button className="w-full justify-start">
        <CheckCircle className="w-4 h-4 mr-2" />
        Confirmer réception honoraires
      </Button>

      <Button className="w-full justify-start">
        <FileText className="w-4 h-4 mr-2" />
        Enregistrer acte aux impôts
      </Button>
    </>
  );
};

/**
 * Actions AGENT FONCIER
 */
const AgentActions = () => {
  return (
    <>
      <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg mb-3">
        <div className="flex items-start gap-2">
          <Building2 className="w-4 h-4 text-green-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Vous avez été choisi par l'acheteur
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Facilitez la transaction et accompagnez les parties
            </p>
          </div>
        </div>
      </div>

      <Button className="w-full justify-start">
        <Send className="w-4 h-4 mr-2" />
        Faciliter négociation
      </Button>

      <Button className="w-full justify-start">
        <FileText className="w-4 h-4 mr-2" />
        Collecter documents manquants
      </Button>

      <Button className="w-full justify-start">
        <CreditCard className="w-4 h-4 mr-2" />
        Suivre commission (5%)
      </Button>

      <Button className="w-full justify-start">
        <CheckCircle className="w-4 h-4 mr-2" />
        Confirmer paiement commission
      </Button>
    </>
  );
};

/**
 * Actions GÉOMÈTRE
 */
const GeometreActions = ({ surveyingMission, permissions }) => {
  if (!surveyingMission) return null;

  const canAccept = surveyingMission.status === 'pending';
  const canUploadResults = surveyingMission.status === 'accepted' || surveyingMission.status === 'in_progress';

  return (
    <>
      <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg mb-3">
        <div className="flex items-start gap-2">
          <Ruler className="w-4 h-4 text-purple-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Mission de bornage
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              L'acheteur a demandé une vérification du bornage
            </p>
            <Badge variant="outline" className="mt-2">
              {surveyingMission.status}
            </Badge>
          </div>
        </div>
      </div>

      {canAccept && (
        <>
          <Button className="w-full justify-start">
            <CheckCircle className="w-4 h-4 mr-2" />
            Accepter mission
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Décliner mission
          </Button>
          <Separator className="my-2" />
        </>
      )}

      <Button className="w-full justify-start">
        <Clock className="w-4 h-4 mr-2" />
        Planifier visite terrain
      </Button>

      {canUploadResults && (
        <>
          <Button className="w-full justify-start">
            <Upload className="w-4 h-4 mr-2" />
            Uploader plan de bornage
          </Button>

          <Button className="w-full justify-start">
            <Upload className="w-4 h-4 mr-2" />
            Uploader certificat topographique
          </Button>

          <Button className="w-full justify-start">
            <Ruler className="w-4 h-4 mr-2" />
            Saisir coordonnées GPS
          </Button>
        </>
      )}

      <Button className="w-full justify-start">
        <CreditCard className="w-4 h-4 mr-2" />
        Générer facture
      </Button>

      {surveyingMission.status === 'in_progress' && (
        <Button className="w-full justify-start">
          <CheckCircle className="w-4 h-4 mr-2" />
          Clôturer mission
        </Button>
      )}
    </>
  );
};

/**
 * Section Documents
 */
export const DocumentsSection = ({ caseData, userRole, permissions }) => {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('general');
  const fileInputRef = useRef(null);

  const caseId = caseData?.id;

  // Helper: extract storage key (path inside bucket) from a Supabase Storage URL
  const extractStorageKey = (urlOrKey) => {
    if (!urlOrKey) return null;
    // If it looks like a key already (no protocol), return as is
    if (!/^https?:\/\//i.test(urlOrKey)) return urlOrKey.replace(/^\/+/, '');
    try {
      // Matches .../documents/<key>[?query]
      const match = urlOrKey.match(/\/documents\/(.+?)(?:\?|$)/);
      if (match && match[1]) return match[1];
    } catch (_) {}
    return null;
  };

  // Helper: get a filename from a storage key when DB name missing
  const fileNameFromKey = (key) => {
    if (!key) return 'document';
    const parts = key.split('/');
    return parts[parts.length - 1] || 'document';
  };

  useEffect(() => {
    const load = async () => {
      if (!caseId) return;
      try {
        const { data, error } = await supabase
          .from('purchase_case_documents')
          .select('*')
          .eq('case_id', caseId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setDocs(data || []);
      } catch (e) {
        console.error('Error loading documents:', e);
      }
    };
    load();
    // subscribe to realtime inserts if possible
    if (!caseId) return;
    const channel = supabase
      .channel(`case-docs-${caseId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'purchase_case_documents', filter: `case_id=eq.${caseId}` }, () => {
        // reload
        (async () => {
          const { data } = await supabase
            .from('purchase_case_documents')
            .select('*')
            .eq('case_id', caseId)
            .order('created_at', { ascending: false });
          setDocs(data || []);
        })();
      })
      .subscribe();
    return () => {
      try { supabase.removeChannel(channel); } catch {}
    };
  }, [caseId]);

  const canUpload = !!(permissions?.canUploadDocument && user && caseId);

  const handleUploadClick = () => fileInputRef.current?.click();

  const sanitizeKey = (s) => s.replace(/[^A-Za-z0-9._\-/]/g, '_');

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user || !caseId) return;

    try {
      setUploading(true);
  const fileName = sanitizeKey(`${Date.now()}_${file.name}`);
  const storagePath = sanitizeKey(`${caseId}/${user.id}/${fileName}`);

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file, { upsert: true, contentType: file.type || undefined });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(storagePath);

      // Append download parameter to force download instead of preview
      const downloadUrl = `${publicUrl}?download`;

      // Insert into DB with the download URL
      const attempts = [
        // Schema: document_name, document_url
        {
          case_id: caseId,
          document_type: docType,
          document_name: file.name,
          document_url: downloadUrl,
          uploaded_by: user.id,
          file_size: file.size,
        },
        // Schema: file_name, file_url
        {
          case_id: caseId,
          document_type: docType,
          file_name: file.name,
          file_url: downloadUrl,
          uploaded_by: user.id,
          file_size: file.size,
        },
        // Fallback: basic columns only
        {
          case_id: caseId,
          document_url: downloadUrl,
        }
      ];

      let inserted = false;
      let lastErr = null;
      for (const payload of attempts) {
        const { error } = await supabase.from('purchase_case_documents').insert(payload);
        if (!error) { inserted = true; break; }
        lastErr = error;
      }
      if (!inserted) {
        const errMsg = String(lastErr?.message || lastErr);
        if (errMsg.includes('PGRST204')) {
          throw new Error('Schema mismatch: purchase_case_documents table may need to be created. See sql/CREATE_PURCHASE_CASE_DOCUMENTS.sql');
        }
        throw lastErr || new Error('Insert failed');
      }

      toast.success('Document uploadé');
      // reload list
      const { data } = await supabase
        .from('purchase_case_documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });
      setDocs(data || []);
    } catch (err) {
      console.error('Upload error:', err);
      const msg = String(err?.message || err);
      if (msg.toLowerCase().includes('row-level security')) {
        toast.error("Upload bloqué par la policy RLS du bucket 'documents'. Voir le fichier sql/FIX_STORAGE_RLS_DOCUMENTS.sql pour l'activer.");
      } else {
        toast.error("Échec de l'upload du document");
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Robust download: fetch blob from Storage API to force browser download
  const handleDownload = async (doc) => {
    try {
      const url = doc.document_url || doc.file_url || doc.url;
      const storageKey = doc.storage_key || extractStorageKey(url);
      if (!storageKey) {
        // Fallback: open the URL in new tab if we can't derive the key
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      const { data, error } = await supabase.storage
        .from('documents')
        .download(storageKey);
      if (error || !data) throw error || new Error('Empty file');

      const blobUrl = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = doc.document_name || doc.file_name || fileNameFromKey(storageKey);
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoke after a tick to allow download to start
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Téléchargement impossible pour ce fichier');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents du dossier</CardTitle>
        <CardDescription>
          Tous les documents liés à cette transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Label className="text-sm">Type</Label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="general">Général</option>
            <option value="buyer_id">Pièce identité acheteur</option>
            <option value="seller_title">Titre foncier</option>
            <option value="notary_contract">Contrat</option>
            <option value="survey_plan">Plan de bornage</option>
          </select>
          {canUpload && (
            <Button size="sm" onClick={handleUploadClick} disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Upload...' : 'Uploader'}
            </Button>
          )}
          <Input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
        </div>

        <div className="space-y-2">
          {docs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun document pour le moment</p>
          ) : (
            docs.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{d.document_name || d.file_name || d.name || 'Document'}</p>
                    <p className="text-xs text-muted-foreground">{d.document_type || 'général'} • {d.file_size ? `${Math.round(d.file_size/1024)} Ko` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {d.status || 'uploaded'}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => handleDownload(d)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Item document
 */
const DocumentItem = ({ name, status, canUpload }) => {
  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-500', icon: Clock },
    uploaded: { label: 'Uploadé', color: 'bg-green-500', icon: CheckCircle },
    verified: { label: 'Vérifié', color: 'bg-blue-500', icon: CheckCircle }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">{name}</p>
          <Badge variant="outline" className={`${config.color} text-white text-xs mt-1`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        {status !== 'pending' && (
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4" />
          </Button>
        )}
        {canUpload && status === 'pending' && (
          <Button size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Section Paiements
 */
export const PaymentsSection = ({ 
  purchaseCase, 
  userRole, 
  hasAgent, 
  hasSurveying,
  surveyingMission 
}) => {
  const price = purchaseCase.final_price || purchaseCase.parcelle?.price || 0;
  const acompte = price * 0.15; // 15%
  const solde = price - acompte;

  return (
    <div className="space-y-4">
      {/* Paiement 1: Acompte */}
      <PaymentCard 
        title="Acompte (15%)"
        amount={acompte}
        from="Acheteur"
        to="Vendeur"
        status={purchaseCase.deposit_paid ? 'paid' : 'pending'}
        canPay={userRole === 'buyer'}
      />

      {/* Paiement 2: Frais notaire */}
      <PaymentCard 
        title="Frais de notaire"
        amount={purchaseCase.notaire_fees || 0}
        from="Acheteur"
        to="Notaire"
        status={purchaseCase.notaire_fees_paid ? 'paid' : 'pending'}
        canPay={userRole === 'buyer'}
      />

      {/* Paiement 3: Commission agent (si applicable) */}
      {hasAgent && (
        <PaymentCard 
          title="Commission agent foncier (5%)"
          amount={purchaseCase.agent_commission || 0}
          from="Acheteur"
          to="Agent Foncier"
          status={purchaseCase.agent_commission_paid ? 'paid' : 'pending'}
          canPay={userRole === 'buyer'}
          isFacultative
        />
      )}

      {/* Paiement 4: Frais géomètre (si applicable) */}
      {hasSurveying && surveyingMission && (
        <PaymentCard 
          title="Frais géomètre"
          amount={surveyingMission.quoted_fee || 0}
          from="Acheteur"
          to="Géomètre"
          status={surveyingMission.paid ? 'paid' : 'pending'}
          canPay={userRole === 'buyer'}
          isFacultative
        />
      )}

      {/* Paiement 5: Solde */}
      <PaymentCard 
        title="Solde"
        amount={solde}
        from="Acheteur"
        to="Vendeur"
        status={purchaseCase.final_payment_paid ? 'paid' : 'pending'}
        canPay={userRole === 'buyer'}
      />
    </div>
  );
};

/**
 * Carte paiement
 */
const PaymentCard = ({ title, amount, from, to, status, canPay, isFacultative }) => {
  const isPaid = status === 'paid';

  return (
    <Card className={isFacultative ? 'border-dashed' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{title}</h4>
              {isFacultative && (
                <Badge variant="secondary" className="text-xs">Facultatif</Badge>
              )}
            </div>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR').format(amount)} FCFA
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {from} → {to}
            </p>
          </div>
          <div className="text-right">
            {isPaid ? (
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="w-4 h-4 mr-1" />
                Payé
              </Badge>
            ) : (
              <>
                <Badge variant="outline" className="mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  En attente
                </Badge>
                {canPay && (
                  <Button size="sm" className="w-full">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Payer
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Bulle de message
 */
export const MessageBubble = ({ message, currentUserId }) => {
  const isOwn = message.sender_id === currentUserId;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {/* Avatar composant ici */}
        </div>

        {/* Message content */}
        <div className={`${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{message.sender_name}</span>
            <Badge variant="outline" className="text-xs">{message.sender_role}</Badge>
          </div>
          <p className="text-sm">{message.content}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(message.created_at).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
