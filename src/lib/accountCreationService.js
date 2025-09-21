/**
 * Service de création de comptes multi-étapes pour tous les rôles
 */

import { supabase } from './supabaseClient';
import { territorialManager } from './territorialManager';
import { ROLES } from './rbacConfig';

class AccountCreationService {
  
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.tempData = {};
    this.validationErrors = {};
  }

  // Configuration des étapes pour chaque rôle
  getStepsForRole(role) {
    const baseSteps = [
      { id: 1, title: 'Informations personnelles', component: 'PersonalInfo' },
      { id: 2, title: 'Informations professionnelles', component: 'ProfessionalInfo' },
      { id: 3, title: 'Sécurité du compte', component: 'SecurityInfo' },
      { id: 4, title: 'Vérification et confirmation', component: 'Confirmation' }
    ];

    // Étapes spécifiques selon le rôle
    const roleSpecificSteps = {
      'Mairie': [
        ...baseSteps.slice(0, 1),
        { id: 2, title: 'Territoire et administration', component: 'TerritorialInfo' },
        ...baseSteps.slice(2)
      ],
      'Banque': [
        ...baseSteps.slice(0, 1),
        { id: 2, title: 'Informations bancaires', component: 'BankInfo' },
        { id: 3, title: 'Zone de couverture', component: 'CoverageArea' },
        ...baseSteps.slice(2)
      ],
      'Notaire': [
        ...baseSteps.slice(0, 1),
        { id: 2, title: 'Cabinet notarial', component: 'NotaryOffice' },
        { id: 3, title: 'Habilitations légales', component: 'LegalAuthorizations' },
        ...baseSteps.slice(2)
      ],
      'Geometre': [
        ...baseSteps.slice(0, 1),
        { id: 2, title: 'Cabinet de géométrie', component: 'SurveyorOffice' },
        { id: 3, title: 'Qualifications techniques', component: 'TechnicalQualifications' },
        ...baseSteps.slice(2)
      ]
    };

    return roleSpecificSteps[role] || baseSteps;
  }

  // Initialiser la création de compte
  initializeCreation(role) {
    if (!ROLES[role]) {
      throw new Error(`Rôle invalide: ${role}`);
    }

    this.currentStep = 1;
    this.tempData = { role };
    this.validationErrors = {};
    this.steps = this.getStepsForRole(role);
    this.totalSteps = this.steps.length;

    return {
      success: true,
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      steps: this.steps,
      role
    };
  }

  // Valider les données d'une étape
  async validateStep(stepData, stepNumber = this.currentStep) {
    const errors = {};

    switch (stepNumber) {
      case 1: // Informations personnelles
        errors.personal = this.validatePersonalInfo(stepData);
        break;
      case 2: // Varie selon le rôle
        if (this.tempData.role === 'Mairie') {
          errors.territorial = await this.validateTerritorialInfo(stepData);
        } else if (this.tempData.role === 'Banque') {
          errors.bank = this.validateBankInfo(stepData);
        } else if (this.tempData.role === 'Notaire') {
          errors.notary = this.validateNotaryInfo(stepData);
        } else if (this.tempData.role === 'Geometre') {
          errors.surveyor = this.validateSurveyorInfo(stepData);
        } else {
          errors.professional = this.validateProfessionalInfo(stepData);
        }
        break;
      case 3: // Sécurité ou spécifique
        if (['Banque', 'Notaire', 'Geometre'].includes(this.tempData.role)) {
          // Étape spécifique métier pour ces rôles
          errors.specific = this.validateRoleSpecificInfo(stepData);
        } else {
          errors.security = this.validateSecurityInfo(stepData);
        }
        break;
      case 4: // Sécurité pour rôles avec étapes supplémentaires
        errors.security = this.validateSecurityInfo(stepData);
        break;
    }

    // Filtrer les erreurs vides
    const validationErrors = Object.fromEntries(
      Object.entries(errors).filter(([key, value]) => Object.keys(value).length > 0)
    );

    this.validationErrors = validationErrors;
    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors
    };
  }

  // Valider les informations personnelles
  validatePersonalInfo(data) {
    const errors = {};

    if (!data.full_name || data.full_name.trim().length < 2) {
      errors.full_name = 'Le nom complet est requis (minimum 2 caractères)';
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.email = 'Adresse email valide requise';
    }

    if (!data.phone || !this.isValidPhone(data.phone)) {
      errors.phone = 'Numéro de téléphone valide requis';
    }

    if (!data.date_of_birth) {
      errors.date_of_birth = 'Date de naissance requise';
    } else {
      const age = this.calculateAge(data.date_of_birth);
      if (age < 18) {
        errors.date_of_birth = 'Vous devez être majeur pour créer un compte';
      }
    }

    if (!data.address || data.address.trim().length < 10) {
      errors.address = 'Adresse complète requise (minimum 10 caractères)';
    }

    return errors;
  }

  // Valider les informations territoriales (Mairie)
  async validateTerritorialInfo(data) {
    const errors = {};

    if (!data.territorial_scope) {
      errors.territorial_scope = 'Périmètre territorial requis';
      return errors;
    }

    const { region, department, commune } = data.territorial_scope;

    if (!region || region.trim().length < 2) {
      errors.region = 'Région requise';
    }

    if (!department || department.trim().length < 2) {
      errors.department = 'Département requis';
    }

    if (!commune || commune.trim().length < 2) {
      errors.commune = 'Commune requise';
    }

    // Vérifier si une mairie existe déjà pour cette commune
    if (region && department && commune) {
      try {
        const { data: existingCommune } = await supabase
          .from('active_communes')
          .select('mairie_user_id')
          .eq('name', commune);

        if (existingCommune && existingCommune.length > 0 && existingCommune[0].mairie_user_id) {
          errors.commune = 'Une mairie existe déjà pour cette commune';
        }
      } catch (error) {
        console.error('Erreur vérification commune:', error);
      }
    }

    if (!data.municipality_name || data.municipality_name.trim().length < 2) {
      errors.municipality_name = 'Nom de la municipalité requis';
    }

    if (!data.mayor_name || data.mayor_name.trim().length < 2) {
      errors.mayor_name = 'Nom du maire requis';
    }

    return errors;
  }

  // Valider les informations bancaires
  validateBankInfo(data) {
    const errors = {};

    if (!data.bank_name || data.bank_name.trim().length < 2) {
      errors.bank_name = 'Nom de la banque requis';
    }

    if (!data.bank_code || !this.isValidBankCode(data.bank_code)) {
      errors.bank_code = 'Code banque valide requis';
    }

    if (!data.headquarters_address || data.headquarters_address.trim().length < 10) {
      errors.headquarters_address = 'Adresse du siège social requise';
    }

    if (!data.license_number || data.license_number.trim().length < 5) {
      errors.license_number = 'Numéro de licence bancaire requis';
    }

    return errors;
  }

  // Valider les informations notariales
  validateNotaryInfo(data) {
    const errors = {};

    if (!data.office_name || data.office_name.trim().length < 2) {
      errors.office_name = 'Nom de l\'étude notariale requis';
    }

    if (!data.notary_number || data.notary_number.trim().length < 3) {
      errors.notary_number = 'Numéro notarial requis';
    }

    if (!data.bar_association || data.bar_association.trim().length < 2) {
      errors.bar_association = 'Chambre notariale requise';
    }

    if (!data.office_address || data.office_address.trim().length < 10) {
      errors.office_address = 'Adresse de l\'étude requise';
    }

    return errors;
  }

  // Valider les informations de géomètre
  validateSurveyorInfo(data) {
    const errors = {};

    if (!data.office_name || data.office_name.trim().length < 2) {
      errors.office_name = 'Nom du cabinet requis';
    }

    if (!data.surveyor_license || data.surveyor_license.trim().length < 3) {
      errors.surveyor_license = 'Numéro de licence géomètre requis';
    }

    if (!data.specializations || !Array.isArray(data.specializations) || data.specializations.length === 0) {
      errors.specializations = 'Au moins une spécialisation requise';
    }

    if (!data.equipment_list || data.equipment_list.trim().length < 10) {
      errors.equipment_list = 'Liste des équipements requise';
    }

    return errors;
  }

  // Valider les informations de sécurité
  validateSecurityInfo(data) {
    const errors = {};

    if (!data.password || data.password.length < 8) {
      errors.password = 'Mot de passe requis (minimum 8 caractères)';
    } else {
      const passwordValidation = this.validatePassword(data.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors.join(', ');
      }
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = 'Confirmation du mot de passe requise';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!data.acceptTerms) {
      errors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    if (!data.acceptPrivacy) {
      errors.acceptPrivacy = 'Vous devez accepter la politique de confidentialité';
    }

    return errors;
  }

  // Valider un mot de passe
  validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Minimum 8 caractères');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Au moins une majuscule');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Au moins une minuscule');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Au moins un chiffre');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Au moins un caractère spécial');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Sauvegarder les données d'une étape
  async saveStepData(stepData) {
    this.tempData = { ...this.tempData, ...stepData };
    
    return {
      success: true,
      savedData: this.tempData,
      currentStep: this.currentStep
    };
  }

  // Passer à l'étape suivante
  async nextStep(stepData) {
    // Valider l'étape actuelle
    const validation = await this.validateStep(stepData);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        currentStep: this.currentStep
      };
    }

    // Sauvegarder les données
    await this.saveStepData(stepData);

    // Passer à l'étape suivante
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }

    return {
      success: true,
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      canProceed: this.currentStep <= this.totalSteps
    };
  }

  // Revenir à l'étape précédente
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }

    return {
      success: true,
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      savedData: this.tempData
    };
  }

  // Finaliser la création du compte
  async finalizeAccount() {
    try {
      const userData = { ...this.tempData };
      
      // Créer le compte dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role
          }
        }
      });

      if (authError) throw authError;

      // Préparer les données utilisateur
      const userProfile = {
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone,
        date_of_birth: userData.date_of_birth,
        address: userData.address,
        role: userData.role,
        user_type: userData.role,
        verification_status: 'pending',
        is_active: true,
        created_at: new Date().toISOString()
      };

      // Traitement spécifique selon le rôle
      let result;
      if (userData.role === 'Mairie') {
        result = await territorialManager.createMairieWithTerritory({
          ...userProfile,
          territorial_scope: userData.territorial_scope,
          municipality_name: userData.municipality_name,
          mayor_name: userData.mayor_name
        });
      } else {
        // Pour les autres rôles, créer directement l'utilisateur
        const { data: newUser, error: userError } = await supabase
          .from('profiles')
          .insert(userProfile)
          .select()
          .single();

        if (userError) throw userError;
        result = { success: true, user: newUser };
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      // Nettoyer les données temporaires
      this.resetService();

      return {
        success: true,
        user: result.user,
        message: 'Compte créé avec succès! Vérifiez votre email pour confirmer votre compte.'
      };

    } catch (error) {
      console.error('❌ Erreur création compte:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Réinitialiser le service
  resetService() {
    this.currentStep = 1;
    this.tempData = {};
    this.validationErrors = {};
    this.steps = [];
    this.totalSteps = 4;
  }

  // Utilitaires de validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^(\+221|00221)?[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  isValidBankCode(code) {
    return code && code.trim().length >= 3;
  }

  calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  validateRoleSpecificInfo(data) {
    // Validation spécifique selon le rôle pour les étapes supplémentaires
    const errors = {};
    
    if (this.tempData.role === 'Banque') {
      if (!data.coverage_areas || !Array.isArray(data.coverage_areas) || data.coverage_areas.length === 0) {
        errors.coverage_areas = 'Au moins une zone de couverture requise';
      }
    } else if (this.tempData.role === 'Notaire') {
      if (!data.legal_authorizations || !Array.isArray(data.legal_authorizations) || data.legal_authorizations.length === 0) {
        errors.legal_authorizations = 'Au moins une habilitation légale requise';
      }
    } else if (this.tempData.role === 'Geometre') {
      if (!data.certifications || !Array.isArray(data.certifications) || data.certifications.length === 0) {
        errors.certifications = 'Au moins une certification requise';
      }
    }

    return errors;
  }

  validateProfessionalInfo(data) {
    const errors = {};

    if (!data.company_name || data.company_name.trim().length < 2) {
      errors.company_name = 'Nom de l\'entreprise requis';
    }

    if (!data.job_title || data.job_title.trim().length < 2) {
      errors.job_title = 'Titre du poste requis';
    }

    if (!data.experience_years || data.experience_years < 0) {
      errors.experience_years = 'Années d\'expérience requises';
    }

    return errors;
  }

  // Obtenir les données actuelles
  getCurrentData() {
    return {
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      tempData: this.tempData,
      steps: this.steps,
      validationErrors: this.validationErrors
    };
  }

  // Créer un compte utilisateur complet avec authentification (ancienne méthode)
  async createCompleteAccount(userData) {
    try {
      const { email, password, role, ...profileData } = userData;

      // 1. Créer le compte dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: profileData.full_name,
            role: role
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erreur lors de la création du compte authentification');
      }

      // 2. Créer le profil utilisateur dans la base
      let userProfile;
      
      if (role === 'Mairie') {
        // Création spéciale pour les mairies avec territoire
        const territorialResult = await territorialManager.createMairieWithTerritory({
          id: authData.user.id,
          email,
          role,
          ...profileData
        });
        
        if (!territorialResult.success) {
          // Supprimer le compte auth si échec
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error(territorialResult.error);
        }
        
        userProfile = territorialResult.user;
        
      } else {
        // Création standard pour autres rôles
        const { data: newUser, error: userError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            role,
            user_type: role,
            ...profileData,
            verification_status: role === 'Admin' ? 'verified' : 'pending',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (userError) {
          // Supprimer le compte auth si échec
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw userError;
        }
        
        userProfile = newUser;
      }

      // 3. Envoyer email de vérification si nécessaire
      if (role !== 'Admin') {
        await this.sendVerificationEmail(email, userProfile);
      }

      return {
        success: true,
        user: userProfile,
        authUser: authData.user,
        needsVerification: role !== 'Admin'
      };

    } catch (error) {
      console.error('❌ Erreur création compte complet:', error);
      return { 
        success: false, 
        error: error.message || 'Erreur lors de la création du compte'
      };
    }
  }

  // Envoyer email de vérification
  async sendVerificationEmail(email, userProfile) {
    try {
      // TODO: Implémenter l'envoi d'email personnalisé
      console.log(`📧 Email de vérification envoyé à ${email} pour ${userProfile.full_name}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return { success: false, error: error.message };
    }
  }

  // Valider les données selon le rôle
  validateUserData(userData) {
    const { role, email, password, full_name } = userData;
    const errors = [];

    // Validations communes
    if (!email || !this.isValidEmail(email)) {
      errors.push('Email valide requis');
    }
    
    if (!password || password.length < 8) {
      errors.push('Mot de passe d\'au moins 8 caractères requis');
    }
    
    if (!full_name || full_name.trim().length < 2) {
      errors.push('Nom complet requis');
    }

    // Validations spécifiques par rôle
    switch (role) {
      case 'Mairie':
        if (!userData.territorial_scope?.region || !userData.territorial_scope?.department || !userData.territorial_scope?.commune) {
          errors.push('Territoire complet requis pour les mairies');
        }
        break;
        
      case 'Banque':
        if (!userData.bank_name || !userData.bank_code) {
          errors.push('Nom et code banque requis');
        }
        if (!userData.territorial_scope?.region) {
          errors.push('Zone de couverture requise pour les banques');
        }
        break;
        
      case 'Agent Foncier':
        if (!userData.license_number) {
          errors.push('Numéro de licence requis pour les agents');
        }
        break;
        
      case 'Vendeur Pro':
        if (!userData.company_name || !userData.business_registration) {
          errors.push('Informations entreprise requises pour les vendeurs pro');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Vérifier si l'email est valide
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Vérifier si l'email existe déjà
  async checkEmailExists(email) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      return { exists: !!data, error: null };
    } catch (error) {
      return { exists: false, error: null };
    }
  }

  // Générer un mot de passe sécurisé
  generateSecurePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // S'assurer qu'on a au moins un caractère de chaque type
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // minuscule
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // majuscule
    password += '0123456789'[Math.floor(Math.random() * 10)]; // chiffre
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // spécial
    
    // Compléter avec des caractères aléatoires
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Mélanger le mot de passe
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // Vérifier la force du mot de passe
  checkPasswordStrength(password) {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    
    let strength = 'Très faible';
    if (score >= 5) strength = 'Très fort';
    else if (score >= 4) strength = 'Fort';
    else if (score >= 3) strength = 'Moyen';
    else if (score >= 2) strength = 'Faible';

    return {
      score,
      strength,
      checks,
      isValid: score >= 4
    };
  }
}

export const accountCreationService = new AccountCreationService();
