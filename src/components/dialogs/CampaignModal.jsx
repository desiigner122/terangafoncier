import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabaseClient';
import {
  Mail,
  MessageSquare,
  Send,
  Users,
  Calendar,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  Sparkles
} from 'lucide-react';

/**
 * CampaignModal - Modal pour créer et gérer des campagnes marketing
 * Supporte Email, SMS et WhatsApp
 * 
 * @param {boolean} open - État d'ouverture du modal
 * @param {function} onOpenChange - Callback pour changer l'état
 * @param {array} prospects - Liste des prospects disponibles
 * @param {function} onCampaignCreated - Callback après création campagne
 */
const CampaignModal = ({ 
  open, 
  onOpenChange, 
  prospects = [],
  onCampaignCreated 
}) => {
  const [activeTab, setActiveTab] = useState('compose');
  const [creating, setCreating] = useState(false);
  const [campaign, setCampaign] = useState({
    name: '',
    type: 'email',
    subject: '',
    message: '',
    targetFilter: 'all',
    scheduledAt: null
  });

  const [previewMode, setPreviewMode] = useState(false);

  // Templates de messages
  const templates = {
    email: {
      nouvelle_propriete: {
        subject: 'Nouvelle propriété disponible à {{location}}',
        message: `Bonjour {{nom}},

J'ai le plaisir de vous informer qu'une nouvelle propriété correspondant à vos critères est disponible :

🏠 {{titre}}
📍 {{location}}
💰 {{prix}} XOF
📐 {{surface}}

Cette propriété pourrait vous intéresser. Je reste à votre disposition pour organiser une visite.

Cordialement,
{{vendeur}}`
      },
      baisse_prix: {
        subject: 'Baisse de prix sur {{titre}}',
        message: `Bonjour {{nom}},

Excellente nouvelle ! Le prix de la propriété suivante vient d'être réduit :

🏠 {{titre}}
📍 {{location}}
💰 Ancien prix : {{ancien_prix}} XOF
✨ Nouveau prix : {{prix}} XOF
📉 Économie : {{economie}} XOF

C'est le moment idéal pour investir !

Cordialement,
{{vendeur}}`
      },
      invitation_visite: {
        subject: 'Journée portes ouvertes - {{titre}}',
        message: `Bonjour {{nom}},

Nous organisons une journée portes ouvertes pour visiter :

🏠 {{titre}}
📍 {{location}}
📅 Date : {{date}}
🕐 Horaire : {{horaire}}

Venez découvrir cette propriété exceptionnelle !

Confirmation souhaitée au {{telephone}}.

Cordialement,
{{vendeur}}`
      }
    },
    sms: {
      nouvelle_propriete: {
        message: `🏠 Nouvelle propriété à {{location}} : {{titre}} - {{prix}} XOF. Visite possible. Contactez-nous !`
      },
      rappel_rdv: {
        message: `📅 Rappel : RDV demain à {{heure}} pour visiter {{titre}}. À bientôt !`
      },
      baisse_prix: {
        message: `💰 Baisse de prix ! {{titre}} à {{location}} : {{prix}} XOF (au lieu de {{ancien_prix}}). Intéressé ?`
      }
    },
    whatsapp: {
      nouvelle_propriete: {
        message: `Bonjour {{nom}} ! 👋

🏠 Nouvelle propriété disponible :
*{{titre}}*
📍 {{location}}
💰 {{prix}} XOF
📐 {{surface}}

Photos et détails disponibles. Intéressé pour une visite ?`
      },
      suivi: {
        message: `Bonjour {{nom}} ! 👋

Suite à votre intérêt pour *{{titre}}*, je me permets de revenir vers vous.

Avez-vous des questions ? Je reste disponible.

À bientôt ! 😊`
      }
    }
  };

  const handleTemplateSelect = (templateKey) => {
    const template = templates[campaign.type][templateKey];
    if (template) {
      setCampaign({
        ...campaign,
        subject: template.subject || campaign.subject,
        message: template.message
      });
    }
  };

  const handleCreateCampaign = async () => {
    if (!campaign.name || !campaign.message) {
      window.safeGlobalToast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    if (campaign.type === 'email' && !campaign.subject) {
      window.safeGlobalToast({
        title: "Sujet requis",
        description: "Le sujet est obligatoire pour les campagnes email.",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);

    try {
      // Filtrer les cibles selon le filtre
      let targetProspects = prospects;
      if (campaign.targetFilter === 'interested') {
        targetProspects = prospects.filter(p => p.status === 'interested');
      } else if (campaign.targetFilter === 'contacted') {
        targetProspects = prospects.filter(p => p.lastContact);
      }

      // Créer la campagne dans Supabase
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name: campaign.name,
          type: campaign.type,
          subject: campaign.subject,
          message: campaign.message,
          target_filter: { filter: campaign.targetFilter },
          status: campaign.scheduledAt ? 'scheduled' : 'draft',
          scheduled_at: campaign.scheduledAt,
          total_targets: targetProspects.length
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Créer les envois individuels
      const sends = targetProspects.map(prospect => ({
        campaign_id: campaignData.id,
        prospect_id: prospect.id,
        prospect_email: prospect.email,
        prospect_phone: prospect.phone,
        prospect_name: prospect.name,
        status: 'pending'
      }));

      if (sends.length > 0) {
        const { error: sendsError } = await supabase
          .from('campaign_sends')
          .insert(sends);

        if (sendsError) throw sendsError;
      }

      window.safeGlobalToast({
        title: "Campagne créée !",
        description: `${targetProspects.length} destinataires ciblés.`
      });

      // Callback
      onCampaignCreated && onCampaignCreated(campaignData);

      // Reset et fermer
      setCampaign({
        name: '',
        type: 'email',
        subject: '',
        message: '',
        targetFilter: 'all',
        scheduledAt: null
      });
      onOpenChange(false);

    } catch (error) {
      console.error('Erreur création campagne:', error);
      window.safeGlobalToast({
        title: "Erreur",
        description: "Impossible de créer la campagne.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const getTargetCount = () => {
    if (campaign.targetFilter === 'all') return prospects.length;
    if (campaign.targetFilter === 'interested') {
      return prospects.filter(p => p.status === 'interested').length;
    }
    if (campaign.targetFilter === 'contacted') {
      return prospects.filter(p => p.lastContact).length;
    }
    return 0;
  };

  const getTypeIcon = () => {
    switch (campaign.type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (campaign.type) {
      case 'email': return 'bg-blue-600';
      case 'sms': return 'bg-green-600';
      case 'whatsapp': return 'bg-emerald-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-purple-600" />
            Créer une Campagne Marketing
          </DialogTitle>
          <DialogDescription>
            Envoyez des messages ciblés à vos prospects par Email, SMS ou WhatsApp
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">
              <MessageSquare className="h-4 w-4 mr-2" />
              Composer
            </TabsTrigger>
            <TabsTrigger value="targets">
              <Users className="h-4 w-4 mr-2" />
              Cibles ({getTargetCount()})
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </TabsTrigger>
          </TabsList>

          {/* Onglet Composer */}
          <TabsContent value="compose" className="space-y-4">
            {/* Nom de la campagne */}
            <div>
              <Label htmlFor="campaign-name">Nom de la campagne *</Label>
              <Input
                id="campaign-name"
                placeholder="Ex: Nouvelles propriétés Septembre 2025"
                value={campaign.name}
                onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
              />
            </div>

            {/* Type de campagne */}
            <div>
              <Label htmlFor="campaign-type">Type de campagne *</Label>
              <Select
                value={campaign.type}
                onValueChange={(value) => setCampaign({ ...campaign, type: value, subject: '', message: '' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      WhatsApp
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Templates */}
            <div>
              <Label>Templates rapides</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.keys(templates[campaign.type] || {}).map((key) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTemplateSelect(key)}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {key.replace(/_/g, ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sujet (Email uniquement) */}
            {campaign.type === 'email' && (
              <div>
                <Label htmlFor="campaign-subject">Sujet *</Label>
                <Input
                  id="campaign-subject"
                  placeholder="Ex: Nouvelle propriété disponible"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                />
              </div>
            )}

            {/* Message */}
            <div>
              <Label htmlFor="campaign-message">
                Message * 
                {campaign.type === 'sms' && ` (${campaign.message.length}/160 caractères)`}
              </Label>
              <Textarea
                id="campaign-message"
                placeholder="Composez votre message..."
                value={campaign.message}
                onChange={(e) => setCampaign({ ...campaign, message: e.target.value })}
                rows={campaign.type === 'sms' ? 4 : 8}
                maxLength={campaign.type === 'sms' ? 160 : undefined}
              />
              <p className="text-xs text-gray-500 mt-1">
                Variables disponibles : {'{'}nom{'}'}, {'{'}propriété{'}'}, {'{'}prix{'}'}, {'{'}location{'}'}, {'{'}vendeur{'}'}
              </p>
            </div>

            {/* Planification */}
            <div>
              <Label htmlFor="campaign-schedule">Planifier l'envoi (optionnel)</Label>
              <Input
                id="campaign-schedule"
                type="datetime-local"
                value={campaign.scheduledAt || ''}
                onChange={(e) => setCampaign({ ...campaign, scheduledAt: e.target.value })}
              />
            </div>
          </TabsContent>

          {/* Onglet Cibles */}
          <TabsContent value="targets" className="space-y-4">
            <div>
              <Label htmlFor="target-filter">Sélectionner les cibles</Label>
              <Select
                value={campaign.targetFilter}
                onValueChange={(value) => setCampaign({ ...campaign, targetFilter: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Tous les prospects ({prospects.length})
                  </SelectItem>
                  <SelectItem value="interested">
                    Prospects intéressés ({prospects.filter(p => p.status === 'interested').length})
                  </SelectItem>
                  <SelectItem value="contacted">
                    Déjà contactés ({prospects.filter(p => p.lastContact).length})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste prospects ciblés */}
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              <h4 className="font-semibold mb-3">Destinataires ({getTargetCount()})</h4>
              <div className="space-y-2">
                {prospects
                  .filter(p => {
                    if (campaign.targetFilter === 'all') return true;
                    if (campaign.targetFilter === 'interested') return p.status === 'interested';
                    if (campaign.targetFilter === 'contacted') return p.lastContact;
                    return false;
                  })
                  .slice(0, 10)
                  .map((prospect) => (
                    <div key={prospect.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">{prospect.name}</p>
                        <p className="text-xs text-gray-600">
                          {campaign.type === 'email' ? prospect.email : prospect.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                {getTargetCount() > 10 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    ... et {getTargetCount() - 10} autres
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Onglet Aperçu */}
          <TabsContent value="preview" className="space-y-4">
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="mb-4 flex items-center justify-between">
                <Badge className={getTypeColor()}>
                  {getTypeIcon()}
                  <span className="ml-1">{campaign.type.toUpperCase()}</span>
                </Badge>
                <Badge variant="outline">{getTargetCount()} destinataires</Badge>
              </div>

              {campaign.type === 'email' && campaign.subject && (
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-1">Sujet :</p>
                  <p className="font-semibold">{campaign.subject}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-600 mb-2">Message :</p>
                <div className="bg-white p-4 rounded border whitespace-pre-wrap">
                  {campaign.message || 'Aucun message'}
                </div>
              </div>

              {campaign.scheduledAt && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Envoi programmé le {new Date(campaign.scheduledAt).toLocaleString('fr-FR')}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>
            Annuler
          </Button>
          <Button onClick={handleCreateCampaign} disabled={creating} className="bg-purple-600 hover:bg-purple-700">
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {campaign.scheduledAt ? 'Planifier' : 'Envoyer'} la campagne
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignModal;
