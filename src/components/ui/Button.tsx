import { clsx } from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    'uppercase tracking-widest font-bold transition-all duration-200',
                    {
                        // Variants
                        'bg-black text-white dark:bg-white dark:text-black hover:opacity-90': variant === 'primary',
                        'bg-white text-black dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900': variant === 'secondary',
                        'border border-black dark:border-white bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black': variant === 'outline',
                        'bg-transparent hover:opacity-70': variant === 'ghost',

                        // Sizes
                        'px-4 py-2 text-[10px]': size === 'sm',
                        'px-6 py-3 text-xs': size === 'md',
                        'px-10 py-4 text-xs': size === 'lg',

                        // Full width
                        'w-full': fullWidth,
                    },
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
