
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Construction
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DisputesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center h-full p-4 md:p-6 lg:p-8"
    >
      <Card className="w-full max-w-2xl text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full w-fit">
            <Construction className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Fonctionnalité en cours de développement</CardTitle>
          <CardDescription className="text-lg">
            La gestion des litiges fonciers sera disponible dans la V2 de la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Nous travaillons activement pour vous offrir un outil complet de médiation et de suivi des litiges. Cette fonctionnalité vous permettra d'enregistrer, de suivre et de résoudre les conflits fonciers au sein de votre commune de manière structurée et transparente.
          </p>
          <Button asChild>
            <Link to="/solutions/mairies/dashboard">
              Retourner au Tableau de Bord
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DisputesPage;