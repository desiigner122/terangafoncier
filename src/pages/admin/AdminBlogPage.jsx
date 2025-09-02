import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast-simple";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Link, useNavigate } from 'react-router-dom';

import { supabase } from '@/lib/supabaseClient';

const AdminBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const { data, error } = await supabase.from('blog').select('*').order('published_at', { ascending: false });
        if (error) throw error;
        setPosts(data);
      } catch (err) {
        setFetchError(err.message);
        setPosts([]);
        console.error('Erreur lors du chargement des articles de blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDeletePost = async (slug) => {
    try {
      const { error } = await supabase.from('blog').delete().eq('slug', slug);
      if (error) throw error;
      setPosts(prev => prev.filter(p => p.slug !== slug));
      toast({
        title: "Article Supprimé",
        description: "L'article de blog a été supprimé avec succès.",
      });
    } catch (err) {
      toast({
        title: "Erreur lors de la suppression",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post =>
    (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion du Blog</h1>
          <p className="text-muted-foreground">Créez, modifiez et gérez les articles du blog.</p>
        </div>
        <Button asChild>
          <Link to="/admin/blog/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Créer un article
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">Chargement...</div>
      ) : fetchError ? (
        <div className="text-red-600 py-4">Erreur : {fetchError}</div>
      ) : (
        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par titre ou catégorie..."
                className="pl-8 w-full md:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Titre</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Catégorie</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date de Publication</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{post.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"><Badge variant="secondary">{post.category}</Badge></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString('fr-FR') : ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}>
                          <Edit className="mr-1 h-3 w-3" /> Modifier
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive-outline" size="sm">
                              <Trash2 className="mr-1 h-3 w-3" /> Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet article ?</AlertDialogTitle>
                              <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePost(post.slug)}>Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default AdminBlogPage;