import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContextFixed';
import { supabase } from '@/lib/customSupabaseClient';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Download
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VendorVerificationPage = () => {
  const { profile } = useSupabaseAuth();
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [FileTexts, setFileTexts] = useState([]);
  const [loading, setLoading] = useState(true);

  const requiredFileTexts = [
    {
      id: 'identity',
      name: 'Pièce d\'identité',
      description: 'Carte d\'identité nationale ou passeport',
      required: true
    },
    {
      id: 'proof_address',
      name: 'Justificatif de domicile',
      description: 'Facture récente (eau, électricité, téléphone)',
      required: true
    },
    {
      id: 'property_titles',
      name: 'Titres de propriété',
      description: 'FileTexts prouvant la propriété des biens à vendre',
      required: true
    },
    {
      id: 'tax_certificate',
      name: 'Certificat fiscal',
      description: 'Attestation de situation fiscale',
      required: false
    }
  ];

  useEffect(() => {
    if (profile) {
      fetchVerificationData();
    }
  }, [profile]);

  const fetchVerificationData = async () => {
    try {
      // Simuler les données pour le moment
      setVerificationStatus(profile?.verification_status || 'pending');
      setFileTexts([
        {
          id: 'identity',
          status: 'approved',
          uploadedAt: '2024-09-01',
          filename: 'carte-identite.pdf'
        },
        {
          id: 'proof_address',
          status: 'pending',
          uploadedAt: '2024-09-02',
          filename: 'facture-eau.pdf'
        },
        {
          id: 'property_titles',
          status: 'rejected',
          uploadedAt: '2024-09-01',
          filename: 'titre-propriete.pdf',
          rejectionReason: 'FileText illisible, veuillez soumettre une version de meilleure qualité'
        }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      missing: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      approved: 'Approuvé',
      rejected: 'Rejeté',
      pending: 'En attente',
      missing: 'Non soumis'
    };

    return (
      <Badge className={variants[status] || variants.missing}>
        {labels[status] || labels.missing}
      </Badge>
    );
  };

  const calculateProgress = () => {
    const approved = FileTexts.filter(doc => doc.status === 'approved').length;
    const required = requiredFileTexts.filter(doc => doc.required).length;
    return Math.round((approved / required) * 100);
  };

  const handleFileUpload = (FileTextId) => {
    // Simulation d'upload
    alert(`Upload de FileText pour ${FileTextId} - Fonctionnalité en développement`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vérification des FileTexts</h1>
        <p className="text-gray-600 mt-2">
          Soumettez vos FileTexts pour validation et commencez à vendre vos biens
        </p>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Statut de Vérification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm text-gray-500">{calculateProgress()}% complété</span>
            </div>
            <Progress value={calculateProgress()} className="w-full" />
            
            <div className="flex items-center gap-2">
              {getStatusIcon(verificationStatus)}
              <span className="text-sm">
                {verificationStatus === 'approved' && 'Votre compte est vérifié'}
                {verificationStatus === 'pending' && 'Vérification en cours...'}
                {verificationStatus === 'rejected' && 'Vérification rejetée'}
              </span>
              {getStatusBadge(verificationStatus)}
            </div>

            {verificationStatus === 'pending' && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Vos FileTexts sont en cours de vérification. Ce processus peut prendre 2-3 jours ouvrables.
                </AlertDescription>
              </Alert>
            )}

            {verificationStatus === 'rejected' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Certains FileTexts ont été rejetés. Veuillez les corriger et les soumettre à nouveau.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* FileTexts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">FileTexts Requis</h2>
        
        {requiredFileTexts.map((requiredDoc) => {
          const uploadedDoc = FileTexts.find(doc => doc.id === requiredDoc.id);
          
          return (
            <Card key={requiredDoc.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(uploadedDoc?.status)}
                      <h3 className="font-medium">{requiredDoc.name}</h3>
                      {requiredDoc.required && (
                        <Badge variant="outline" className="text-xs">Obligatoire</Badge>
                      )}
                      {getStatusBadge(uploadedDoc?.status || 'missing')}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {requiredDoc.description}
                    </p>

                    {uploadedDoc && (
                      <div className="text-sm text-gray-500">
                        <p>Fichier: {uploadedDoc.filename}</p>
                        <p>Soumis le: {new Date(uploadedDoc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    )}

                    {uploadedDoc?.status === 'rejected' && uploadedDoc.rejectionReason && (
                      <Alert variant="destructive" className="mt-3">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Raison du rejet:</strong> {uploadedDoc.rejectionReason}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {!uploadedDoc || uploadedDoc.status === 'rejected' ? (
                      <Button 
                        onClick={() => handleFileUpload(requiredDoc.id)}
                        className="w-32"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadedDoc ? 'Remplacer' : 'Uploader'}
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Aide et Support</CardTitle>
          <CardDescription>
            Besoin d'aide pour la vérification de vos FileTexts ?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Format acceptés</h4>
              <p className="text-sm text-gray-600">PDF, JPG, PNG (taille maximale: 5MB)</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Conseils</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Assurez-vous que tous les FileTexts sont lisibles</li>
                <li>• Les photos doivent être nettes et bien éclairées</li>
                <li>• Tous les textes doivent être visibles</li>
                <li>• Les FileTexts doivent être récents (moins de 3 mois)</li>
              </ul>
            </div>
            <Button variant="outline">
              Contacter le Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorVerificationPage;

