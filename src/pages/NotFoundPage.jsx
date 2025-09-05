import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  ArrowLeft, 
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">404</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Page non trouvée
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <p className="text-gray-600">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full">
                <Link to="/" className="flex items-center justify-center gap-2">
                  <Home className="h-4 w-4" />
                  Retour à l'accueil
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="javascript:history.back()" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Page précédente
                </Link>
              </Button>
            </div>
            
            <div className="text-sm text-gray-500 border-t pt-4">
              <p>
                Besoin d'aide ? {' '}
                <Link to="/contact" className="text-blue-600 hover:underline">
                  Contactez-nous
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
