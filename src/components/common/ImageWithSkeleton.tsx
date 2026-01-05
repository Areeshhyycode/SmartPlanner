import { useState } from 'react';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

function ImageWithSkeleton({
  src,
  alt,
  className = '',
  skeletonClassName = '',
  onError,
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  return (
    <div className="relative w-full h-full">
      {/* Skeleton Loader */}
      {isLoading && (
        <div
          className={`absolute inset-0 bg-dark-elevated animate-pulse ${skeletonClassName}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-dark-hover to-transparent animate-shimmer" />
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />

      {/* Error State */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 bg-dark-elevated flex items-center justify-center">
          <div className="text-center text-text-muted">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Image not available</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default ImageWithSkeleton;
