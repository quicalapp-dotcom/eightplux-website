import { clsx } from 'clsx';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={clsx(
                        'w-full bg-transparent border-b border-gray-300 dark:border-gray-700 px-0 py-3',
                        'focus:outline-none focus:border-black dark:focus:border-white transition-colors',
                        'placeholder:text-gray-400 text-sm',
                        error && 'border-red-500 focus:border-red-500',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
