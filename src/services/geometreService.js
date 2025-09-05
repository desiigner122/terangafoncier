import { supabase } from '@/lib/supabase';

/**
 * Service de gestion des missions géomètres
 * Outils techniques et business pour géomètres-experts
 */
export class GeometreService {
  
  // Types de missions géomètres avec tarification
  static MISSION_TYPES = {
    bornage: {
      title: "Bornage de Propriété",
      basePrice: 200000, // Prix de base FCFA
      pricePerHectare: 75000,
      deliveryTime: 10, // jours
      precision: 'mm',
      tools: ['station_totale', 'gps_rtk']
    },
    lotissement: {
      title: "Plan de Lotissement", 
      basePrice: 500000,
      pricePerHectare: 150000,
      deliveryTime: 20,
      precision: 'cm', 
      tools: ['station_totale', 'drone', 'cad_software']
    },
    topographie: {
      title: "Levé Topographique",
      basePrice: 300000,
      pricePerHectare: 100000,
      deliveryTime: 15,
      precision: 'cm',
      tools: ['station_totale', 'gps_rtk', 'drone']
    },
    cadastre: {
      title: "Mise à Jour Cadastrale",
      basePrice: 400000,
      pricePerHectare: 120000,
      deliveryTime: 25,
      precision: 'mm',
      tools: ['station_totale', 'gps_rtk', 'archives']
    },
    expertise: {
      title: "Expertise Foncière",
      basePrice: 350000,
      pricePerHectare: 90000,
      deliveryTime: 18,
      precision: 'mm',
      tools: ['station_totale', 'analyse_juridique']
    }
  };

  // Équipements techniques standards
  static EQUIPMENT_STANDARDS = {
    station_totale: {
      name: "Station Totale",
      precision: "1mm + 1.5ppm",
      calibrationInterval: 180, // jours
      maintenanceInterval: 365,
      brands: ['Leica', 'Trimble', 'Topcon']
    },
    gps_rtk: {
      name: "GPS RTK",
      precision: "8mm + 1ppm",
      calibrationInterval: 90,
      maintenanceInterval: 180,
      brands: ['Trimble', 'Leica', 'Septentrio']
    },
    drone: {
      name: "Drone Cartographique",
      precision: "1.5cm + 1ppm",
      calibrationInterval: 60,
      maintenanceInterval: 120,
      brands: ['DJI', 'Parrot', 'senseFly']
    }
  };

