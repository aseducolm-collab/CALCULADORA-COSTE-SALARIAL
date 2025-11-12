
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, title }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      {title && <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
