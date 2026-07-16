import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder = '',
  required = false,
  options = [], // For select fields: [{ value, label }]
  className = '',
  rows = 3, // For textareas
  ...props
}) => {
  const inputBaseStyles = 'w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200';
  const errorStyles = 'border-red-500 focus:ring-red-500/50 focus:border-red-500';

  return (
    <div className={`mb-4 text-left ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${inputBaseStyles} ${error ? errorStyles : ''}`}
          required={required}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={`${inputBaseStyles} ${error ? errorStyles : ''}`}
          required={required}
          {...props}
        />
      ) : type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            type="checkbox"
            name={name}
            checked={!!value}
            onChange={onChange}
            className="h-4.5 w-4.5 rounded border-slate-700 bg-slate-900 text-teal-600 focus:ring-teal-500/50 focus:ring-offset-slate-900 focus:ring-2"
            required={required}
            {...props}
          />
          {label && (
            <span className="ml-2.5 text-sm text-slate-300 font-medium cursor-pointer select-none">
              {label}
            </span>
          )}
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${inputBaseStyles} ${error ? errorStyles : ''}`}
          required={required}
          {...props}
        />
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
