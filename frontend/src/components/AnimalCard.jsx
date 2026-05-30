import React from 'react';
import { Link } from 'react-router-dom';

function AnimalCard({ animal, to }) {
  const image = animal?.images?.[0];
  const linkTo = to || (animal?.id ? `/animal/${animal.id}` : '#');

  return (
    <Link to={linkTo} className="block">
      <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="aspect-[4/3] w-full bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={animal.kind}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
              사진 없음
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm text-gray-500">{animal.kind}</p>
              <p className="text-lg font-semibold text-gray-900">
                {animal.shelterName}
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              {animal.status}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p>성별: {animal.gender}</p>
            <p>나이: {animal.age}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default AnimalCard;
