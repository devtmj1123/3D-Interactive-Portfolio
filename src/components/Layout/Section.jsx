/**
 * Section Component
 *
 * Layout section with:
 * - Animated entrance
 * - Responsive padding
 * - Optional background effects
 * - Intersection observer for scroll animations
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Section = ({
  children,
  id,
  className = '',
  variant = 'default',
  withGlow = false,
  delay = 0,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const variantClasses = {
    default: '',
    centered: 'section--centered',
    fullHeight: 'section--full-height',
  };

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`section ${variantClasses[variant]} ${withGlow ? 'section--glow' : ''} ${className}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      {withGlow && <div className="section__glow" aria-hidden="true" />}
      <div className="section__container">
        {children}
      </div>

      <style>{`
        .section {
          position: relative;
          padding: 100px 24px;
          overflow: hidden;
        }

        .section--centered {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .section--full-height {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .section__container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .section__glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 600px;
          height: 600px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .section--glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
          opacity: 0.3;
        }

        @media (max-width: 768px) {
          .section {
            padding: 60px 16px;
          }
        }
      `}</style>
    </motion.section>
  );
};

// Section header sub-component
export const SectionHeader = ({ badge, title, description, centered = true }) => (
  <div className={`section-header ${centered ? 'section-header--centered' : ''}`}>
    {badge && (
      <span className="section-header__badge">{badge}</span>
    )}
    <h2 id={`${title?.toLowerCase().replace(/\s+/g, '-')}-heading`} className="section-header__title">
      {title}
    </h2>
    {description && (
      <p className="section-header__description">{description}</p>
    )}

    <style>{`
      .section-header {
        margin-bottom: 60px;
      }

      .section-header--centered {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .section-header__badge {
        display: inline-flex;
        align-items: center;
        padding: 6px 16px;
        background: rgba(124, 58, 237, 0.1);
        border: 1px solid rgba(124, 58, 237, 0.2);
        border-radius: 9999px;
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--accent-primary);
        margin-bottom: 16px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .section-header__title {
        font-family: var(--font-display);
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 16px;
        line-height: 1.2;
      }

      .section-header__description {
        color: var(--text-secondary);
        font-size: 1.1rem;
        max-width: 600px;
        line-height: 1.6;
      }

      @media (max-width: 768px) {
        .section-header {
          margin-bottom: 40px;
        }
      }
    `}</style>
  </div>
);

export default Section;
