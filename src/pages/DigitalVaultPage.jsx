import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Archive as Vault, 
  FileText, 
  Download, 
  ShieldCheck, 
  PlusCircle, 
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';
import { Helmet } from 'react-helmet-async';

const DigitalVaultPage = () => {
  const [FileTexts, setFileTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Système de notification sécurisé
  const safeToast = (message, type = 'default') => {
    try {
      // Utilisation du système global sécurisé
      if (typeof window !== 'undefined' && window.safeGlobalToast) {
        window.safeGlobalToast(message, type);
        return;
      }
      
      // Fallback 1: Console pour développement
      console.log(`📢 TOAST [${type.toUpperCase()}]: ${message}`);
      
      // Fallback 2: Alert pour utilisateur en cas d'erreur critique
      if (type === 'destructive' || type === 'error') {
        alert(`❌ Erreur: ${message}`);
      } else if (type === 'success') {
        // Notification discrète pour succès
        if (typeof FileText !== 'undefined') {
          const notification = FileText.createElement('div');
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            transition: all 0.3s ease;
          `;
          notification.textContent = `✅ ${message}`;
          FileText.body.appendChild(notification);
          
          setTimeout(() => {
            if (notification.parentNode) {
              notification.style.opacity = '0';
              setTimeout(() => notification.remove(), 300);
            }
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Erreur dans safeToast:', error);
      console.log(`📢 MESSAGE: ${message}`);
    }
  };

  // Charger les FileTexts depuis Supabase
  useEffect(() => {
    const fetchFileTexts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('Utilisateur non authentifié');
          setLoading(false);
          return;
        }

        // Requête pour récupérer les FileTexts de l'utilisateur
        const { data: userFileTexts, error: docError } = await supabase
          .from('FileTexts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (docError) {
          console.error('Erreur récupération FileTexts:', docError);
          // Fallback vers données d'exemple si la table n'existe pas encore
          setFileTexts([
            {
              id: "demo1",
              name: "Exemple - FileText foncier.pdf",
              category: "FileTexts de démonstration",
              date: new Date().toISOString().split('T')[0],
              size: "Exemple",
              verified: false,
              is_demo: true
            }
          ]);
        } else {
          setFileTexts(userFileTexts || []);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des FileTexts:', err);
        setError('Impossible de charger vos FileTexts');
      } finally {
        setLoading(false);
      }
    };

    fetchFileTexts();
  }, []);

  const handleDownload = async (docId, docName) => {
    try {
      // Pour les FileTexts de démo
      if (FileTexts.find(d => d.id === docId)?.is_demo) {
        safeToast("Fonctionnalité de téléchargement en cours de développement", "default");
        return;
      }

      // Pour les vrais FileTexts
      const { data, error } = await supabase.storage
        .from('user-FileTexts')
        .download(`${docId}/${docName}`);
      
      if (error) throw error;
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(data);
      const a = FileText.createElement('a');
      a.href = url;
      a.download = docName;
      FileText.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      FileText.body.removeChild(a);
      
      safeToast(`Téléchargement de "${docName}" réussi`, "success");
    } catch (err) {
      console.error('Erreur téléchargement:', err);
      safeToast("Erreur lors du téléchargement", "destructive");
    }
  };

  const handleUpload = () => {
    safeToast("Fonctionnalité de téléversement en cours de développement", "default");
    // TODO: Implémenter l'upload vers Supabase Storage
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Chargement de vos FileTexts...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Coffre-fort Numérique - Teranga Foncier</title>
        <meta name="description" content="Accédez à tous vos FileTexts fonciers importants (actes de vente, titres de propriété, plans) dans un espace sécurisé et confidentiel." />
      </Helmet>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto py-12 px-4"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 flex items-center">
              <Vault className="h-10 w-10 mr-3" /> Coffre-fort Numérique
            </h1>
            <p className="text-lg text-muted-foreground">
              Vos FileTexts fonciers, sécurisés et accessibles à tout moment.
            </p>
          </div>
          <Button size="lg" onClick={handleUpload}>
            <PlusCircle className="mr-2 h-5 w-5" /> Téléverser un FileText
          </Button>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants} className="mb-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Mes FileTexts</CardTitle>
              <CardDescription>
                {FileTexts.length === 0 
                  ? "Aucun FileText trouvé. Téléversez vos premiers FileTexts fonciers." 
                  : "Retrouvez ici tous les FileTexts liés à vos transactions."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {FileTexts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun FileText dans votre coffre-fort</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Nom du FileText</th>
                        <th className="text-left p-3 font-semibold hidden md:table-cell">Catégorie</th>
                        <th className="text-left p-3 font-semibold hidden sm:table-cell">Date</th>
                        <th className="text-left p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FileTexts.map((doc) => (
                        <tr key={doc.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground md:hidden">{doc.category}</p>
                                {doc.is_demo && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Démo</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell">{doc.category}</td>
                          <td className="p-3 hidden sm:table-cell">{doc.date}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownload(doc.id, doc.name)}
                              >
                                <Download className="h-4 w-4 mr-1" /> Télécharger
                              </Button>
                              {doc.verified && (
                                <ShieldCheck className="h-5 w-5 text-green-500" title="FileText vérifié par Teranga Foncier" />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default DigitalVaultPage;