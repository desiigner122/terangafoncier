
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
// useToast import supprimé - utilisation window.safeGlobalToast
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  UploadCloud, 
  File, 
  ShieldCheck, 
  Building, 
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const FileUploadField = ({ id, label, required, onFileChange, fileName, description }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>{label}</Label>
    <div className="flex items-center justify-center w-full">
      <label htmlFor={id} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {fileName ? (
            <>
              <File className="w-8 h-8 mb-2 text-primary" />
              <p className="text-sm text-foreground font-semibold truncate max-w-xs">{fileName}</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Cliquez pour téléverser</span></p>
            </>
          )}
          <p className="text-xs text-muted-foreground">{description || 'PDF, PNG, JPG (MAX. 5MB)'}</p>
        </div>
        <Input id={id} type="file" className="hidden" onChange={onFileChange} required={required} />
      </label>
    </div>
  </div>
);

const VerificationPage = () => {
  const { user, revalidate } = useAuth();
  // toast remplacé par window.safeGlobalToast
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState({
    idCardFront: null,
    idCardBack: null,
    residenceCert: null,
    companyDocs: null,
  });
  const [isCompany, setIsCompany] = useState(false);

  const handleFileChange = (e) => {
    const { id, files: inputFiles } = e.target;
    if (inputFiles.length > 0) {
      setFiles(prev => ({ ...prev, [id]: inputFiles[0] }));
    }
  };

  const uploadFile = async (file, bucketPath) => {
    const { data, error } = await supabase.storage
      .from('verification-FileTexts')
      .upload(bucketPath, file, {
        cacheControl: '3600',
        upsert: true,
      });
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage.from('verification-FileTexts').getPublicUrl(data.path);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!files.idCardFront || !files.idCardBack) {
      setError("La carte d'identité (recto et verso) est obligatoire.");
      setIsLoading(false);
      return;
    }
    if (user.user_type === 'Vendeur' && !files.residenceCert) {
      setError("Le certificat de résidence est obligatoire pour les vendeurs.");
      setIsLoading(false);
      return;
    }
    
    try {
        const userId = user.id;
        
        const FileTextUploadPromises = [];
        if (files.idCardFront) FileTextUploadPromises.push(uploadFile(files.idCardFront, `${userId}/id_card_front.${files.idCardFront.name.split('.').pop()}`));
        if (files.idCardBack) FileTextUploadPromises.push(uploadFile(files.idCardBack, `${userId}/id_card_back.${files.idCardBack.name.split('.').pop()}`));
        if (files.residenceCert) FileTextUploadPromises.push(uploadFile(files.residenceCert, `${userId}/residence_cert.${files.residenceCert.name.split('.').pop()}`));
        if (isCompany && files.companyDocs) FileTextUploadPromises.push(uploadFile(files.companyDocs, `${userId}/company_docs.${files.companyDocs.name.split('.').pop()}`));

        const uploadedUrls = await Promise.all(FileTextUploadPromises);

        const FileTextPayload = {
            id_card_front: uploadedUrls[0],
            id_card_back: uploadedUrls[1],
            residence_cert: uploadedUrls[2] || null,
            company_docs: (isCompany && uploadedUrls[3]) ? uploadedUrls[3] : null,
        };

        for (const [type, url] of Object.entries(FileTextPayload)) {
            if (url) {
                await supabase.from('FileTexts').insert({
                    user_id: userId,
                    FileText_type: type,
                    file_url: url,
                });
            }
        }

    await supabase.from('users').update({ verification_status: 'pending' }).eq('id', user.id);
        
        await revalidate();

        window.safeGlobalToast({
            title: "FileTexts Soumis",
            description: "Vos FileTexts ont été envoyés pour vérification.",
        });
        navigate('/pending-verification');

    } catch (err) {
        console.error("Verification submission error:", err);
        setError("Une erreur est survenue lors de l'envoi de vos FileTexts. Veuillez réessayer.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const userType = user?.user_type;

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <ShieldCheck className="w-12 h-12 mx-auto text-primary" />
            <CardTitle className="text-2xl font-bold mt-2">Vérification de votre Identité</CardTitle>
            <CardDescription>Pour la sécurité de tous, veuillez nous fournir les FileTexts suivants.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadField id="idCardFront" label="Carte d'Identité (Recto)" required onFileChange={handleFileChange} fileName={files.idCardFront?.name} />
                <FileUploadField id="idCardBack" label="Carte d'Identité (Verso)" required onFileChange={handleFileChange} fileName={files.idCardBack?.name} />
              </div>
              {userType === 'Vendeur' && (
                <>
                  <FileUploadField id="residenceCert" label="Certificat de Résidence" required onFileChange={handleFileChange} fileName={files.residenceCert?.name} description="FileText légalisé." />
                  <div className="flex items-center space-x-2 rounded-md border p-3 bg-muted/30">
                    <input type="checkbox" id="isCompany" checked={isCompany} onChange={(e) => setIsCompany(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                    <Label htmlFor="isCompany" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Je suis une société / agence immobilière
                    </Label>
                  </div>
                  {isCompany && (
                    <motion.div initial={{opacity:0, height: 0}} animate={{opacity:1, height: 'auto'}} transition={{duration: 0.3}}>
                        <FileUploadField id="companyDocs" label="FileTexts de la Société" onFileChange={handleFileChange} fileName={files.companyDocs?.name} description="NINEA, RCCM, etc." />
                    </motion.div>
                  )}
                </>
              )}
               {error && (
                  <div className="flex items-center p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/30">
                     <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0"/>
                     <span>{error}</span>
                  </div>
                )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Envoi en cours...' : 'Soumettre pour Vérification'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerificationPage;





