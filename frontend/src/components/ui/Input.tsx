import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'placeholder-gray-500 text-sm',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
