import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Save,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BlogService from '@/services/admin/BlogService';

const blogCategories = [
  'Guides pratiques',
  'Conseils experts',
  'Juridique',
  'Actualités',
  'Marché Immobilier',
  'Agriculture',
  'Urbanisme'
];

const AdminBlogFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [post, setPost] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    tags: '',
    cover_image: '',
    author: 'Admin Teranga',
    status: 'draft'
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    const fetchPost = async () => {
      setLoading(true);
      const result = await BlogService.getPostById(id);
      if (!result.success || !result.post) {
        window.safeGlobalToast?.({ title: 'Erreur', description: 'Article non trouvé.', variant: 'destructive' });
        navigate('/admin/blog');
        return;
      }
      const data = result.post;
      setPost({
        title: data.title || '',
        slug: data.slug || '',
        category: data.category || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
        cover_image: data.cover_image || '',
        author: data.author || 'Admin Teranga',
        status: data.status || 'draft'
      });
      setLoading(false);
    };
    fetchPost();
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => {
      // Auto-générer le slug depuis le titre uniquement à la création
      if (name === 'title' && !isEditing) {
        return { ...prev, title: value, slug: BlogService.generateSlug(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        cover_image: post.cover_image,
        author: post.author,
        status: post.status,
        tags: post.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      const result = isEditing
        ? await BlogService.updatePost(id, payload)
        : await BlogService.createPost(payload);

      if (!result.success) throw new Error(result.error || 'Erreur lors de l\'enregistrement');

      window.safeGlobalToast?.({
        title: `Article ${isEditing ? 'modifié' : 'créé'} avec succès !`,
        description: post.status === 'published' ? 'L\'article est publié.' : 'L\'article est enregistré en brouillon.'
      });
      navigate('/admin/blog');
    } catch (err) {
      window.safeGlobalToast?.({
        title: 'Erreur lors de l\'enregistrement',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center text-muted-foreground">Chargement de l'article...</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{isEditing ? 'Modifier l\'article' : 'Créer un nouvel article'}</h1>
        <Button variant="outline" asChild>
          <Link to="/admin/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Titre de l'article</Label>
                        <Input id="title" name="title" value={post.title} onChange={handleChange} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="excerpt">Extrait (description courte)</Label>
                        <Textarea id="excerpt" name="excerpt" value={post.excerpt} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Contenu de l'article</Label>
                        <Textarea id="content" name="content" value={post.content} onChange={handleChange} required rows={15} />
                        <p className="text-xs text-muted-foreground">Astuce : une ligne entourée de <code>**...**</code> devient un sous-titre.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
             <Card>
                <CardHeader><CardTitle>Publication</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Statut</Label>
                        <Select onValueChange={(value) => setPost(prev => ({ ...prev, status: value }))} value={post.status}>
                            <SelectTrigger id="status"><SelectValue placeholder="Choisir un statut" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Brouillon</SelectItem>
                                <SelectItem value="published">Publié</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">Auteur</Label>
                        <Input id="author" name="author" value={post.author} onChange={handleChange} />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Organisation</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" name="slug" value={post.slug} onChange={handleChange} required placeholder="ex: mon-nouvel-article" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select onValueChange={(value) => setPost(prev => ({ ...prev, category: value }))} value={post.category}>
                            <SelectTrigger id="category"><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                            <SelectContent>
                                {blogCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                        <Input id="tags" name="tags" value={post.tags} onChange={handleChange} placeholder="ex: Achat, Diaspora" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Image de couverture</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                     <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {post.cover_image ? (
                           <img src={post.cover_image} alt="Aperçu" className="h-full w-full object-cover"/>
                        ) : (
                           <ImageIcon className="h-16 w-16 text-muted-foreground"/>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cover_image">URL de l'image</Label>
                        <Input id="cover_image" name="cover_image" value={post.cover_image} onChange={handleChange} placeholder="https://..." />
                    </div>
                </CardContent>
            </Card>
        </div>
       </div>
        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            <Save className="mr-2 h-4 w-4" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminBlogFormPage;
