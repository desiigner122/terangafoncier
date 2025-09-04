/**
 * Gestionnaire territorial pour la création dynamique des mairies
 */

import { supabase } from './supabaseClient';

class TerritorialManager {
  
  // Créer une mairie et sa structure territoriale
  async createMairieWithTerritory(userData) {
    try {
      const { territorial_scope, ...userProfile } = userData;
      const { region, department, commune } = territorial_scope;

      // 1. Créer/récupérer la région
      let regionData = await this.getOrCreateRegion(region);
      
      // 2. Créer/récupérer le département
      let departmentData = await this.getOrCreateDepartment(department, regionData.id);
      
      // 3. Créer la commune
      let communeData = await this.getOrCreateCommune(commune, departmentData.id);

      // 4. Créer l'utilisateur mairie
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          ...userProfile,
          role: 'Mairie',
          user_type: 'Mairie',
          commune_id: communeData.id,
          territorial_scope: territorial_scope,
          verification_status: 'verified'
        })
        .select()
        .single();

      if (userError) throw userError;

      // 5. Mettre à jour la commune avec l'ID utilisateur
      await supabase
        .from('active_communes')
        .update({ mairie_user_id: newUser.id })
        .eq('id', communeData.id);

      return {
        success: true,
        user: newUser,
        territorial_info: {
          region: regionData,
          department: departmentData,
          commune: communeData
        }
      };

    } catch (error) {
      console.error('❌ Erreur création mairie:', error);
      return { success: false, error: error.message };
    }
  }

  // Créer ou récupérer une région
  async getOrCreateRegion(regionName) {
    try {
      // Essayer de récupérer d'abord
      let { data: regionData, error } = await supabase
        .from('active_regions')
        .select('*')
        .eq('name', regionName)
        .single();

      if (error && error.code === 'PGRST116') {
        // Région n'existe pas, la créer
        const { data: newRegion, error: createError } = await supabase
          .from('active_regions')
          .insert({
            name: regionName,
            slug: regionName.toLowerCase().replace(/\s+/g, '-')
          })
          .select()
          .single();

        if (createError) throw createError;
        regionData = newRegion;
      } else if (error) {
        throw error;
      }

      return regionData;
    } catch (error) {
      throw new Error(`Erreur gestion région: ${error.message}`);
    }
  }

  // Créer ou récupérer un département
  async getOrCreateDepartment(departmentName, regionId) {
    try {
      let { data: departmentData, error } = await supabase
        .from('active_departments')
        .select('*')
        .eq('name', departmentName)
        .eq('region_id', regionId)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newDepartment, error: createError } = await supabase
          .from('active_departments')
          .insert({
            name: departmentName,
            region_id: regionId
          })
          .select()
          .single();

        if (createError) throw createError;
        departmentData = newDepartment;
      } else if (error) {
        throw error;
      }

      return departmentData;
    } catch (error) {
      throw new Error(`Erreur gestion département: ${error.message}`);
    }
  }

  // Créer ou récupérer une commune
  async getOrCreateCommune(communeName, departmentId) {
    try {
      let { data: communeData, error } = await supabase
        .from('active_communes')
        .select('*')
        .eq('name', communeName)
        .eq('department_id', departmentId)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newCommune, error: createError } = await supabase
          .from('active_communes')
          .insert({
            name: communeName,
            department_id: departmentId,
            is_active: true
          })
          .select()
          .single();

        if (createError) throw createError;
        communeData = newCommune;
      } else if (error) {
        throw error;
      }

      return communeData;
    } catch (error) {
      throw new Error(`Erreur gestion commune: ${error.message}`);
    }
  }

  // Récupérer les régions actives
  async getActiveRegions() {
    try {
      const { data, error } = await supabase
        .from('active_regions')
        .select(`
          *,
          departments:active_departments(
            *,
            communes:active_communes(*)
          )
        `)
        .order('name');

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Récupérer les départements actifs d'une région
  async getActiveDepartments(regionId) {
    try {
      const { data, error } = await supabase
        .from('active_departments')
        .select(`
          *,
          communes:active_communes(*)
        `)
        .eq('region_id', regionId)
        .order('name');

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Récupérer les communes actives d'un département
  async getActiveCommunes(departmentId) {
    try {
      const { data, error } = await supabase
        .from('active_communes')
        .select(`
          *,
          mairie:mairie_user_id(full_name, email)
        `)
        .eq('department_id', departmentId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export const territorialManager = new TerritorialManager();
