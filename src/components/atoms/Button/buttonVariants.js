import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-white hover:bg-destructive/90',
                outline: 'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                small: 'h-9 px-4 text-sm',
                medium: 'h-11 px-6 py-2 text-sm',
                large: 'h-12 px-8 text-base',
                default: 'h-11 px-6 py-2 text-sm',
                sm: 'h-9 px-4 text-sm',
                lg: 'h-12 px-8 text-base',
                icon: 'h-11 w-11',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'medium',
        },
    },
)