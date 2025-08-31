import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

const ParcelImageGallery = ({ images = [], parcelName }) => {
  const defaultImage = "https://images.unsplash.com/photo-1542364041-2cada653f4ee";
  const galleryImages = images && images.length > 0 ? images : [defaultImage];
  const [mainImage, setMainImage] = useState(galleryImages[0]);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-video bg-muted group relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={mainImage}
              src={mainImage}
              alt={`Image principale pour ${parcelName}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        {galleryImages.length > 1 && (
          <div className="p-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 border-t">
            {galleryImages.slice(0, 5).map((image, index) => (
              <div
                key={index}
                className={`aspect-square bg-muted rounded overflow-hidden cursor-pointer ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:opacity-90 transition-opacity ${mainImage === image ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleThumbnailClick(image)}
              >
                <img
                  className="w-full h-full object-cover"
                  alt={`Image miniature ${index + 1} pour ${parcelName}`}
                  src={image}
                />
              </div>
            ))}
            {galleryImages.length > 6 && (
              <div className="aspect-square bg-muted/50 rounded flex items-center justify-center text-xs text-muted-foreground border border-dashed">
                +{galleryImages.length - 5}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParcelImageGallery;