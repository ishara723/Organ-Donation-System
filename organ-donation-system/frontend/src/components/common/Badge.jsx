import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase';
  
  const variants = {
    success: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    info: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    secondary: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
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
