import { supabase } from '@/lib/supabase';

/**
 * Service de gestion des actes notariés
 * Système professionnel pour notaires - Teranga Foncier
 */
export class NotaireService {
  
  // Types d'actes notariés avec tarification
  static ACT_TYPES = {
    vente_immobiliere: {
      title: "Vente Immobilière",
      baseFee: 150000, // Frais de base FCFA
      feeRate: 0.015, // 1.5% de la valeur
      minFee: 150000,
      maxFee: 5000000,
      requiredDocs: ['titre_propriete', 'certificat_non_gage', 'plan_localisation'],
      averageDuration: 30, // jours
      legalReferences: ['Art. 1582 Code Civil', 'Loi 2011-07']
    },
    donation: {
      title: "Donation",
      baseFee: 100000,
      feeRate: 0.01, // 1% de la valeur
      minFee: 100000,
      maxFee: 3000000,
      requiredDocs: ['acte_naissance', 'certificat_nationalite', 'evaluation_bien'],
      averageDuration: 20,
      legalReferences: ['Art. 894 Code Civil', 'CGI Art. 635']
    },
    succession: {
      title: "Succession",
      baseFee: 200000,
      feeRate: 0.02, // 2% de la valeur
      minFee: 200000,
      maxFee: 8000000,
      requiredDocs: ['acte_deces', 'certificat_heredite', 'inventaire_biens'],
      averageDuration: 45,
      legalReferences: ['Art. 720 Code Civil', 'Code de la Famille']
    },
    hypotheque: {
      title: "Hypothèque",
      baseFee: 200000,
      feeRate: 0.005, // 0.5% de la valeur
      minFee: 200000,
      maxFee: 2000000,
      requiredDocs: ['contrat_pret', 'titre_propriete', 'assurance_bien'],
      averageDuration: 15,
      legalReferences: ['Art. 2393 Code Civil', 'Loi Bancaire']
    },
    bail_emphyteotique: {
      title: "Bail Emphytéotique",
      baseFee: 250000,
      feeRate: 0.008, // 0.8% de la valeur
      minFee: 250000,
      maxFee: 3000000,
      requiredDocs: ['autorisation_admin', 'plan_cadastral', 'etude_impact'],
      averageDuration: 60,
      legalReferences: ['Art. 1690 Code Civil', 'Code Domanial']
    },
    partage: {
      title: "Partage",
      baseFee: 175000,
      feeRate: 0.012, // 1.2% de la valeur
      minFee: 175000,
      maxFee: 4000000,
      requiredDocs: ['acte_indivision', 'evaluation_parts', 'accord_copartageants'],
      averageDuration: 35,
      legalReferences: ['Art. 815 Code Civil', 'Procédure Civile']
    }
  };

  // Statuts des actes notariés
  static ACT_STATUS = {
    draft_review: { label: 'Révision Projet', order: 1 },
    documentation: { label: 'Rassemblement Documents', order: 2 },
    signature_pending: { label: 'En Attente Signature', order: 3 },
    registration: { label: 'Enregistrement', order: 4 },
    completed: { label: 'Acte Finalisé', order: 5 },
    archived: { label: 'Archivé', order: 6 }
  };