  /**
   * Créer une nouvelle mission géomètre
   */
  static async createMission(missionData) {
    try {
      const {
        type,
        clientId,
        location,
        surface, // en hectares
        coordinates,
        description,
        priority = 'medium',
        deadline
      } = missionData;

      // Validation du type de mission
      if (!this.MISSION_TYPES[type]) {
        throw new Error(`Type de mission invalide: ${type}`);
      }

      const missionType = this.MISSION_TYPES[type];
      
      // Calcul du prix automatique
      const surfaceNum = parseFloat(surface) || 1;
      const totalPrice = missionType.basePrice + (surfaceNum * missionType.pricePerHectare);
      
      // Estimation délai
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + missionType.deliveryTime);

      // Création de la mission
      const { data: mission, error } = await supabase
        .from('geometric_missions')
        .insert({
          type,
          client_id: clientId,
          geometre_id: supabase.auth.user()?.id,
          location,
          surface: surfaceNum,
          coordinates,
          description,
          priority,
          deadline: deadline || estimatedDelivery.toISOString(),
          estimated_price: totalPrice,
          status: 'planning',
          precision_target: missionType.precision,
          required_tools: missionType.tools,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Créer les tâches automatiques
      await this.createMissionTasks(mission.id, type);

      // Programmer les rappels équipements
      await this.scheduleEquipmentChecks(mission.id, missionType.tools);

      return {
        success: true,
        mission,
        estimatedPrice: totalPrice,
        estimatedDelivery
      };

    } catch (error) {
      console.error('Erreur création mission géomètre:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Créer les tâches automatiques pour une mission
   */
  static async createMissionTasks(missionId, type) {
    try {
      const taskTemplates = {
        bornage: [
          { title: 'Recherche archives cadastrales', duration: 2, order: 1 },
          { title: 'Reconnaissance terrain', duration: 1, order: 2 },
          { title: 'Implantation bornes', duration: 3, order: 3 },
          { title: 'Relevé coordonnées', duration: 2, order: 4 },
          { title: 'Calculs et ajustements', duration: 1, order: 5 },
          { title: 'Rédaction PV bornage', duration: 1, order: 6 }
        ],
        lotissement: [
          { title: 'Étude faisabilité', duration: 3, order: 1 },
          { title: 'Levé topographique', duration: 5, order: 2 },
          { title: 'Conception plan masse', duration: 4, order: 3 },
          { title: 'Calculs surfaces parcelles', duration: 3, order: 4 },
          { title: 'Plan final et métrés', duration: 3, order: 5 },
          { title: 'Dossier technique complet', duration: 2, order: 6 }
        ],
        topographie: [
          { title: 'Planification levé', duration: 1, order: 1 },
          { title: 'Implantation canevas', duration: 2, order: 2 },
          { title: 'Levé terrain détaillé', duration: 6, order: 3 },
          { title: 'Traitement données', duration: 3, order: 4 },
          { title: 'Plan topographique', duration: 3, order: 5 }
        ]
      };

      const tasks = taskTemplates[type] || taskTemplates.bornage;
      
      for (const task of tasks) {
        await supabase
          .from('mission_tasks')
          .insert({
            mission_id: missionId,
            title: task.title,
            estimated_duration: task.duration,
            order_index: task.order,
            status: 'pending',
            created_at: new Date().toISOString()
          });
      }

      return true;
    } catch (error) {
      console.error('Erreur création tâches:', error);
      return false;
    }
  }

  /**
   * Programmer les vérifications équipements
   */
  static async scheduleEquipmentChecks(missionId, requiredTools) {
    try {
      for (const tool of requiredTools) {
        const equipment = this.EQUIPMENT_STANDARDS[tool];
        if (equipment) {
          await supabase
            .from('equipment_checks')
            .insert({
              mission_id: missionId,
              equipment_type: tool,
              equipment_name: equipment.name,
              check_type: 'pre_mission',
              status: 'scheduled',
              precision_target: equipment.precision,
              scheduled_date: new Date().toISOString()
            });
        }
      }
      return true;
    } catch (error) {
      console.error('Erreur programmation vérifications:', error);
      return false;
    }
  }

  /**
   * Mettre à jour le statut d'une mission
   */
  static async updateMissionStatus(missionId, newStatus, notes = '') {
    try {
      const statusFlow = ['planning', 'survey', 'in_progress', 'review', 'completed'];
      
      const { data: mission, error: fetchError } = await supabase
        .from('geometric_missions')
        .select('status')
        .eq('id', missionId)
        .single();

      if (fetchError) throw fetchError;

      // Vérifier la logique de transition
      const currentIndex = statusFlow.indexOf(mission.status);
      const newIndex = statusFlow.indexOf(newStatus);
      
      if (newIndex < currentIndex && newStatus !== 'planning') {
        throw new Error('Transition de statut invalide');
      }

      // Mettre à jour le statut
      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (notes) updateData.status_notes = notes;
      if (newStatus === 'completed') updateData.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('geometric_missions')
        .update(updateData)
        .eq('id', missionId);

      if (error) throw error;

      // Mettre à jour les métriques
      await this.updateGeometreMetrics();

      return { success: true };
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enregistrer des mesures terrain
   */
  static async recordMeasurements(missionId, measurements) {
    try {
      const measurementRecord = {
        mission_id: missionId,
        measurements: measurements, // JSON avec coordonnées, angles, distances
        equipment_used: measurements.equipmentUsed || [],
        precision_achieved: measurements.precisionAchieved,
        weather_conditions: measurements.weatherConditions,
        operator_notes: measurements.notes,
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from('field_measurements')
        .insert(measurementRecord);

      if (error) throw error;

      // Calculer la précision moyenne de la mission
      await this.calculateMissionPrecision(missionId);

      return { success: true };
    } catch (error) {
      console.error('Erreur enregistrement mesures:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculer la précision d'une mission
   */
  static async calculateMissionPrecision(missionId) {
    try {
      const { data: measurements } = await supabase
        .from('field_measurements')
        .select('precision_achieved')
        .eq('mission_id', missionId);

      if (measurements && measurements.length > 0) {
        const precisions = measurements
          .map(m => m.precision_achieved)
          .filter(p => p !== null);
        
        if (precisions.length > 0) {
          const avgPrecision = precisions.reduce((sum, p) => sum + p, 0) / precisions.length;
          
          await supabase
            .from('geometric_missions')
            .update({ 
              achieved_precision: avgPrecision,
              updated_at: new Date().toISOString()
            })
            .eq('id', missionId);
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur calcul précision:', error);
      return false;
    }
  }

  /**
   * Générer rapport technique
   */
  static async generateTechnicalReport(missionId) {
    try {
      // Récupérer toutes les données de la mission
      const { data: mission } = await supabase
        .from('geometric_missions')
        .select(`
          *,
          client:profiles(first_name, last_name, email),
          measurements:field_measurements(*),
          tasks:mission_tasks(*)
        `)
        .eq('id', missionId)
        .single();

      if (!mission) throw new Error('Mission non trouvée');

      // Calculer statistiques
      const completedTasks = mission.tasks?.filter(t => t.status === 'completed').length || 0;
      const totalTasks = mission.tasks?.length || 0;
      const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Générer le rapport
      const report = {
        missionInfo: {
          id: mission.id,
          type: mission.type,
          client: `${mission.client?.first_name} ${mission.client?.last_name}`,
          location: mission.location,
          surface: mission.surface,
          status: mission.status
        },
        technical: {
          precisionTarget: mission.precision_target,
          precisionAchieved: mission.achieved_precision,
          equipmentUsed: mission.required_tools,
          measurementCount: mission.measurements?.length || 0
        },
        progress: {
          completedTasks,
          totalTasks,
          progressPercent,
          estimatedCompletion: mission.deadline
        },
        financial: {
          estimatedPrice: mission.estimated_price,
          actualCost: mission.actual_cost || mission.estimated_price
        },
        generatedAt: new Date().toISOString()
      };

      // Sauvegarder le rapport
      await supabase
        .from('mission_reports')
        .insert({
          mission_id: missionId,
          report_data: report,
          report_type: 'technical',
          generated_at: new Date().toISOString()
        });

      return {
        success: true,
        report
      };

    } catch (error) {
      console.error('Erreur génération rapport:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir les statistiques du géomètre
   */
  static async getGeometreStats(geometreId) {
    try {
      // Missions par statut
      const { data: missions } = await supabase
        .from('geometric_missions')
        .select('status, estimated_price, achieved_precision, created_at')
        .eq('geometre_id', geometreId);

      if (!missions) return null;

      // Calculer métriques
      const activeMissions = missions.filter(m => ['planning', 'survey', 'in_progress'].includes(m.status)).length;
      const completedMissions = missions.filter(m => m.status === 'completed').length;
      const totalRevenue = missions.reduce((sum, m) => sum + (m.estimated_price || 0), 0);
      
      // Précision moyenne
      const precisionsWithValues = missions
        .map(m => m.achieved_precision)
        .filter(p => p !== null && p !== undefined);
      const avgPrecision = precisionsWithValues.length > 0 
        ? precisionsWithValues.reduce((sum, p) => sum + p, 0) / precisionsWithValues.length 
        : 0;

      // Revenus mensuels (30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyRevenue = missions
        .filter(m => new Date(m.created_at) >= thirtyDaysAgo)
        .reduce((sum, m) => sum + (m.estimated_price || 0), 0);

      return {
        activeMissions,
        completedSurveys: completedMissions,
        monthlyRevenue,
        precision: avgPrecision,
        totalRevenue,
        totalMissions: missions.length
      };

    } catch (error) {
      console.error('Erreur statistiques géomètre:', error);
      return null;
    }
  }

  /**
   * Mettre à jour les métriques globales
   */
  static async updateGeometreMetrics() {
    try {
      const geometreId = supabase.auth.user()?.id;
      if (!geometreId) return false;

      const stats = await this.getGeometreStats(geometreId);
      if (!stats) return false;

      // Sauvegarder dans le cache metrics
      await supabase
        .from('geometre_metrics')
        .upsert({
          geometre_id: geometreId,
          metrics: stats,
          updated_at: new Date().toISOString()
        });

      return true;
    } catch (error) {
      console.error('Erreur mise à jour métriques:', error);
      return false;
    }
  }

  /**
   * Vérifier l'état des équipements
   */
  static async checkEquipmentStatus(geometreId) {
    try {
      const { data: equipments } = await supabase
        .from('geometre_equipment')
        .select('*')
        .eq('geometre_id', geometreId);

      const equipmentStatus = equipments?.map(eq => {
        const lastCalibration = new Date(eq.last_calibration);
        const nextMaintenance = new Date(eq.next_maintenance);
        const now = new Date();
        
        let status = 'operational';
        if (now > nextMaintenance) status = 'maintenance';
        else if (now > new Date(lastCalibration.getTime() + (90 * 24 * 60 * 60 * 1000))) status = 'calibration';

        return {
          ...eq,
          status,
          needsAttention: status !== 'operational'
        };
      }) || [];

      return equipmentStatus;
    } catch (error) {
      console.error('Erreur vérification équipements:', error);
      return [];
    }
  }
}

export default GeometreService;
