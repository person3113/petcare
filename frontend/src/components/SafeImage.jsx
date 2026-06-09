import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';

function SafeImage({ images, alt, className, layout = 'fill' }) {
  const validImages = Array.from(new Set(Array.isArray(images) ? images.filter(Boolean) : (images ? [images] : [])));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleError = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const hasMoreImages = currentIndex < validImages.length;
  const currentSrc = validImages[currentIndex];

  if (!hasMoreImages) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 ${className || 'w-full h-full'}`}>
        <PawPrint className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs font-medium">사진 없음</span>
      </div>
    );
  }

  return (
    <img
      key={currentSrc}
      src={currentSrc}
      alt={alt || '이미지'}
      className={className || 'w-full h-full object-cover'}
      onError={handleError}
      loading="lazy"
    />
  );
}

export default SafeImage;
