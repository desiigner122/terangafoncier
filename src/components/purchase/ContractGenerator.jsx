/**
 * Composant de génération de contrat
 * Génère des contrats de vente, compromis, mandats
 */
import React, { useState } from 'react';
import { FileText, Download, Eye, Send, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { jsPDF } from 'jspdf';

const CONTRACT_TYPES = [
  {
    value: 'sale_agreement',
    label: 'Contrat de vente',
    description: 'Contrat définitif de vente immobilière',
    template: 'sale_contract_template',
  },
  {
    value: 'purchase_agreement',
    label: 'Compromis de vente',
    description: 'Avant-contrat avec conditions suspensives',
    template: 'compromis_template',
  },
  {
    value: 'mandate',
    label: 'Mandat de vente',
    description: 'Mandat donné à un agent immobilier',
    template: 'mandate_template',
  },
  {
    value: 'reservation',
    label: 'Contrat de réservation',
    description: 'Réservation avec versement d\'acompte',
    template: 'reservation_template',
  },
];

export const ContractGenerator = ({ purchaseRequest, buyer, seller, property, onContractGenerated }) => {
  const { user: currentUserCtx } = useAuth?.() || { user: null };
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [selectedType, setSelectedType] = useState('sale_agreement');
  const [formData, setFormData] = useState({
    sale_price: property?.price || 0,
    deposit_amount: 0,
    signing_date: format(new Date(), 'yyyy-MM-dd'),
    completion_date: '',
    payment_terms: '',
    special_conditions: '',
    suspensive_conditions: '',
  });

  const isReady = Boolean(purchaseRequest?.id && buyer?.id && seller?.id);

  React.useEffect(() => {
    if (open && purchaseRequest?.id) {
      loadContracts();
    }
  }, [open, purchaseRequest]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents_administratifs')
        .select('*')
        .eq('purchase_request_id', purchaseRequest.id)
        .in('document_type', ['sale_contract', 'purchase_agreement', 'power_of_attorney'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Erreur chargement contrats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateContract = async () => {
    setGenerating(true);

    try {
      if (!isReady) {
        toast.error("Informations incomplètes pour générer le contrat");
        return;
      }
      const contractType = CONTRACT_TYPES.find(t => t.value === selectedType);
      
      // Générer le contenu du contrat
      const contractContent = generateContractContent(contractType);
      
      // Récupérer l'utilisateur courant pour respecter la RLS (uploaded_by = auth.uid())
      let uploaderId = currentUserCtx?.id;
      try {
        if (!uploaderId) {
          const { data: authData } = await supabase.auth.getUser();
          uploaderId = authData?.user?.id || buyer.id;
        }
      } catch (_) {
        uploaderId = buyer.id;
      }

      // Générer un PDF simple (placeholder) et uploader dans le bucket Supabase Storage 'contracts'
      const pdf = new jsPDF();
      pdf.setFontSize(14);
      pdf.text(contractType.label, 20, 20);
      pdf.setFontSize(11);
      pdf.text(`Dossier: ${purchaseRequest.id}`, 20, 30);
      pdf.text(`Acheteur: ${contractContent.parties.buyer.name}`, 20, 38);
      pdf.text(`Vendeur: ${contractContent.parties.seller.name}`, 20, 46);
      pdf.text(`Bien: ${contractContent.property.title || ''}`, 20, 54);
      pdf.text(`Prix de vente: ${formData.sale_price} FCFA`, 20, 62);
      pdf.text(`Date de signature: ${formData.signing_date}`, 20, 70);
      const pdfBlob = pdf.output('blob');

      const storagePath = `contracts/${purchaseRequest.id}/${Date.now()}.pdf`;
      let publicUrl = null;
      try {
        const { error: uploadErr } = await supabase
          .storage
          .from('contracts')
          .upload(storagePath, pdfBlob, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'application/pdf'
          });
        if (uploadErr) throw uploadErr;
        const { data: pub } = supabase.storage.from('contracts').getPublicUrl(storagePath);
        publicUrl = pub?.publicUrl || null;
      } catch (e) {
        console.warn('Upload Storage échoué (bucket manquant ?):', e?.message || e);
      }

      // Créer le document dans la base
      const documentData = {
        user_id: buyer.id,
        purchase_request_id: purchaseRequest.id,
        property_id: property?.id,
        file_name: `${contractType.label}_${format(new Date(), 'yyyy-MM-dd')}.pdf`,
        title: contractType.label,
        description: `${contractType.description} généré automatiquement`,
        document_type: selectedType === 'sale_agreement' ? 'sale_contract' : 'purchase_agreement',
        file_format: 'pdf',
        storage_path: storagePath,
        status: 'pending',
        uploaded_by: uploaderId,
        workflow_stage: 'generation',
        metadata: {
          contract_type: selectedType,
          generated_at: new Date().toISOString(),
          sale_price: formData.sale_price,
          deposit_amount: formData.deposit_amount,
          signing_date: formData.signing_date,
          completion_date: formData.completion_date,
          file_url: publicUrl,
          buyer_info: {
            id: buyer.id,
            name: `${buyer?.first_name || buyer?.full_name || ''} ${buyer?.last_name || ''}`.trim() || 'Acheteur',
            email: buyer?.email || '',
          },
          seller_info: {
            id: seller.id,
            name: `${seller?.first_name || seller?.full_name || ''} ${seller?.last_name || ''}`.trim() || 'Vendeur',
            email: seller?.email || '',
          },
          property_info: {
            id: property?.id,
            title: property?.title || property?.name,
            location: property?.location,
            surface: property?.surface,
          },
        },
      };

      const { data, error } = await supabase
        .from('documents_administratifs')
        .insert([documentData])
        .select()
        .single();

      if (error) throw error;

      // Enregistrer également dans les documents "publics" du dossier pour affichage dans l'onglet Documents
      try {
        const publicDoc = {
          case_id: purchaseRequest.id,
          uploaded_by: uploaderId,
          file_name: documentData.file_name,
          document_type: 'contract',
          status: 'pending',
          file_url: publicUrl, // URL publique si upload réussi
          mime_type: 'application/pdf',
          created_at: new Date().toISOString(),
          metadata: {
            source: 'contract_generator',
            admin_document_id: data?.id || null,
            contract_type: selectedType,
          }
        };
        await supabase.from('purchase_case_documents').insert([publicDoc]);
      } catch (e) {
        // Non bloquant si la RLS empêche l'insertion ici; l'admin doc existe déjà
        console.warn('Insertion document public échouée (non bloquant):', e);
      }

      toast.success('Contrat généré avec succès');
      loadContracts();
      if (onContractGenerated) onContractGenerated(data);
      
      // TODO: Générer le PDF réel (intégration avec service de génération PDF)
      
    } catch (error) {
      console.error('Erreur génération contrat:', error);
      toast.error('Erreur lors de la génération du contrat');
    } finally {
      setGenerating(false);
    }
  };

  const generateContractContent = (contractType) => {
    // Template de base du contrat
    return {
      type: contractType.value,
      title: contractType.label,
      parties: {
        buyer: {
          name: `${buyer?.first_name || buyer?.full_name || ''} ${buyer?.last_name || ''}`.trim() || 'Acheteur',
          email: buyer?.email || '',
          address: buyer?.address || '',
        },
        seller: {
          name: `${seller?.first_name || seller?.full_name || ''} ${seller?.last_name || ''}`.trim() || 'Vendeur',
          email: seller?.email || '',
          address: seller?.address || '',
        },
      },
      property: {
        title: property?.title || property?.name,
        location: property?.location,
        surface: property?.surface,
        description: property?.description,
      },
      financial: {
        sale_price: formData.sale_price,
        deposit_amount: formData.deposit_amount,
        payment_terms: formData.payment_terms,
      },
      dates: {
        signing_date: formData.signing_date,
        completion_date: formData.completion_date,
      },
      conditions: {
        special: formData.special_conditions,
        suspensive: formData.suspensive_conditions,
      },
      generated_at: new Date().toISOString(),
    };
  };

  const downloadContract = async (contract) => {
    toast.info('Téléchargement du contrat...');
    // TODO: Implémenter le téléchargement réel
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      under_review: { label: 'En révision', className: 'bg-blue-100 text-blue-800' },
      approved: { label: 'Approuvé', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejeté', className: 'bg-red-100 text-red-800' },
    };
    return badges[status] || badges.pending;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Générer un contrat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Génération de contrat</DialogTitle>
          <DialogDescription>
            Générez automatiquement des contrats de vente pour ce dossier
          </DialogDescription>
        </DialogHeader>

        {/* Liste des contrats existants */}
        {contracts.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-sm">Contrats générés</h3>
            {contracts.map((contract) => {
              const badge = getStatusBadge(contract.status);
              return (
                <Card key={contract.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{contract.title}</h4>
                          <Badge className={badge.className}>
                            {badge.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{contract.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Créé le {format(new Date(contract.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => downloadContract(contract)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Formulaire de génération */}
        <div className="space-y-4">
          <div>
            <Label>Type de contrat</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sale_price">Prix de vente (FCFA)</Label>
              <Input
                id="sale_price"
                type="number"
                value={Number.isFinite(formData.sale_price) ? formData.sale_price : 0}
                onChange={(e) => setFormData({ ...formData, sale_price: Number(e.target.value || 0) })}
              />
            </div>

            <div>
              <Label htmlFor="deposit_amount">Montant de l'acompte (FCFA)</Label>
              <Input
                id="deposit_amount"
                type="number"
                value={Number.isFinite(formData.deposit_amount) ? formData.deposit_amount : 0}
                onChange={(e) => setFormData({ ...formData, deposit_amount: Number(e.target.value || 0) })}
              />
            </div>

            <div>
              <Label htmlFor="signing_date">Date de signature</Label>
              <Input
                id="signing_date"
                type="date"
                value={formData.signing_date}
                onChange={(e) => setFormData({ ...formData, signing_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="completion_date">Date de réalisation</Label>
              <Input
                id="completion_date"
                type="date"
                value={formData.completion_date}
                onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="payment_terms">Modalités de paiement</Label>
            <Textarea
              id="payment_terms"
              value={formData.payment_terms}
              onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
              placeholder="Ex: Paiement en 3 fois, 30% à la signature..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="special_conditions">Conditions particulières</Label>
            <Textarea
              id="special_conditions"
              value={formData.special_conditions}
              onChange={(e) => setFormData({ ...formData, special_conditions: e.target.value })}
              placeholder="Conditions spécifiques à ce contrat..."
              rows={3}
            />
          </div>

          {selectedType === 'purchase_agreement' && (
            <div>
              <Label htmlFor="suspensive_conditions">Conditions suspensives</Label>
              <Textarea
                id="suspensive_conditions"
                value={formData.suspensive_conditions}
                onChange={(e) => setFormData({ ...formData, suspensive_conditions: e.target.value })}
                placeholder="Ex: Obtention du prêt bancaire, certificat d'urbanisme..."
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={generateContract} disabled={generating || !isReady}>
              {generating ? 'Génération...' : 'Générer le contrat'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractGenerator;
