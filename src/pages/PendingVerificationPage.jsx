
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/SupabaseAuthContext';
import { 
  Clock, 
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PendingVerificationPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Card className="w-full max-w-lg text-center shadow-2xl border-primary/20">
          <CardHeader>
            <Clock className="w-16 h-16 mx-auto text-primary animate-pulse" />
            <CardTitle className="text-3xl font-bold mt-4">Votre compte est en cours de validation</CardTitle>
            <CardDescription className="text-lg text-muted-foreground pt-2">
              Merci pour votre inscription, {user?.full_name || 'cher utilisateur'} !
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Nos équipes examinent actuellement les FileTexts que vous avez soumis. Ce processus prend généralement 24 à 48 heures.
            </p>
            <p className="font-semibold">
              Vous recevrez un e-mail à l'adresse <span className="text-primary">{user?.email}</span> dès que votre compte sera activé.
            </p>
            <p className="text-sm text-muted-foreground">
              En attendant, vous pouvez explorer nos guides ou nous contacter si vous avez des questions.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild variant="outline">
              <Link to="/how-it-works">Comment ça marche ?</Link>
            </Button>
            <Button onClick={logout}>
              Se déconnecter
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default PendingVerificationPage;
