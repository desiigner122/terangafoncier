/**
 * @file useEmailVerification.js
 * @description Hook pour gérer vérification email automatique
 * @created 2025-11-03
 * @week 1 - Day 1
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';

/**
 * Hook custom pour surveiller statut vérification email
 * @returns {Object} { isVerified, isLoading, resendVerification, checkStatus }
 */
export const useEmailVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  /**
   * Vérifier statut actuel depuis Supabase
   */
  const checkStatus = async () => {
    try {
      setIsLoading(true);

      // 1. Récupérer user actuel
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ Erreur récupération user:', userError);
        setIsVerified(false);
        return false;
      }

      setUserEmail(user.email);

      // 2. Vérifier email_confirmed_at dans auth.users
      const emailConfirmed = !!user.email_confirmed_at;

      // 3. Vérifier verification_status dans profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('verification_status')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Erreur récupération profil:', profileError);
        setIsVerified(emailConfirmed); // Fallback sur auth.users
        return emailConfirmed;
      }

      // User vérifié si email confirmé ET status=verified
      const verified = emailConfirmed && profile.verification_status === 'verified';
      setIsVerified(verified);

      return verified;

    } catch (error) {
      console.error('❌ Erreur vérification email:', error);
      setIsVerified(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renvoyer email de vérification
   */
  const resendVerification = async () => {
    try {
      if (!userEmail) {
        toast.error('Email non trouvé');
        return { success: false };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });

      if (error) {
        console.error('❌ Erreur renvoi email:', error);
        toast.error('Impossible de renvoyer l\'email de vérification');
        return { success: false, error };
      }

      toast.success('Email de vérification renvoyé ! Vérifiez votre boîte mail.');
      return { success: true };

    } catch (error) {
      console.error('❌ Erreur resend:', error);
      toast.error('Erreur lors de l\'envoi');
      return { success: false, error };
    }
  };

  /**
   * Écouter changements auth state
   */
  useEffect(() => {
    // Vérification initiale
    checkStatus();

    // Écouter événements auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth event:', event);

        // Si email vient d'être vérifié
        if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
          await checkStatus();
        }

        // Si user se déconnecte
        if (event === 'SIGNED_OUT') {
          setIsVerified(false);
          setUserEmail(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Polling toutes les 10 secondes si non vérifié
   * (pour détecter vérification faite dans autre onglet)
   */
  useEffect(() => {
    if (!isVerified && !isLoading) {
      const interval = setInterval(() => {
        console.log('🔄 Vérification automatique statut email...');
        checkStatus();
      }, 10000); // 10 secondes

      return () => clearInterval(interval);
    }
  }, [isVerified, isLoading]);

  return {
    isVerified,
    isLoading,
    userEmail,
    resendVerification,
    checkStatus,
  };
};

export default useEmailVerification;
