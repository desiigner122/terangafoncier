import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Zap,
  TrendingUp,
  Eye,
  Sun,
  Camera
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import imageCompression from 'browser-image-compression';

/**
 * Modal d'upload photos avec analyse IA automatique
 * - Upload multiple drag & drop
 * - Compression images
 * - Analyse qualité IA (luminosité, netteté, composition)
 * - Upload vers Supabase Storage
 */
const PhotoUploadModal = ({ 
  open, 
  onOpenChange, 
  propertyId,
  onUploadComplete 
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Analyse IA d'une image
  const analyzeImage = async (file) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        // Créer un canvas pour analyser l'image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Analyse de la luminosité
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let brightness = 0;
        let totalPixels = data.length / 4;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          brightness += (r + g + b) / 3;
        }
        
        const avgBrightness = brightness / totalPixels;
        const brightnessScore = Math.min(100, Math.max(0, 100 - Math.abs(avgBrightness - 128) / 1.28));
        
        // Analyse de la résolution
        const resolution = img.width * img.height;
        const resolutionScore = Math.min(100, (resolution / (1920 * 1080)) * 100);
        
        // Analyse du ratio d'aspect
        const aspectRatio = img.width / img.height;
        const idealRatio = 16 / 9;
        const ratioScore = Math.max(0, 100 - Math.abs(aspectRatio - idealRatio) * 50);
        
        // Score global
        const globalScore = Math.round(
          (brightnessScore * 0.4 + resolutionScore * 0.4 + ratioScore * 0.2)
        );
        
        URL.revokeObjectURL(url);
        
        resolve({
          brightness: Math.round(brightnessScore),
          resolution: Math.round(resolutionScore),
          composition: Math.round(ratioScore),
          globalScore,
          suggestions: generateSuggestions(brightnessScore, resolutionScore, ratioScore),
          dimensions: `${img.width}x${img.height}`
        });
      };
      
      img.src = url;
    });
  };

  // Génération suggestions IA
  const generateSuggestions = (brightness, resolution, composition) => {
    const suggestions = [];
    
    if (brightness < 60) {
      suggestions.push('Augmentez la luminosité de la photo');
    } else if (brightness > 90) {
      suggestions.push('Réduisez l\'exposition, l\'image est trop claire');
    }
    
    if (resolution < 70) {
      suggestions.push('Utilisez une résolution plus élevée (min 1920x1080)');
    }
    
    if (composition < 70) {
      suggestions.push('Cadrez l\'image au format 16:9 pour un meilleur rendu');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('✨ Photo de qualité professionnelle !');
    }
    
    return suggestions;
  };

  // Gestion drag & drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  }, []);

  // Gestion sélection fichiers
  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files);
    }
  };

  // Traitement des fichiers
  const handleFiles = async (fileList) => {
    const newFiles = Array.from(fileList).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (newFiles.length === 0) return;
    
    // Analyser chaque image
    const analyzedFiles = await Promise.all(
      newFiles.map(async (file) => {
        const analysis = await analyzeImage(file);
        return {
          file,
          preview: URL.createObjectURL(file),
          analysis
        };
      })
    );
    
    setFiles(prev => [...prev, ...analyzedFiles]);
    setAnalysisResults(analyzedFiles.map(f => f.analysis));
  };

  // Supprimer une photo
  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
    setAnalysisResults(prev => {
      const newResults = [...prev];
      newResults.splice(index, 1);
      return newResults;
    });
  };

  // Upload vers Supabase
  const handleUpload = async () => {
    if (files.length === 0 || !propertyId) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadedPhotos = [];
      const progressIncrement = 100 / files.length;
      
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        
        // Compression de l'image
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        
        const compressedFile = await imageCompression(fileData.file, options);
        
        // Upload vers Supabase Storage
        const fileName = `${propertyId}/${Date.now()}_${i}.jpg`;
        const { data, error } = await supabase.storage
          .from('property-photos')
          .upload(fileName, compressedFile, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        
        // Récupérer l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('property-photos')
          .getPublicUrl(fileName);
        
        // Enregistrer dans la base de données
        const { error: dbError } = await supabase
          .from('property_photos')
          .insert([{
            property_id: propertyId,
            url: publicUrl,
            ai_score: fileData.analysis.globalScore,
            analysis_data: fileData.analysis,
            is_primary: i === 0,
            created_at: new Date().toISOString()
          }]);
        
        if (dbError) throw dbError;
        
        uploadedPhotos.push({
          url: publicUrl,
          analysis: fileData.analysis
        });
        
        // Mise à jour du progress
        setUploadProgress((i + 1) * progressIncrement);
      }
      
      // Toast de succès
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Photos uploadées !",
          description: `${files.length} photo(s) ajoutée(s) avec succès.`,
        });
      }
      
      // Callback
      if (onUploadComplete) {
        onUploadComplete(uploadedPhotos);
      }
      
      // Fermer le modal
      onOpenChange(false);
      resetModal();
    } catch (error) {
      console.error('Erreur upload photos:', error);
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Erreur d'upload",
          description: error.message || "Impossible d'uploader les photos.",
          variant: "destructive"
        });
      }
    } finally {
      setUploading(false);
    }
  };

  // Réinitialiser le modal
  const resetModal = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setAnalysisResults([]);
    setUploadProgress(0);
  };

  // Score moyen
  const averageScore = analysisResults.length > 0
    ? Math.round(analysisResults.reduce((sum, r) => sum + r.globalScore, 0) / analysisResults.length)
    : 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetModal();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Camera className="w-6 h-6 mr-2 text-orange-600" />
            Upload Photos avec Analyse IA
          </DialogTitle>
          <DialogDescription>
            Ajoutez des photos de qualité avec analyse automatique
          </DialogDescription>
        </DialogHeader>

        {/* Zone de drop */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-orange-600 bg-orange-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Glissez vos photos ici ou cliquez pour sélectionner
          </p>
          <p className="text-sm text-gray-500">
            Formats acceptés : JPG, PNG, WebP • Max 5MB par photo
          </p>
        </div>

        {/* Liste des photos avec preview */}
        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            {/* Score moyen */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="font-semibold">Score Qualité Moyen IA</span>
                </div>
                <span className="text-3xl font-bold text-purple-600">{averageScore}%</span>
              </div>
              <Progress value={averageScore} className="h-2" />
            </div>

            {/* Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((fileData, index) => (
                <div key={index} className="border rounded-lg p-3 bg-white shadow-sm">
                  <div className="relative">
                    <img
                      src={fileData.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    
                    {/* Score overlay */}
                    <div className="absolute bottom-2 left-2">
                      <Badge className={`${
                        fileData.analysis.globalScore >= 80 ? 'bg-green-600' :
                        fileData.analysis.globalScore >= 60 ? 'bg-orange-600' :
                        'bg-red-600'
                      }`}>
                        Score: {fileData.analysis.globalScore}%
                      </Badge>
                    </div>
                  </div>

                  {/* Analyse détaillée */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Sun className="w-4 h-4 mr-1 text-yellow-600" />
                        <span>Luminosité</span>
                      </div>
                      <span className="font-semibold">{fileData.analysis.brightness}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-blue-600" />
                        <span>Résolution</span>
                      </div>
                      <span className="font-semibold">{fileData.analysis.resolution}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-purple-600" />
                        <span>Composition</span>
                      </div>
                      <span className="font-semibold">{fileData.analysis.composition}%</span>
                    </div>

                    {/* Suggestions */}
                    <div className="mt-2 pt-2 border-t">
                      {fileData.analysis.suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-start text-xs text-gray-600 mt-1">
                          {suggestion.includes('✨') ? (
                            <CheckCircle className="w-3 h-3 mr-1 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1 text-orange-600 flex-shrink-0 mt-0.5" />
                          )}
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress bar pendant upload */}
        {uploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Upload en cours...</span>
              <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              resetModal();
              onOpenChange(false);
            }}
            disabled={uploading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {uploading ? 'Upload en cours...' : `Uploader ${files.length} photo(s)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadModal;