  /**
   * Créer un nouvel acte notarié
   */
  static async createNotarialAct(actData) {
    try {
      const {
        type,
        clientId,
        propertyDescription,
        propertyValue,
        location,
        parties, // Array des parties prenantes
        documents = [],
        priority = 'medium',
        deadline
      } = actData;

      // Validation du type d'acte
      if (!this.ACT_TYPES[type]) {
        throw new Error(`Type d'acte invalide: ${type}`);
      }

      const actType = this.ACT_TYPES[type];
      
      // Calcul des honoraires automatique
      const calculatedFees = this.calculateNotarialFees(type, propertyValue);
      
      // Estimation date de finalisation
      const estimatedCompletion = new Date();
      estimatedCompletion.setDate(estimatedCompletion.getDate() + actType.averageDuration);

      // Création de l'acte
      const { data: act, error } = await supabase
        .from('notarial_acts')
        .insert({
          type,
          notaire_id: supabase.auth.user()?.id,
          client_id: clientId,
          property_description: propertyDescription,
          property_value: propertyValue,
          location,
          parties: parties,
          status: 'draft_review',
          priority,
          deadline: deadline || estimatedCompletion.toISOString(),
          calculated_fees: calculatedFees.total,
          fee_breakdown: calculatedFees.breakdown,
          required_documents: actType.requiredDocs,
          legal_references: actType.legalReferences,
          documents: documents,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Créer les tâches automatiques selon le type d'acte
      await this.createActTasks(act.id, type);

      // Programmer les rappels documentaires
      await this.scheduleDocumentReminders(act.id, actType.requiredDocs);

      return {
        success: true,
        act,
        estimatedFees: calculatedFees,
        estimatedCompletion
      };

    } catch (error) {
      console.error('Erreur création acte notarié:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calculer les honoraires notariés
   */
  static calculateNotarialFees(actType, propertyValue) {
    const type = this.ACT_TYPES[actType];
    if (!type) throw new Error('Type d\'acte invalide');

    // Calcul base + pourcentage
    const percentageFee = propertyValue * type.feeRate;
    const totalBeforeMinMax = type.baseFee + percentageFee;
    
    // Application min/max
    const totalFee = Math.max(
      type.minFee,
      Math.min(totalBeforeMinMax, type.maxFee)
    );

    // Breakdown détaillé
    const breakdown = {
      baseFee: type.baseFee,
      percentageFee: Math.min(percentageFee, type.maxFee - type.baseFee),
      total: totalFee,
      rate: type.feeRate * 100,
      propertyValue: propertyValue
    };

    // Taxes et frais additionnels
    const registrationTax = propertyValue * 0.002; // 0.2% taxe enregistrement
    const stampDuty = 5000; // Timbre fiscal fixe
    const archiveFee = 25000; // Frais d'archivage

    return {
      breakdown,
      taxes: {
        registrationTax,
        stampDuty,
        archiveFee,
        total: registrationTax + stampDuty + archiveFee
      },
      total: totalFee,
      grandTotal: totalFee + registrationTax + stampDuty + archiveFee
    };
  }

  /**
   * Créer les tâches automatiques pour un acte
   */
  static async createActTasks(actId, actType) {
    try {
      const taskTemplates = {
        vente_immobiliere: [
          { title: 'Vérification titre de propriété', duration: 3, order: 1 },
          { title: 'Contrôle certificat non-gage', duration: 2, order: 2 },
          { title: 'Rédaction avant-contrat', duration: 2, order: 3 },
          { title: 'Signature compromis de vente', duration: 1, order: 4 },
          { title: 'Finalisation acte authentique', duration: 2, order: 5 },
          { title: 'Enregistrement Conservation Foncière', duration: 5, order: 6 }
        ],
        donation: [
          { title: 'Vérification capacité donateur', duration: 2, order: 1 },
          { title: 'Évaluation du bien donné', duration: 3, order: 2 },
          { title: 'Rédaction acte de donation', duration: 2, order: 3 },
          { title: 'Signature par les parties', duration: 1, order: 4 },
          { title: 'Enregistrement fiscal', duration: 3, order: 5 }
        ],
        succession: [
          { title: 'Établissement certificat d\'hérédité', duration: 5, order: 1 },
          { title: 'Inventaire des biens successoraux', duration: 7, order: 2 },
          { title: 'Calcul des droits de succession', duration: 3, order: 3 },
          { title: 'Rédaction acte de partage', duration: 5, order: 4 },
          { title: 'Signature héritiers', duration: 2, order: 5 },
          { title: 'Enregistrement et publication', duration: 7, order: 6 }
        ]
      };

      const tasks = taskTemplates[actType] || taskTemplates.vente_immobiliere;
      
      for (const task of tasks) {
        await supabase
          .from('notarial_tasks')
          .insert({
            act_id: actId,
            title: task.title,
            estimated_duration: task.duration,
            order_index: task.order,
            status: 'pending',
            created_at: new Date().toISOString()
          });
      }

      return true;
    } catch (error) {
      console.error('Erreur création tâches acte:', error);
      return false;
    }
  }

  /**
   * Programmer les rappels documentaires
   */
  static async scheduleDocumentReminders(actId, requiredDocs) {
    try {
      for (const doc of requiredDocs) {
        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + 7); // Rappel dans 7 jours

        await supabase
          .from('document_reminders')
          .insert({
            act_id: actId,
            document_type: doc,
            reminder_date: reminderDate.toISOString(),
            status: 'scheduled',
            created_at: new Date().toISOString()
          });
      }
      return true;
    } catch (error) {
      console.error('Erreur programmation rappels:', error);
      return false;
    }
  }

  /**
   * Mettre à jour le statut d'un acte
   */
  static async updateActStatus(actId, newStatus, notes = '') {
    try {
      const statusOrder = Object.values(this.ACT_STATUS).map(s => s.order);
      
      // Récupérer l'acte actuel
      const { data: act, error: fetchError } = await supabase
        .from('notarial_acts')
        .select('status')
        .eq('id', actId)
        .single();

      if (fetchError) throw fetchError;

      // Vérifier la logique de transition
      const currentOrder = this.ACT_STATUS[act.status]?.order || 1;
      const newOrder = this.ACT_STATUS[newStatus]?.order || 1;
      
      if (newOrder < currentOrder && newStatus !== 'draft_review') {
        throw new Error('Transition de statut invalide');
      }

      // Mettre à jour l'acte
      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (notes) updateData.status_notes = notes;
      if (newStatus === 'completed') updateData.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('notarial_acts')
        .update(updateData)
        .eq('id', actId);

      if (error) throw error;

      // Mettre à jour les métriques
      await this.updateNotaireMetrics();

      // Notifier le client si nécessaire
      if (newStatus === 'signature_pending' || newStatus === 'completed') {
        await this.notifyClient(actId, newStatus);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur mise à jour statut acte:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enregistrer un document pour un acte
   */
  static async uploadDocument(actId, documentData) {
    try {
      const { file, documentType, description } = documentData;
      
      // Upload du fichier vers Supabase Storage
      const fileName = `acts/${actId}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('notarial-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Enregistrer la référence du document
      const { error } = await supabase
        .from('notarial_documents')
        .insert({
          act_id: actId,
          document_type: documentType,
          file_path: uploadData.path,
          file_name: file.name,
          file_size: file.size,
          description: description,
          uploaded_at: new Date().toISOString()
        });

      if (error) throw error;

      // Marquer le rappel comme résolu
      await supabase
        .from('document_reminders')
        .update({ status: 'completed' })
        .eq('act_id', actId)
        .eq('document_type', documentType);

      return { success: true, filePath: uploadData.path };
    } catch (error) {
      console.error('Erreur upload document:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Générer un acte authentique
   */
  static async generateAuthenticAct(actId) {
    try {
      // Récupérer toutes les données de l'acte
      const { data: act } = await supabase
        .from('notarial_acts')
        .select(`
          *,
          client:profiles(first_name, last_name, email, phone),
          documents:notarial_documents(*),
          tasks:notarial_tasks(*)
        `)
        .eq('id', actId)
        .single();

      if (!act) throw new Error('Acte non trouvé');

      // Générer le contenu de l'acte
      const actContent = {
        header: {
          notaire: {
            name: 'Maître [NOM_NOTAIRE]',
            title: 'Notaire à [VILLE]',
            address: '[ADRESSE_ETUDE]',
            phone: '[TELEPHONE]'
          },
          actNumber: `ACT-${act.id}-${new Date().getFullYear()}`,
          date: new Date().toLocaleDateString('fr-FR'),
          type: this.ACT_TYPES[act.type].title
        },
        parties: act.parties,
        object: {
          description: act.property_description,
          location: act.location,
          value: act.property_value
        },
        clauses: this.generateStandardClauses(act.type),
        fees: act.fee_breakdown,
        legalReferences: act.legal_references,
        signatures: {
          parties: act.parties.map(p => ({ name: p.name, signed: false })),
          notaire: { name: 'Maître [NOM_NOTAIRE]', signed: false }
        }
      };

      // Sauvegarder l'acte généré
      const { error } = await supabase
        .from('generated_acts')
        .insert({
          act_id: actId,
          act_content: actContent,
          status: 'draft',
          generated_at: new Date().toISOString()
        });

      if (error) throw error;

      return {
        success: true,
        actContent
      };

    } catch (error) {
      console.error('Erreur génération acte:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Générer les clauses standard selon le type d'acte
   */
  static generateStandardClauses(actType) {
    const standardClauses = {
      vente_immobiliere: [
        "Le vendeur déclare être propriétaire du bien vendu",
        "Le bien est vendu libre de toute charge et hypothèque",
        "L'acquéreur prend le bien dans l'état où il se trouve",
        "Les frais d'acte sont à la charge de l'acquéreur"
      ],
      donation: [
        "Le donateur fait donation irrévocable du bien ci-après désigné",
        "Le donataire accepte la présente donation",
        "La donation est consentie sans charge ni condition",
        "Les droits d'enregistrement sont à la charge du donataire"
      ],
      succession: [
        "Les héritiers déclarent accepter la succession",
        "Ils s'engagent solidairement au paiement des dettes",
        "Le partage s'opère selon les dispositions légales",
        "Chaque héritier prend sa part en toute propriété"
      ]
    };

    return standardClauses[actType] || standardClauses.vente_immobiliere;
  }

  /**
   * Obtenir les statistiques du notaire
   */
  static async getNotaireStats(notaireId) {
    try {
      // Actes par statut
      const { data: acts } = await supabase
        .from('notarial_acts')
        .select('status, calculated_fees, property_value, created_at, completed_at')
        .eq('notaire_id', notaireId);

      if (!acts) return null;

      // Calculer métriques
      const activeFiles = acts.filter(a => a.status !== 'completed' && a.status !== 'archived').length;
      const completedActs = acts.filter(a => a.status === 'completed').length;
      const totalFees = acts.reduce((sum, a) => sum + (a.calculated_fees || 0), 0);
      
      // Valeur moyenne des actes
      const completedValues = acts
        .filter(a => a.status === 'completed' && a.property_value)
        .map(a => a.property_value);
      const averageActValue = completedValues.length > 0
        ? completedValues.reduce((sum, v) => sum + v, 0) / completedValues.length
        : 0;

      // Revenus mensuels (30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyRevenue = acts
        .filter(a => new Date(a.created_at) >= thirtyDaysAgo)
        .reduce((sum, a) => sum + (a.calculated_fees || 0), 0);

      // Temps de traitement moyen
      const completedWithDates = acts.filter(a => a.completed_at && a.created_at);
      const avgProcessingTime = completedWithDates.length > 0
        ? completedWithDates.reduce((sum, a) => {
            const start = new Date(a.created_at);
            const end = new Date(a.completed_at);
            return sum + (end - start) / (1000 * 60 * 60 * 24); // en jours
          }, 0) / completedWithDates.length
        : 0;

      return {
        activeFiles,
        completedActs,
        monthlyRevenue,
        averageActValue,
        totalRevenue: totalFees,
        totalActs: acts.length,
        averageProcessingTime: Math.round(avgProcessingTime * 10) / 10,
        registrationSuccess: 98.7, // À calculer selon les enregistrements réussis
        legalCompliance: 99.2 // À calculer selon les contrôles qualité
      };

    } catch (error) {
      console.error('Erreur statistiques notaire:', error);
      return null;
    }
  }

  /**
   * Notifier le client
   */
  static async notifyClient(actId, status) {
    try {
      const { data: act } = await supabase
        .from('notarial_acts')
        .select('client_id, type')
        .eq('id', actId)
        .single();

      if (!act) return false;

      const messages = {
        signature_pending: 'Votre acte est prêt pour signature',
        completed: 'Votre acte notarié est finalisé et enregistré'
      };

      await supabase
        .from('notifications')
        .insert({
          recipient_type: 'user',
          recipient_id: act.client_id,
          title: `Acte ${this.ACT_TYPES[act.type].title}`,
          message: messages[status],
          type: 'notarial_update',
          data: { actId, status },
          created_at: new Date().toISOString()
        });

      return true;
    } catch (error) {
      console.error('Erreur notification client:', error);
      return false;
    }
  }

  /**
   * Mettre à jour les métriques
   */
  static async updateNotaireMetrics() {
    try {
      const notaireId = supabase.auth.user()?.id;
      if (!notaireId) return false;

      const stats = await this.getNotaireStats(notaireId);
      if (!stats) return false;

      await supabase
        .from('notaire_metrics')
        .upsert({
          notaire_id: notaireId,
          metrics: stats,
          updated_at: new Date().toISOString()
        });

      return true;
    } catch (error) {
      console.error('Erreur mise à jour métriques notaire:', error);
      return false;
    }
  }
}

export default NotaireService;
