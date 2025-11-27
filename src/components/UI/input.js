'use client';

import { useState } from "react";

export default function Input ({
  label,
  id,
  type = 'text',
  value,
  onchange,
  className,
  icon,
  ...props
}) {

  const [isFocused, setIsFocused] = useState(false);
  const inputValue = value || '';

  const shouldFloat = isFocused || inputValue.length > 0;

  return (
    <>
      <div className="relative text-base pt-5 mb-1">

        <input
          id={id}
          type={type}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`border-none appearance-none bg-gray-100 p-3 rounded-md w-full min-w-64 outline-none text-sm ${className || ''}`}
          {...props}
        />

        <label 
          htmlFor={id}
          className={`
            absolute left-3 cursor-pointer transition-all duration-300 ease-in-out
            ${shouldFloat
              ? 'top-0 left-3 text-xs text-gray-800'
              : 'top-3/5 text-gray-500 transform -translate-y-1/2'
            }
          `}
        >
          {icon && <i>{icon}</i>}
          {label}
        </label>
      </div>
    </>
  )
};