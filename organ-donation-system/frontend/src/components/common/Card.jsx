import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-rose-100 ${
        hoverable ? 'hover:shadow-md hover:border-rose-200 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-rose-100/70 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="px-6 py-5 text-slate-700">{children}</div>
    </div>
  );
};

export default Card;
