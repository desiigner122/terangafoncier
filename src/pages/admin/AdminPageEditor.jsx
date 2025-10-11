/**
 * ========================================
 * AdminPageEditor - Éditeur pages CMS
 * ========================================
 * Date: 10 Octobre 2025
 * Fonctionnalités: Builder blocs, Preview, SEO, Publication
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminCMS } from '@/hooks/admin';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Type,
  List,
  MessageSquare,
  DollarSign,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BLOCK_TYPES = [
  { 
    id: 'hero', 
    label: 'Hero Section', 
    icon: ImageIcon,
    defaultContent: {
      title: 'Titre Principal',
      subtitle: 'Sous-titre descriptif',
      cta_text: 'En savoir plus',
      cta_link: '#',
      background_image: ''
    }
  },
  { 
    id: 'features', 
    label: 'Features', 
    icon: List,
    defaultContent: {
      title: 'Nos Fonctionnalités',
      items: [
        { title: 'Feature 1', description: 'Description', icon: 'check' },
        { title: 'Feature 2', description: 'Description', icon: 'check' },
        { title: 'Feature 3', description: 'Description', icon: 'check' }
      ]
    }
  },
  { 
    id: 'cta', 
    label: 'Call to Action', 
    icon: MessageSquare,
    defaultContent: {
      title: 'Prêt à commencer ?',
      description: 'Rejoignez-nous dès aujourd\'hui',
      button_text: 'Démarrer',
      button_link: '/register'
    }
  },
  { 
    id: 'pricing', 
    label: 'Pricing', 
    icon: DollarSign,
    defaultContent: {
      title: 'Nos Tarifs',
      plans: [
        { name: 'Basic', price: '0', features: ['Feature 1', 'Feature 2'] },
        { name: 'Pro', price: '9.99', features: ['Feature 1', 'Feature 2', 'Feature 3'] }
      ]
    }
  },
  { 
    id: 'faq', 
    label: 'FAQ', 
    icon: HelpCircle,
    defaultContent: {
      title: 'Questions Fréquentes',
      questions: [
        { question: 'Question 1 ?', answer: 'Réponse 1' },
        { question: 'Question 2 ?', answer: 'Réponse 2' }
      ]
    }
  },
  { 
    id: 'text', 
    label: 'Texte Libre', 
    icon: Type,
    defaultContent: {
      content: '<p>Votre contenu ici...</p>'
    }
  }
];

const AdminPageEditor = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { 
    loadPageBySlug, 
    createPage, 
    updatePage, 
    publishPage,
    loadSections,
    createSection,
    updateSection,
    deleteSection
  } = useAdminCMS();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // État page
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'draft'
  });

  // État SEO
  const [seoMeta, setSeoMeta] = useState({
    title: '',
    description: '',
    keywords: [],
    og_image: ''
  });

  // État sections
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState('content');

  // Charger page existante
  useEffect(() => {
    if (pageId && pageId !== 'new') {
      loadExistingPage();
    }
  }, [pageId]);

  const loadExistingPage = async () => {
    setLoading(true);
    
    const result = await loadPageBySlug(pageId); // TODO: adapter pour ID
    
    if (result.success) {
      const page = result.page;
      setPageData({
        title: page.title,
        slug: page.slug,
        description: page.description || '',
        status: page.status
      });
      setSeoMeta(page.seo_meta || seoMeta);
      
      // Charger sections
      const sectionsResult = await loadSections(page.id);
      if (sectionsResult.success) {
        setSections(sectionsResult.sections);
      }
    } else {
      toast.error("Page introuvable");
      navigate('/admin/cms/pages');
    }
    
    setLoading(false);
  };

  // Générer slug depuis titre
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Ajouter section
  const addSection = (blockType) => {
    const block = BLOCK_TYPES.find(b => b.id === blockType);
    const newSection = {
      id: `temp-${Date.now()}`,
      key: blockType,
      content: block.defaultContent,
      order_index: sections.length
    };
    setSections([...sections, newSection]);
  };

  // Supprimer section
  const removeSection = (sectionId) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  // Mettre à jour section
  const updateSectionContent = (sectionId, newContent) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, content: newContent } : s
    ));
  };

  // Sauvegarder
  const handleSave = async () => {
    if (!pageData.title || !pageData.slug) {
      toast.error("Titre et slug sont obligatoires");
      return;
    }

    setSaving(true);

    try {
      let pageResult;
      
      if (pageId === 'new') {
        // Créer nouvelle page
        pageResult = await createPage({
          title: pageData.title,
          slug: pageData.slug,
          description: pageData.description,
          content: { sections: sections.map(s => s.key) },
          seo_meta: seoMeta
        });
      } else {
        // Mettre à jour page existante
        pageResult = await updatePage(pageId, {
          title: pageData.title,
          slug: pageData.slug,
          description: pageData.description,
          seo_meta: seoMeta
        });
      }

      if (pageResult.success) {
        const savedPageId = pageResult.page.id;

        // Sauvegarder sections
        for (const section of sections) {
          if (section.id.startsWith('temp-')) {
            // Nouvelle section
            await createSection({
              page_id: savedPageId,
              key: section.key,
              content: section.content,
              order_index: section.order_index
            });
          } else {
            // Section existante
            await updateSection(section.id, {
              content: section.content,
              order_index: section.order_index
            });
          }
        }

        toast.success("Page sauvegardée avec succès");

        if (pageId === 'new') {
          navigate(`/admin/cms/pages/${savedPageId}/edit`);
        }
      } else {
        throw new Error(pageResult.error);
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    }

    setSaving(false);
  };

  // Publier
  const handlePublish = async () => {
    await handleSave();
    
    const result = await publishPage(pageId);
    
    if (result.success) {
      toast.success("Page publiée avec succès");
      setPageData({ ...pageData, status: 'published' });
    } else {
      toast.error(result.error || "Erreur lors de la publication");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/cms/pages')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {pageId === 'new' ? 'Nouvelle Page' : pageData.title}
                </h1>
                {pageData.slug && (
                  <p className="text-sm text-gray-500">/{pageData.slug}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled
              >
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500 mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Sauvegarder
              </Button>
              {pageData.status === 'draft' && (
                <Button
                  size="sm"
                  onClick={handlePublish}
                  disabled={saving}
                >
                  Publier
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Onglet Contenu */}
          <TabsContent value="content" className="space-y-6">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={pageData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setPageData({ 
                        ...pageData, 
                        title,
                        slug: pageId === 'new' ? generateSlug(title) : pageData.slug
                      });
                    }}
                    placeholder="Titre de la page"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    value={pageData.slug}
                    onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
                    placeholder="mon-slug-url"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /{pageData.slug}
                  </p>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={pageData.description}
                    onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
                    placeholder="Description courte de la page"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sections */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sections de contenu</CardTitle>
                  <div className="flex gap-2">
                    {BLOCK_TYPES.map(block => {
                      const Icon = block.icon;
                      return (
                        <Button
                          key={block.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addSection(block.id)}
                          title={block.label}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {block.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      Aucune section. Ajoutez un bloc ci-dessus.
                    </p>
                  </div>
                ) : (
                  sections.map((section, index) => (
                    <div
                      key={section.id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                          <span className="font-medium text-gray-900 capitalize">
                            {section.key}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Textarea
                          value={JSON.stringify(section.content, null, 2)}
                          onChange={(e) => {
                            try {
                              const newContent = JSON.parse(e.target.value);
                              updateSectionContent(section.id, newContent);
                            } catch (error) {
                              // Invalid JSON, ignore
                            }
                          }}
                          rows={8}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet SEO */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Métadonnées SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seo-title">Titre SEO</Label>
                  <Input
                    id="seo-title"
                    value={seoMeta.title}
                    onChange={(e) => setSeoMeta({ ...seoMeta, title: e.target.value })}
                    placeholder={pageData.title || "Titre pour moteurs de recherche"}
                  />
                </div>
                <div>
                  <Label htmlFor="seo-description">Description SEO</Label>
                  <Textarea
                    id="seo-description"
                    value={seoMeta.description}
                    onChange={(e) => setSeoMeta({ ...seoMeta, description: e.target.value })}
                    placeholder="Description pour moteurs de recherche (150-160 caractères)"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoMeta.description.length} / 160 caractères
                  </p>
                </div>
                <div>
                  <Label htmlFor="og-image">Image OpenGraph</Label>
                  <Input
                    id="og-image"
                    value={seoMeta.og_image}
                    onChange={(e) => setSeoMeta({ ...seoMeta, og_image: e.target.value })}
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPageEditor;
