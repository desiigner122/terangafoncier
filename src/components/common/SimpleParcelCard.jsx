import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Euro } from 'lucide-react';

const SimpleParcelCard = ({ parcel }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={parcel?.image || "/api/placeholder/400/300"} 
          alt={parcel?.title || "Parcelle"}
          className="w-full h-48 object-cover"
        />
        {parcel?.verified && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
            Vérifié
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
          {parcel?.title || "Parcelle disponible"}
        </CardTitle>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {parcel?.location || "Localisation"}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-bold text-blue-600">
              {parcel?.price ? formatPrice(parcel.price) : "Prix sur demande"}
            </p>
            <p className="text-sm text-gray-500">
              {parcel?.surface || "Surface à définir"}
            </p>
          </div>
          {parcel?.rating && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              {parcel.rating}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            Voir détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleParcelCard;
