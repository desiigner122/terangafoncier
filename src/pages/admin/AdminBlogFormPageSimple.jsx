import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { 
  Save, 
  ArrowLeft
} from 'lucide-react';

const AdminBlogFormPageSimple = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // toast remplacÃ© par window.safeGlobalToast
  const isEditing = Boolean(id);

  const [post, setPost] = useState({
    title: '',
    content: '',
    author_id: null // Utiliser author_id au lieu d'author_name
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (isEditing) {
        try {
          const { data, error } = await supabase
            .from('blog')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) {
            console.error('Erreur fetch:', error);
            window.safeGlobalToast({ 
              title: "Erreur", 
              description: "Article non trouvé.", 
              variant: "destructive" 
            });
            navigate('/admin/blog');
          } else {
            setPost(data);
          }
        } catch (err) {
          console.error('Erreur:', err);
          window.safeGlobalToast({ 
            title: "Erreur", 
            description: "Impossible de charger l'article.", 
            variant: "destructive" 
          });
        }
      }
    };
    fetchPost();
  }, [id, isEditing, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Préparer les données avec seulement les colonnes qui existent
      const payload = {
        title: post.title,
        content: post.content,
        // author_id sera géré automatiquement par le système d'auth ou RLS
      };

      let result;
      if (isEditing) {
        result = await supabase
          .from('blog')
          .update(payload)
          .eq('id', id);
      } else {
        result = await supabase
          .from('blog')
          .insert([payload]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      window.safeGlobalToast({
        title: `Article ${isEditing ? 'modifié' : 'créé'} avec succès !`,
        description: "Les modifications ont été enregistrées.",
      });
      navigate('/admin/blog');
      
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      window.safeGlobalToast({
        title: "Erreur lors de l'enregistrement",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-green-800">
            {isEditing ? 'Modifier l\'article' : 'Nouvel article'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'article</CardTitle>
            <CardDescription>
              Version simplifiée - seulement titre et contenu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'article</Label>
                <Input
                  id="title"
                  name="title"
                  value={post.title}
                  onChange={handleChange}
                  placeholder="Entrez le titre de l'article"
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={post.content}
                  onChange={handleChange}
                  placeholder="Rédigez le contenu de l'article..."
                  className="min-h-[400px] resize-y"
                  required
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/admin/blog')}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Note importante</h3>
          <p className="text-yellow-700 text-sm">
            Cette version simplifiée ne contient que les colonnes existantes dans la base de données.
            Pour utiliser toutes les fonctionnalités (slug, excerpt, tags, catégories, etc.), 
            la structure de la table doit être mise à jour via le script SQL fourni.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBlogFormPageSimple;

