import React, { useState } from 'react';

interface DynamicIconPicProps {
  name: string;
  alt: string;
  className?: string;
}

export const DynamicIconPic: React.FC<DynamicIconPicProps> = ({
  name,
  alt,
  className = 'w-full h-full object-cover rounded-xl',
}) => {
  const sources = [
    `/public/src/${name}.png`,
    `/public/src/${name}.jpg`,
    `/icons/${name}.png`,
    `/icons/${name}.jpg`,
    `/icons/${name}.svg`,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <img
      src={sources[currentIndex]}
      alt={alt}
      className={className}
      onError={() => {
        if (currentIndex < sources.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }}
    />
  );
};
