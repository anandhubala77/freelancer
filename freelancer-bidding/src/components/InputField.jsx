import React from 'react';

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-blueeclipse-700">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full p-2 border border-blueeclipse-700 rounded-md shadow-sm focus:ring-blueeclipse-100 focus:border-blueeclipse-100"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full p-2 border border-blueeclipse-700 rounded-md shadow-sm focus:ring-blueeclipse-100 focus:border-blueeclipse-100"
        />
      )}
    </div>
  );
};

export default InputField;
