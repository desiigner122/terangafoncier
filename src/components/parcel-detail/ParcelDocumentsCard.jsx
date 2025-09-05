import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText
} from 'lucide-react';

const getFileTextStatusVariant = (status) => {
  switch (status) {
    case 'Vérifié': return 'success';
    case 'En attente': return 'warning';
    case 'Info Manquante': return 'destructive';
    default: return 'secondary';
  }
};

const getFileTextStatusIcon = (status) => {
  switch (status) {
    case 'Vérifié': return <CheckCircle className="h-4 w-4 mr-1.5 text-green-600" />;
    case 'En attente': return <Clock className="h-4 w-4 mr-1.5 text-yellow-600" />;
    case 'Info Manquante': return <AlertCircle className="h-4 w-4 mr-1.5 text-red-600" />;
    default: return <FileText className="h-4 w-4 mr-1.5" />;
  }
};

const ParcelFileTextsCard = ({ FileTexts = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FileTexts Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        {FileTexts.length > 0 ? (
          <ul className="space-y-3">
            {FileTexts.map((doc, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <span className="flex items-center font-medium">
                  {getFileTextStatusIcon(doc.status)}
                  {doc.name} {/* Corrected: Render doc.name, not the object */}
                </span>
                <Badge variant={getFileTextStatusVariant(doc.status)}>{doc.status}</Badge> {/* Corrected: Render doc.status, not the object */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun FileText spécifique listé pour cette parcelle.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ParcelFileTextsCard;