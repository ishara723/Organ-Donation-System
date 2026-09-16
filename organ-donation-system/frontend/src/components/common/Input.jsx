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
  const inputBaseStyles = 'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 transition-all duration-200 shadow-xs';
  const errorStyles = 'border-rose-500 focus:ring-rose-400 focus:border-rose-500';

  return (
    <div className={`mb-4 text-left ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
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
            <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
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
            className="h-4.5 w-4.5 rounded border-slate-300 text-rose-600 focus:ring-rose-400 focus:ring-2"
            required={required}
            {...props}
          />
          {label && (
            <span className="ml-2.5 text-sm text-slate-700 font-medium cursor-pointer select-none">
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
