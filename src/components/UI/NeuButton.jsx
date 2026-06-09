/**
 * NeuButton Component
 *
 * Neumorphic button with multiple variants:
 * - default: Raised neumorphic style
 * - primary: Gradient accent background
 * - ghost: Minimal outline style
 * - icon: Circular icon button
 *
 * Features hover glow, active press, and focus states.
 */

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const NeuButton = forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'neu-btn--sm',
    md: 'neu-btn--md',
    lg: 'neu-btn--lg',
  };

  const variantClasses = {
    default: '',
    primary: 'neu-btn--primary',
    ghost: 'neu-btn--ghost',
    danger: 'neu-btn--danger',
    icon: 'neu-btn--icon',
  };

  return (
    <motion.button
      ref={ref}
      className={`neu-btn ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'neu-btn--full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="neu-btn__icon">{icon}</span>
      )}
      {variant !== 'icon' && <span className="neu-btn__text">{children}</span>}
      {icon && iconPosition === 'right' && (
        <span className="neu-btn__icon">{icon}</span>
      )}
      {variant === 'icon' && icon}

      <style>{`
        .neu-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--bg-card);
          border: none;
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: var(--font-primary);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
          box-shadow:
            6px 6px 12px var(--neu-shadow-dark),
            -6px -6px 12px var(--neu-shadow-light);
        }

        .neu-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          opacity: 0;
          transition: opacity var(--transition-normal);
        }

        .neu-btn:hover::before {
          opacity: 0.1;
        }

        .neu-btn:hover {
          box-shadow:
            8px 8px 16px var(--neu-shadow-dark),
            -8px -8px 16px var(--neu-shadow-light),
            var(--glow-primary);
        }

        .neu-btn:active {
          box-shadow:
            inset 4px 4px 8px var(--neu-shadow-inset-dark),
            inset -4px -4px 8px var(--neu-shadow-inset-light);
        }

        .neu-btn:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        .neu-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow:
            4px 4px 8px var(--neu-shadow-dark),
            -4px -4px 8px var(--neu-shadow-light);
        }

        /* Sizes */
        .neu-btn--sm {
          padding: 8px 16px;
          font-size: 0.85rem;
        }

        .neu-btn--md {
          padding: 10px 24px;
          font-size: 0.95rem;
        }

        .neu-btn--lg {
          padding: 14px 32px;
          font-size: 1.05rem;
        }

        /* Variants */
        .neu-btn--primary {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-nebula));
          color: white;
          box-shadow:
            6px 6px 12px var(--neu-shadow-dark),
            -6px -6px 12px rgba(124, 58, 237, 0.2);
        }

        .neu-btn--primary:hover {
          box-shadow:
            8px 8px 16px var(--neu-shadow-dark),
            -8px -8px 16px rgba(124, 58, 237, 0.3),
            0 0 30px rgba(124, 58, 237, 0.4);
        }

        .neu-btn--ghost {
          background: transparent;
          box-shadow: none;
          border: 1px solid var(--bg-tertiary);
        }

        .neu-btn--ghost:hover {
          background: var(--bg-card);
          box-shadow:
            4px 4px 8px var(--neu-shadow-dark),
            -4px -4px 8px var(--neu-shadow-light);
        }

        .neu-btn--danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .neu-btn--icon {
          width: 44px;
          height: 44px;
          padding: 0;
          border-radius: 50%;
        }

        .neu-btn--full {
          width: 100%;
        }

        .neu-btn__icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .neu-btn__text {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </motion.button>
  );
});

NeuButton.displayName = 'NeuButton';

export default NeuButton;
