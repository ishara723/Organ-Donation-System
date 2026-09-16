import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase';
  
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    danger: 'bg-red-50 text-red-600 border border-red-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-rose-50 text-rose-700 border border-rose-200',
    secondary: 'bg-slate-100 text-slate-600 border border-slate-200',
  };

  // Map common states to variants
  const getVariant = (val) => {
    if (!val) return variants.info;
    const str = val.toString().toUpperCase();
    
    if (['GRANTED', 'VERIFIED', 'COMPLETED', 'APPROVED', 'ACTIVE', 'YES', 'HIGH'].includes(str)) return variants.success;
    if (['CRITICAL', 'URGENT', 'REVOKED', 'DENIED', 'REJECTED', 'INACTIVE', 'NO'].includes(str)) return variants.danger;
    if (['PENDING', 'UNDER_REVIEW', 'WARNING', 'MEDIUM'].includes(str)) return variants.warning;
    if (['MATCHED', 'STABLE', 'LOW'].includes(str)) return variants.info;
    
    return variants[variant] || variants.secondary;
  };

  const selectedVariant = getVariant(children || variant);

  return (
    <span className={`${baseStyles} ${selectedVariant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
