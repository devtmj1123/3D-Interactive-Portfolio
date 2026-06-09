/**
 * NeuMenu Component
 *
 * Neumorphic navigation menu with:
 * - Responsive mobile drawer
 * - Active state indicators
 * - Smooth transitions
 * - Keyboard navigation
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeuButton from './NeuButton';

const NeuMenu = ({ items = [], activeSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (sectionId) => {
    onNavigate(sectionId);
    setIsOpen(false);
  };

  return (
    <nav
      ref={menuRef}
      className={`neu-menu ${scrolled ? 'neu-menu--scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="neu-menu__container">
        {/* Logo */}
        <a href="#home" className="neu-menu__logo" aria-label="Home">
          <span className="neu-menu__logo-icon">✦</span>
          <span className="neu-menu__logo-text">Portfolio</span>
        </a>

        {/* Desktop menu */}
        <ul className="neu-menu__list" role="menubar">
          {items.map((item) => (
            <li key={item.id} role="none">
              <a
                href={`#${item.id}`}
                className={`neu-menu__item ${activeSection === item.id ? 'neu-menu__item--active' : ''}`}
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.id);
                }}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.icon && <span className="neu-menu__item-icon">{item.icon}</span>}
                <span className="neu-menu__item-text">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    className="neu-menu__indicator"
                    layoutId="menu-indicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="neu-menu__cta">
          <NeuButton
            variant="primary"
            size="sm"
            onClick={() => handleNavigate('contact')}
          >
            Contact Me
          </NeuButton>
        </div>

        {/* Mobile menu button */}
        <button
          className="neu-menu__toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`neu-menu__toggle-icon ${isOpen ? 'neu-menu__toggle-icon--open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="neu-menu__mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="neu-menu__mobile-list" role="menu">
              {items.map((item, index) => (
                <motion.li
                  key={item.id}
                  role="none"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a
                    href={`#${item.id}`}
                    className={`neu-menu__mobile-item ${activeSection === item.id ? 'neu-menu__mobile-item--active' : ''}`}
                    role="menuitem"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate(item.id);
                    }}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .neu-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 16px 24px;
          transition: all var(--transition-normal);
        }

        .neu-menu--scrolled {
          background: rgba(10, 10, 26, 0.9);
          backdrop-filter: blur(20px);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(124, 58, 237, 0.05);
        }

        .neu-menu__container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .neu-menu__logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--text-primary);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.25rem;
        }

        .neu-menu__logo-icon {
          color: var(--accent-primary);
          font-size: 1.5rem;
        }

        .neu-menu__list {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
        }

        .neu-menu__item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: var(--radius-md);
          position: relative;
          transition: all var(--transition-fast);
        }

        .neu-menu__item:hover {
          color: var(--text-primary);
          background: rgba(124, 58, 237, 0.1);
        }

        .neu-menu__item--active {
          color: var(--text-primary);
        }

        .neu-menu__item-icon {
          font-size: 1rem;
        }

        .neu-menu__indicator {
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 2px;
          background: var(--accent-primary);
          border-radius: 1px;
        }

        .neu-menu__cta {
          display: flex;
          align-items: center;
        }

        .neu-menu__toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .neu-menu__toggle-icon {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 24px;
        }

        .neu-menu__toggle-icon span {
          display: block;
          height: 2px;
          background: var(--text-primary);
          border-radius: 1px;
          transition: all var(--transition-fast);
        }

        .neu-menu__toggle-icon--open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .neu-menu__toggle-icon--open span:nth-child(2) {
          opacity: 0;
        }

        .neu-menu__toggle-icon--open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .neu-menu__mobile {
          position: absolute;
          top: 100%;
          left: 16px;
          right: 16px;
          background: rgba(22, 22, 58, 0.95);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: 16px;
          box-shadow:
            10px 10px 20px rgba(0, 0, 0, 0.3),
            -10px -10px 20px rgba(124, 58, 237, 0.05);
        }

        .neu-menu__mobile-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .neu-menu__mobile-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 1rem;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .neu-menu__mobile-item:hover {
          color: var(--text-primary);
          background: rgba(124, 58, 237, 0.1);
        }

        .neu-menu__mobile-item--active {
          color: var(--accent-primary);
          background: rgba(124, 58, 237, 0.1);
        }

        @media (max-width: 768px) {
          .neu-menu__list,
          .neu-menu__cta {
            display: none;
          }

          .neu-menu__toggle {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
};

export default NeuMenu;
