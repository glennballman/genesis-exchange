import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-slate-800/50 border border-slate-700/80 rounded-lg p-5 shadow-lg flex flex-col justify-start transition-all duration-300 hover:border-slate-600 hover:bg-slate-800 hover:shadow-cyan-500/5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
