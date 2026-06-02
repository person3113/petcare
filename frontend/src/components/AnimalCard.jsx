import React from 'react';
import { Link } from 'react-router-dom';

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
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="line-clamp-1 text-sm text-gray-500">{animal.kind}</p>
              <p className="line-clamp-1 text-lg font-semibold text-gray-900">
                {animal.shelterName}
              </p>
            </div>
            {animal.status && (
              <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {animal.status}
              </span>
            )}
          </div>
          <div className="mt-auto text-sm text-gray-600">
            <p>성별: {animal.gender}</p>
            <p>나이: {animal.age}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default AnimalCard;
