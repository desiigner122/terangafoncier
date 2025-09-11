import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez saisir votre adresse email');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      setMessage('Un email de rÃ©initialisation a Ã©tÃ© envoyÃ© Ã  votre adresse email.');
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Erreur lors de l\'envoi de l\'email. Veuillez vÃ©rifier votre adresse email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              {emailSent ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <Mail className="h-12 w-12 text-emerald-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {emailSent ? 'Email envoyÃ© !' : 'Mot de passe oubliÃ© ?'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {emailSent
                ? 'VÃ©rifiez votre boÃ®te email pour rÃ©initialiser votre mot de passe'
                : 'Saisissez votre email pour recevoir un lien de rÃ©initialisation'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!emailSent ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    YOUR_API_KEY="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Envoyer le lien de rÃ©initialisation
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {message && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Vous n'avez pas reÃ§u l'email ?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                      setMessage('');
                      setError('');
                    }}
                    className="w-full"
                  >
                    Renvoyer l'email
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Ã  la connexion
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Besoin d'aide ? {' '}
            <Link to="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Contactez-nous
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
