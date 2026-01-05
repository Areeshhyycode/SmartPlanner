import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  coverImage: string;
  tripName: string;
}

function ImageGallery({ images, coverImage, tripName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const allImages = [coverImage, ...images.filter((img) => img !== coverImage)];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden group">
          <img
            src={allImages[selectedIndex]}
            alt={`${tripName} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Zoom Button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 right-4 w-10 h-10 bg-dark-bg/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-dark-bg"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark-bg/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-dark-bg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark-bg/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-dark-bg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-dark-bg/80 backdrop-blur-sm rounded-full text-sm text-text-primary">
            {selectedIndex + 1} / {allImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-blue-500 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-dark-bg/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-dark-card rounded-full flex items-center justify-center text-text-primary hover:bg-dark-elevated transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-dark-card rounded-full flex items-center justify-center text-text-primary hover:bg-dark-elevated transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-dark-card rounded-full flex items-center justify-center text-text-primary hover:bg-dark-elevated transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={allImages[selectedIndex]}
            alt={`${tripName} - Image ${selectedIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-dark-card rounded-full text-text-primary">
            {selectedIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}

export default ImageGallery;
