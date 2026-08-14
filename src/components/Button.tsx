import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: ButtonVariant
  /** Control the padding and font size. */
  size?: ButtonSize
  /** Content rendered inside the button. */
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-700',
  secondary:
    'bg-white text-neutral-900 ring-1 ring-neutral-300 ring-inset hover:bg-neutral-100',
}

/*
 * Sizes use the Figma spacing scale, where the step number is the pixel value:
 * `h-32` resolves to var(--spacing-32). Tailwind's built-in multiplier scale
 * (where `h-8` means 8 * 0.25rem) does not apply to steps the token layer
 * names, so the two numbering schemes must never be mixed — see
 * src/tokens/spacing.tokens.css.
 */
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-32 px-12 text-sm',
  md: 'h-40 px-16 text-sm',
  lg: 'h-48 px-24 text-base',
}

/** A basic button used to verify the Tailwind + Storybook setup. */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
