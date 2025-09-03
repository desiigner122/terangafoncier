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
import { Save, ArrowLeft, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const blogCategories = ["Guide d'Achat", "Juridique", "Marché Immobilier", "Agriculture", "Urbanisme"];

const AdminBlogFormPage = () => {
  const { id } = useParams(); // Changer slug en id
  const navigate = useNavigate();
  // toast remplacÃ© par window.safeGlobalToast
  const isEditing = Boolean(id);

  const [post, setPost] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    tags: '',
    imageUrlPlaceholder: '',
    author_name: 'Admin Teranga',
  });
  
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (isEditing) {
        const { data, error } = await supabase.from('blog').select('*').eq('id', id).single();
        if (error || !data) {
          window.safeGlobalToast({ title: "Erreur", description: "Article non trouvé.", variant: "destructive" });
          navigate('/admin/blog');
        } else {
          setPost({ ...data, tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '') });
        }
      }
    };
    fetchPost();
    // eslint-disable-next-line
  }, [id, isEditing, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newSlug = post.slug;
    if (name === 'title' && !isEditing) { // Auto-generate slug only on creation
        newSlug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    setPost(prev => ({ ...prev, [name]: value, slug: name === 'title' ? newSlug : prev.slug }));
  };
  
  const handleCategoryChange = (value) => {
    setPost(prev => ({ ...prev, category: value }));
  };

  const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          setImageFile(e.target.files[0]);
      }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = post.tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = { ...post, tags: tagsArray };
      let result;
      if (isEditing) {
        result = await supabase.from('blog').update(payload).eq('id', id);
      } else {
        result = await supabase.from('blog').insert([payload]);
      }
      if (result.error) throw result.error;
      window.safeGlobalToast({
        title: `Article ${isEditing ? 'modifié' : 'créé'} avec succès !`,
        description: "Les modifications ont été enregistrées.",
      });
      navigate('/admin/blog');
    } catch (err) {
      window.safeGlobalToast({
        title: "Erreur lors de l'enregistrement",
        description: err.message,
        variant: "destructive",
      });
    }
  };

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
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
             <Card>
                <CardHeader><CardTitle>Organisation</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" name="slug" value={post.slug} onChange={handleChange} required placeholder="ex: mon-nouvel-article" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select onValueChange={handleCategoryChange} value={post.category}>
                            <SelectTrigger id="category"><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                            <SelectContent>
                                {blogCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                        <Input id="tags" name="tags" value={post.tags} onChange={handleChange} />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Image de couverture</CardTitle></CardHeader>
                <CardContent>
                     <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center mb-4">
                        {imageFile ? (
                           <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-full w-full object-cover rounded-lg"/>
                        ) : (
                           <ImageIcon className="h-16 w-16 text-muted-foreground"/>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image-upload" className="w-full cursor-pointer">
                            <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4 text-sm text-center text-muted-foreground hover:bg-muted/50">
                                <UploadCloud className="h-5 w-5 mr-2"/>
                                <span>{imageFile ? imageFile.name : "Cliquer pour choisir une image"}</span>
                            </div>
                        </Label>
                        <Input id="image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*"/>
                    </div>
                </CardContent>
            </Card>
        </div>
       </div>
        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg">
            <Save className="mr-2 h-4 w-4" /> Enregistrer
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminBlogFormPage;
