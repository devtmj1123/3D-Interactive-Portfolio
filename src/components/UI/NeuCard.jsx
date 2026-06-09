/**
 * NeuCard Component
 *
 * Neumorphic card component with:
 * - Hover animations
 * - Gradient border effect
 * - Glow on hover
 * - Flexible content slots
 */

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const NeuCard = forwardRef(({
  children,
  variant = 'default',
  hoverable = true,
  glowColor,
  className = '',
  onClick,
  ...props
}, ref) => {
  const variantClasses = {
    default: '',
    flat: 'neu-card--flat',
    outlined: 'neu-card--outlined',
    glow: 'neu-card--glow',
  };

  return (
    <motion.div
      ref={ref}
      className={`neu-card ${variantClasses[variant]} ${hoverable ? 'neu-card--hoverable' : ''} ${className}`}
      onClick={onClick}
      whileHover={hoverable ? { y: -4, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      {...props}
    >
      {/* Gradient border top */}
      <div className="neu-card__border" />

      {/* Content */}
      <div className="neu-card__content">
        {children}
      </div>

      {/* Hover glow */}
      {glowColor && <div className="neu-card__glow" style={{ '--glow-color': glowColor }} />}

      <style>{`
        .neu-card {
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: 24px;
          position: relative;
          overflow: hidden;
          box-shadow:
            10px 10px 20px var(--neu-shadow-dark),
            -10px -10px 20px var(--neu-shadow-light);
          transition: all var(--transition-normal);
        }

        .neu-card--hoverable {
          cursor: pointer;
        }

        .neu-card--hoverable:hover {
          box-shadow:
            14px 14px 28px var(--neu-shadow-dark),
            -14px -14px 28px var(--neu-shadow-light);
        }

        .neu-card__border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
          opacity: 0;
          transition: opacity var(--transition-normal);
        }

        .neu-card--hoverable:hover .neu-card__border {
          opacity: 1;
        }

        .neu-card__content {
          position: relative;
          z-index: 1;
        }

        /* Flat variant */
        .neu-card--flat {
          box-shadow:
            4px 4px 8px var(--neu-shadow-dark),
            -4px -4px 8px var(--neu-shadow-light);
        }

        /* Outlined variant */
        .neu-card--outlined {
          background: transparent;
          box-shadow: none;
          border: 1px solid var(--bg-tertiary);
        }

        .neu-card--outlined:hover {
          border-color: var(--accent-primary);
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.1);
        }

        /* Glow variant */
        .neu-card--glow {
          box-shadow:
            10px 10px 20px var(--neu-shadow-dark),
            -10px -10px 20px var(--neu-shadow-light),
            0 0 40px rgba(124, 58, 237, 0.1);
        }

        .neu-card--glow:hover {
          box-shadow:
            14px 14px 28px var(--neu-shadow-dark),
            -14px -14px 28px var(--neu-shadow-light),
            0 0 60px rgba(124, 58, 237, 0.2);
        }

        .neu-card__glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 200px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, var(--glow-color, var(--accent-primary)) 0%, transparent 70%);
          opacity: 0;
          transition: opacity var(--transition-normal);
          pointer-events: none;
        }

        .neu-card--hoverable:hover .neu-card__glow {
          opacity: 0.1;
        }

        /* Focus styles */
        .neu-card:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }
      `}</style>
    </motion.div>
  );
});

NeuCard.displayName = 'NeuCard';

// Card sub-components
export const CardHeader = ({ children, className = '' }) => (
  <div className={`neu-card__header ${className}`}>
    {children}
    <style>{`
      .neu-card__header {
        margin-bottom: 16px;
      }
    `}</style>
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`neu-card__title ${className}`}>
    {children}
    <style>{`
      .neu-card__title {
        font-family: var(--font-display);
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
      }
    `}</style>
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`neu-card__description ${className}`}>
    {children}
    <style>{`
      .neu-card__description {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.5;
      }
    `}</style>
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`neu-card__body ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`neu-card__footer ${className}`}>
    {children}
    <style>{`
      .neu-card__footer {
        margin-top: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `}</style>
  </div>
);

export default NeuCard;
