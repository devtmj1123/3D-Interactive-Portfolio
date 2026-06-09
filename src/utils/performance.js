/**
 * Performance Utilities
 *
 * Tools for optimizing portfolio performance:
 * - Lazy loading helpers
 * - Animation frame optimization
 * - Resource preloading
 * - Performance monitoring
 */

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 100) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Request animation frame with fallback
 * @param {Function} callback - Animation callback
 * @returns {number} Animation frame ID
 */
export const requestAnimFrame = (() => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

/**
 * Cancel animation frame with fallback
 * @param {number} id - Animation frame ID
 */
export const cancelAnimFrame = (() => {
  return (
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    function (id) {
      window.clearTimeout(id);
    }
  );
})();

/**
 * Preload images for better perceived performance
 * @param {string[]} urls - Array of image URLs to preload
 * @returns {Promise<void[]>}
 */
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        })
    )
  );
};

/**
 * Preload critical resources
 * @param {Object} resources - Resources to preload
 * @param {string[]} resources.fonts - Font URLs
 * @param {string[]} resources.images - Image URLs
 * @param {string[]} resources.scripts - Script URLs
 */
export const preloadCriticalResources = ({ fonts = [], images = [], scripts = [] }) => {
  // Preload fonts
  fonts.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = font;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload images
  images.forEach((image) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = image;
    document.head.appendChild(link);
  });

  // Preload scripts
  scripts.forEach((script) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = script;
    document.head.appendChild(link);
  });
};

/**
 * Intersection Observer for lazy loading
 * @param {Function} callback - Callback when element is visible
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver}
 */
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

/**
 * Performance monitor class
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.startTimes = {};
  }

  /**
   * Start timing an operation
   * @param {string} name - Operation name
   */
  start(name) {
    this.startTimes[name] = performance.now();
  }

  /**
   * End timing an operation
   * @param {string} name - Operation name
   * @returns {number} Duration in milliseconds
   */
  end(name) {
    if (!this.startTimes[name]) {
      console.warn(`No start time found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - this.startTimes[name];
    this.metrics[name] = duration;
    delete this.startTimes[name];

    return duration;
  }

  /**
   * Get all metrics
   * @returns {Object} Performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Log metrics to console
   */
  logMetrics() {
    console.table(this.metrics);
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = {};
    this.startTimes = {};
  }
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get device performance tier
 * @returns {'low' | 'medium' | 'high'}
 */
export const getDevicePerformanceTier = () => {
  if (typeof navigator === 'undefined') return 'medium';

  // Check for hardware concurrency
  const cores = navigator.hardwareConcurrency || 4;

  // Check for device memory (if available)
  const memory = navigator.deviceMemory || 4;

  if (cores <= 2 || memory <= 2) return 'low';
  if (cores >= 8 && memory >= 8) return 'high';
  return 'medium';
};

/**
 * Optimize animations based on device capability
 * @returns {Object} Animation settings
 */
export const getOptimizedAnimationSettings = () => {
  const tier = getDevicePerformanceTier();
  const reducedMotion = prefersReducedMotion();

  if (reducedMotion) {
    return {
      duration: 0,
      delay: 0,
      stagger: 0,
      particles: 0,
    };
  }

  switch (tier) {
    case 'low':
      return {
        duration: 0.3,
        delay: 0,
        stagger: 0.05,
        particles: 50,
      };
    case 'high':
      return {
        duration: 0.6,
        delay: 0.2,
        stagger: 0.1,
        particles: 200,
      };
    default:
      return {
        duration: 0.5,
        delay: 0.1,
        stagger: 0.08,
        particles: 100,
      };
  }
};

export default {
  debounce,
  throttle,
  requestAnimFrame,
  cancelAnimFrame,
  preloadImages,
  preloadCriticalResources,
  createIntersectionObserver,
  PerformanceMonitor,
  prefersReducedMotion,
  getDevicePerformanceTier,
  getOptimizedAnimationSettings,
};
