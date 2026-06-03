import React from 'react';
import { Link } from 'react-router-dom';
import AnimalCardContent from './AnimalCardContent';

function AnimalCard({ animal, to }) {
  const image = animal?.images?.[0];
  const linkTo = to || (animal?.id ? `/animal/${animal.id}` : '#');

  return (
    <Link to={linkTo} className="block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-transform hover:-translate-y-1">
        <div className="relative aspect-square w-full shrink-0 bg-gray-100">
          {image ? (
            <>
              <div className="absolute inset-0 animate-pulse bg-gray-200"></div>
              <img
                src={image}
                alt={animal.kind}
                loading="lazy"
                className="absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-300"
                onLoad={(e) => {
                  e.target.previousSibling.style.display = 'none';
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              사진 없음
            </div>
          )}
        </div>
        <AnimalCardContent animal={animal} variant="list" />
      </article>
    </Link>
  );
}

export default AnimalCard;
