/**
 * Accessibility Utilities
 *
 * Tools for ensuring WCAG 2.1 compliance:
 * - Focus management
 * - Screen reader announcements
 * - Keyboard navigation
 * - Color contrast helpers
 * - Motion preferences
 */

/**
 * Trap focus within an element (for modals, dialogs)
 * @param {HTMLElement} element - Container element
 * @returns {Function} Cleanup function
 */
export const trapFocus = (element) => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  const focusableElements = element.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstFocusable?.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {'polite' | 'assertive'} priority - Announcement priority
 */
export const announce = (message, priority = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('role', 'status');
  announcer.style.position = 'absolute';
  announcer.style.left = '-9999px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';

  document.body.appendChild(announcer);

  // Small delay to ensure screen readers pick up the change
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);

  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
};

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - Container element
 * @returns {HTMLElement[]} Array of focusable elements
 */
export const getFocusableElements = (container) => {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(selectors));
};

/**
 * Create keyboard navigation handler for a list of items
 * @param {HTMLElement[]} items - Navigable items
 * @param {Object} options - Navigation options
 * @returns {Function} Keydown handler
 */
export const createKeyboardNavigator = (items, options = {}) => {
  const { loop = true, orientation = 'vertical' } = options;

  return (e) => {
    const currentIndex = items.indexOf(document.activeElement);
    let nextIndex;

    switch (e.key) {
      case 'ArrowDown':
      case orientation === 'horizontal' ? 'ArrowRight' : null:
        e.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) {
          nextIndex = loop ? 0 : items.length - 1;
        }
        break;

      case 'ArrowUp':
      case orientation === 'horizontal' ? 'ArrowLeft' : null:
        e.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = loop ? items.length - 1 : 0;
        }
        break;

      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;

      case 'End':
        e.preventDefault();
        nextIndex = items.length - 1;
        break;

      default:
        return;
    }

    items[nextIndex]?.focus();
  };
};

/**
 * Calculate color contrast ratio
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio
 */
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (hex) => {
    const rgb = hex
      .replace('#', '')
      .match(/.{2}/g)
      .map((x) => {
        const val = parseInt(x, 16) / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if color contrast meets WCAG standards
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @param {'AA' | 'AAA'} level - WCAG level
 * @param {'normal' | 'large'} textSize - Text size
 * @returns {boolean} Whether contrast meets standards
 */
export const meetsContrastStandards = (foreground, background, level = 'AA', textSize = 'normal') => {
  const ratio = getContrastRatio(foreground, background);

  const requirements = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 },
  };

  return ratio >= requirements[level][textSize];
};

/**
 * Get user motion preference
 * @returns {'no-preference' | 'reduce'}
 */
export const getMotionPreference = () => {
  if (typeof window === 'undefined') return 'no-preference';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'reduce'
    : 'no-preference';
};

/**
 * Create motion-safe animation variants
 * @param {Object} variants - Framer Motion variants
 * @returns {Object} Motion-safe variants
 */
export const createMotionSafeVariants = (variants) => {
  const motionPreference = getMotionPreference();

  if (motionPreference === 'reduce') {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0 },
    };
  }

  return variants;
};

/**
 * Add skip link to page
 * @param {string} targetId - Target element ID
 * @param {string} text - Skip link text
 */
export const addSkipLink = (targetId, text = 'Skip to main content') => {
  const existing = document.querySelector('.skip-link');
  if (existing) return;

  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = text;

  document.body.insertBefore(skipLink, document.body.firstChild);
};

/**
 * Manage focus restoration
 * @returns {Object} Focus manager
 */
export const createFocusManager = () => {
  let previousFocus = null;

  return {
    /**
     * Save current focus
     */
    save() {
      previousFocus = document.activeElement;
    },

    /**
     * Restore saved focus
     */
    restore() {
      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
        previousFocus = null;
      }
    },

    /**
     * Focus first focusable element in container
     * @param {HTMLElement} container
     */
    focusFirst(container) {
      const focusable = getFocusableElements(container);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    },
  };
};

/**
 * Detect screen reader usage
 * @returns {boolean}
 */
export const isScreenReaderActive = () => {
  if (typeof window === 'undefined') return false;

  // Check for common screen reader indicators
  return !!(
    navigator.userAgent.match(/NVDA|JAWS|VoiceOver|TalkBack/i) ||
    window.speechSynthesis?.getVoices().length > 0
  );
};

/**
 * Add ARIA attributes to element
 * @param {HTMLElement} element - Target element
 * @param {Object} attributes - ARIA attributes
 */
export const addAriaAttributes = (element, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    const attrName = key.startsWith('aria-') ? key : `aria-${key}`;
    element.setAttribute(attrName, value);
  });
};

/**
 * Create live region for dynamic content
 * @param {string} id - Region ID
 * @param {'polite' | 'assertive'} priority - Announcement priority
 * @returns {HTMLElement} Live region element
 */
export const createLiveRegion = (id, priority = 'polite') => {
  let region = document.getElementById(id);

  if (!region) {
    region = document.createElement('div');
    region.id = id;
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', 'status');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }

  return region;
};

export default {
  trapFocus,
  announce,
  getFocusableElements,
  createKeyboardNavigator,
  getContrastRatio,
  meetsContrastStandards,
  getMotionPreference,
  createMotionSafeVariants,
  addSkipLink,
  createFocusManager,
  isScreenReaderActive,
  addAriaAttributes,
  createLiveRegion,
};
