/**
 * @file VerifyEmailPage.jsx
 * @description Page affichée après inscription pour vérification email
 * @created 2025-11-03
 * @week 1 - Day 1
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { supabase } from '@/config/supabaseClient';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { isVerified, isLoading, userEmail, resendVerification, checkStatus } = useEmailVerification();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [userRole, setUserRole] = useState(null);

  /**
   * Récupérer rôle user pour redirection appropriée
   */
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile) setUserRole(profile.role);
      }
    };

    fetchUserRole();
  }, []);

  /**
   * Rediriger vers dashboard si vérifié
   */
  useEffect(() => {
    if (isVerified && userRole) {
      // Attendre 2 secondes pour montrer succès
      setTimeout(() => {
        // Redirection selon rôle
        switch (userRole) {
          case 'particulier':
          case 'acheteur':
            navigate('/dashboard-particulier');
            break;
          case 'vendeur_particulier':
          case 'vendeur_pro':
            navigate('/dashboard-vendeur');
            break;
          case 'notaire':
            navigate('/dashboard-notaire');
            break;
          case 'agent_foncier':
            navigate('/dashboard-agent');
            break;
          case 'admin':
          case 'super_admin':
            navigate('/admin-dashboard');
            break;
          default:
            navigate('/dashboard-particulier');
        }
      }, 2000);
    }
  }, [isVerified, userRole, navigate]);

  /**
   * Gérer cooldown renvoi email (60 secondes)
   */
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /**
   * Handler renvoi email
   */
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    const result = await resendVerification();
    if (result.success) {
      setResendCooldown(60); // 60 secondes cooldown
    }
  };

  /**
   * Handler vérification manuelle
   */
  const handleCheckNow = async () => {
    await checkStatus();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-emerald-100">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto"
            >
              {isVerified ? (
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-12 h-12 text-blue-600" />
                </div>
              )}
            </motion.div>

            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isVerified ? 'Email vérifié !' : 'Vérifiez votre email'}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {isVerified ? (
                  'Redirection vers votre dashboard...'
                ) : (
                  <>
                    Nous avons envoyé un email de vérification à{' '}
                    <span className="font-semibold text-gray-900">{userEmail}</span>
                  </>
                )}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {isVerified ? (
              <Alert className="bg-emerald-50 border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800">
                  Votre compte est maintenant actif. Vous allez être redirigé automatiquement.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <p className="font-semibold mb-2">Étapes suivantes:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Ouvrez votre boîte mail</li>
                      <li>Cliquez sur le lien de confirmation</li>
                      <li>Revenez ici pour accéder à votre compte</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Button
                    onClick={handleCheckNow}
                    variant="default"
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    J'ai vérifié mon email
                  </Button>

                  <Button
                    onClick={handleResendEmail}
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled={resendCooldown > 0}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {resendCooldown > 0
                      ? `Renvoyer dans ${resendCooldown}s`
                      : 'Renvoyer l\'email'}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600 pt-4 border-t">
                  <p>Email non reçu ?</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>✓ Vérifiez vos spams/courrier indésirable</li>
                    <li>✓ Vérifiez l'orthographe de votre email</li>
                    <li>✓ Attendez quelques minutes</li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Logo Teranga Foncier */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-gray-600"
        >
          <p className="text-sm">Teranga Foncier</p>
          <p className="text-xs text-gray-500">Plateforme foncière du Sénégal</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
