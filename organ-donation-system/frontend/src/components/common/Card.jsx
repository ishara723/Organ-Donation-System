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
      className={`glass-panel rounded-xl overflow-hidden shadow-lg border border-slate-800 ${
        hoverable ? 'glass-panel-hover' : ''
      } ${className}`}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
};

export default Card;
