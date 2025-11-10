import React from 'react';
import { StarIcon } from './IconComponents';

interface StarRatingProps {
  rating: number;
  className?: string;
  starClassName?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, className = '', starClassName = 'w-5 h-5' }) => {
  const totalStars = 5;
  
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(totalStars)].map((_, index) => (
        <StarIcon
          key={index}
          className={`${starClassName} ${index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default StarRating;
