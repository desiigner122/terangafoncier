import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileSignature, 
  GitPullRequest
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminRequestsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 flex items-center justify-center h-full"
    >
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
             <GitPullRequest className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Gestion des Requêtes Système</CardTitle>
          <CardDescription>
            Cette section a été déplacée pour une meilleure organisation. Toutes les demandes nécessitant une action de votre part (approbations de comptes, validation d'annonces) se trouvent maintenant dans la section "Requêtes Système".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/admin/system-requests">
              Aller aux Requêtes Système
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminRequestsPage;