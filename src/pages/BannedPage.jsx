import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Ban, 
  Shield, 
  Mail, 
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BannedPage = () => {
  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <Ban className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Compte Suspendu
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Votre accès à la plateforme a été temporairement restreint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Compte Banni</h3>
              </div>
              <p className="text-red-700 text-sm">
                Votre compte a été suspendu par notre équipe de modération.
                Ceci peut être dû à une violation de nos conditions d'utilisation.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Que faire maintenant ?</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Contactez notre support pour plus d'informations</li>
                <li>• Vérifiez votre email pour des détails supplémentaires</li>
                <li>• Respectez nos conditions d'utilisation</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button className="w-full" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Contacter le Support
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Si vous pensez qu'il s'agit d'une erreur, contactez-nous à{' '}
                <a href="mailto:support@terangafoncier.com" className="text-primary underline">
                  support@terangafoncier.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BannedPage;
